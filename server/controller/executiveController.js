import { openAi } from '../config/openAi.js';
import sharp from 'sharp';
import Lead from '../models/LeadModel.js'
import XLSX from 'xlsx';
import { createBulkCardLead, createCardLead } from '../services/cardExtraction.js';
import CardLead from '../models/cardLeadModel.js';
import mongoose from 'mongoose';


export const updateCardStatus = async (req, res) => {
    try {
        let { cardId } = req.params;
        let { status } = req.body;
        let { userId } = req.user;


        if (!cardId || !mongoose.isValidObjectId(cardId)) return res.status(400).json({ success: false, message: "Invalid or missing cardId.." });

        const card = await CardLead.findOne({ _id: cardId, executiveUserId: userId });

        if (!card) return res.status(404).json({ success: false, message: "Card not found.." });

        const validStatus = {
            'rejected': [],
            'un-verified': ['verified','rejected'],
            "pending": [],
            "verified": [],
            "failed": []
        };

        if (!Object.hasOwn(validStatus, card.status) || !validStatus[card.status].includes(status)) {
            return res.status(400).json({ success: false, message: "Invalid Status type.." });
        }


        let updated = await CardLead.findByIdAndUpdate(cardId, { $set: { status } }, { new: true, runValidators: true });

        const { imagePath, _id, ...leadData } = updated.toObject();

        if (status === 'verified') {
            await Lead.create({
                customerName: updated?.customerName,
                companyName: updated?.companyName,
                mobileNo: updated.mobileNo,
                email: updated.email,
                city: updated.city,
                requirement: updated?.requirement,
                executiveUserId: updated.executiveUserId,
            });
        }

        return res.status(200).json({ success: true, message: "Status has changed..", updated });

    } catch (er) {
        return res.status(500).json({ success: false, message: er?.message });
    }
}

export const updateCard = async (req, res) => {
    try {
        let { cardId } = req.params;
        let { userId } = req.user;

        if (!cardId || !mongoose.isValidObjectId(cardId)) return res.status(400).json({ success: false, message: "Invalid Card Id.." });

        let { customerName, companyName, city, requirement, email, mobileNo } = req.body;

        if (!city || !mobileNo) return res.status(400).json({ success: false, message: "City and MobileNo is required.." });


        const mobileNoRegx = /^[6-9]\d{9}$/;
        if (!mobileNoRegx.test(mobileNo)) return res.status(400).json({ success: false, message: "Invalid MobileNo.." });


        if (email) {
            const emailRegx = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegx.test(email)) return res.status(400).json({ success: false, message: "Invalid email address.." });
        }

        let updateLead = {};

        if (customerName) updateLead.customerName = customerName;
        if (companyName) updateLead.companyName = companyName;
        if (city) updateLead.city = city;
        if (requirement) updateLead.requirement = requirement;
        if (email) {
            let emailExist = await CardLead.findOne({ email, _id: { $ne: cardId } });
            if (emailExist) return res.status(409).json({ success: false, message: "Email is already exist.." });

            updateLead.email = email;
        }
        if (mobileNo) {
            const isMobileExist = await CardLead.findOne({ mobileNo, _id: { $ne: cardId } });

            if (isMobileExist) {
                return res.status(409).json({ success: false, message: "MobileNo already exists.." });
            }
            updateLead.mobileNo = mobileNo;

        }


        const update = await CardLead.findOneAndUpdate(
            { _id: cardId, executiveUserId: userId, status: { $in: ['un-verified', 'failed'] } },
            { $set: updateLead },
            { returnDocument: 'after', runValidators: true }
        );

        if (!update) return res.status(404).json({ success: false, message: "Card not found or cannot be edited." });

        return res.status(200).json({ success: true, message: "Lead Updated successfully..", update });


    } catch (er) {
        return res.status(500).json({ success: false, message: er?.message });
    }
}

export const bulkUpload = async (req, res) => {
    try {

        if (!req.files) return res.status(400).json({ success: false, message: "Please Upload Images.." })

        let { userId } = req.user

        for (let i of req.files) {
            await createBulkCardLead({ filename: i.filename, executiveUserId: userId });
        }

        return res.status(200).json({ success: true, message: "Cards are Processing.." });

    } catch (er) {
        return res.status(500).json({ success: false, message: er?.message });
    }
}

export const getLeadHistory = async (req, res) => {
    try {
        let { userId } = req.user;

        if (!userId) return res.status(400).json({ success: false, message: "Id not found.." });

        let leads = await Lead.find({
            executiveUserId: userId,
        })

        return res.status(200).json({ success: true, history: leads });

    } catch (er) {
        return res.status(500).json({ success: false, message: er?.message });
    }
}

export const getPendingCards = async (req, res) => {
    try {
        let { userId } = req.user;

        let pendingCards = await CardLead.find({
            executiveUserId: userId,
            status: 'pending'
        })

        return res.status(200).json({ success: true, pendingCards });
    }
    catch (er) {
        return res.status(500).json({ success: false, message: er?.message });
    }
}

export const scanCard = async (req, res) => {
    try {

        let { userId } = req.user

        if (!req.files) return res.status(400).json({ success: false, message: "Card image is required.." });

        let card = await createCardLead(req.files[0], { executiveUserId: userId });

        return res.status(200).json({ success: true, message: "Card is Processing..", card });


    } catch (er) {
        return res.status(500).json({
            success: false,
            message: er?.message
        });
    }
};


export const downloadExecutiveLeads = async (req, res) => {
    try {
        let { userId } = req.user;

        let leads = await Lead.aggregate([

            {
                $match: {
                    executiveUserId: userId
                }
            }, {
                $lookup: {
                    from: 'users',
                    localField: 'executiveUserId',
                    foreignField: 'userId',
                    as: 'executive'
                }
            },
            {
                $unwind: {
                    path: "$executive",
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $project: {
                    _id: 0,
                    executiveName: "$executive.name",
                    customerName: 1,
                    companyName: 1,
                    city: 1,
                    requirement: 1,
                    email: 1,
                    mobileNo: 1,
                    createdAt: 1
                }
            }
        ]);

        let excelData = leads.map((i) => {
            return {
                executiveName: i?.executiveName,
                customerName: i?.customerName || 'N/A',
                city: i.city,
                requirement: i?.requirement || 'N/A',
                mobileNo: i?.mobileNo,
                companyName: i?.companyName || 'N/A',
                createdAt: new Date(i?.createdAt)
            }
        })

        const worksheet = XLSX.utils.json_to_sheet(excelData);
        const workbook = XLSX.utils.book_new();

        XLSX.utils.book_append_sheet(
            workbook,
            worksheet,
            'Leads'
        )

        const excelBuffer = XLSX.write(workbook, {
            type: 'buffer',
            bookType: 'xlsx'
        })

        res.setHeader(
            "Content-Disposition",
            'attachement; filename="leads.xlsx"'
        )

        res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
        res.send(excelBuffer);


    } catch (er) {
        return res.status(500).json({ success: false, message: er?.message });
    }
}

export const uploadCard = async (req, res) => {
    try {


        if (!req.file) return res.status(400).json({ success: false, message: "Card image is required.." });

        let reducedImage = await sharp(req.file.buffer).resize({
            width: 700,
            withoutEnlargement: true,
        }).jpeg({ quality: 70 }).toBuffer()


        const base64 = reducedImage.toString('base64');

        const response = await openAi.responses.create({
            model: "gpt-5.6-luna",
            input: [
                {
                    role: "user",
                    content: [
                        {
                            type: "input_text",
                            text: `
            Extract the following information from the image:

            - customerName
            - companyName
            - city
            - requirement
            - email
            - mobileno

            Return only valid JSON in exactly this format:

            {
              "customerName": "",
              "companyName": "",
              "city": "",
              "requirement": "",
              "email": "",
              "mobileno": ""
            }

            Rules:
            - If a field is missing or cannot be read, return an empty string.
            - Do not guess information.
            - Preserve the actual spelling as written in the image.
            - For handwritten text, carefully read the handwriting.
            - Return only JSON. No explanation or markdown.
          `,
                        },
                        {
                            type: "input_image",
                            image_url: `data:image/jpeg;base64,${base64}`,
                        },
                    ],
                },
            ],
        });

        return res.status(200).json({ success: true, data: JSON.parse(response.output_text) });

    } catch (er) {
        return res.status(500).json({ success: false, message: er?.message });
    }
}