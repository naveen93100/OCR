import { openAi } from '../config/openAi.js';
import sharp from 'sharp';
import Lead from '../models/LeadModel.js'
import XLSX from 'xlsx';
import { createBulkCardLead, createCardLead } from '../services/cardExtraction.js';
import CardLead from '../models/cardLeadModel.js';
import mongoose from 'mongoose';
import { sendVerificationWhatsApp } from '../config/Aisensy.js';
import { sendEnquiry } from '../utils/sendEnquiry.js';

export const getExecutiveDashboardData = async (req, res) => {
    try {

        let { userId } = req.user;
        let [cardLead, verified, cards] = await Promise.all([
            CardLead.countDocuments({ executiveUserId: userId, status: { $ne: 'verified' } }),
            Lead.countDocuments({ executiveUserId: userId }),
            CardLead.aggregate([
                {
                    $match: {
                        executiveUserId: userId
                    }
                },
                {
                    $facet: {
                        pending: [
                            { $match: { status: 'pending' } },
                            { $count: 'count' }
                        ],
                        unverified: [
                            { $match: { status: 'un-verified' } },
                            { $count: 'count' }
                        ],
                        rejected: [
                            { $match: { status: 'rejected' } },
                            { $count: 'count' }
                        ],
                    }
                },
                {
                    $project: {
                        pending: {
                            $ifNull: [{ $arrayElemAt: ["$pending.count", 0] }, 0]
                        },
                        unverified: {
                            $ifNull: [{ $arrayElemAt: ["$unverified.count", 0] }, 0]
                        },
                        rejected: {
                            $ifNull: [{ $arrayElemAt: ["$rejected.count", 0] }, 0]
                        }
                    }
                }
            ])
        ])

        const statusCounts = cards[0] || {
            pending: 0,
            unverified: 0,
            rejected: 0
        };

        return res.status(200).json({
            success: true,
            total: cardLead + verified,
            pending: statusCounts.pending,
            verified,
            unverified: statusCounts.unverified,
            rejected: statusCounts.rejected
        });

    } catch (er) {
        return res.status(500).json({ success: false, message: er?.message });
    }
}

export const updateCardStatus = async (req, res) => {
    try {
        let { cardId } = req.params;
        let { status, rejectionReason } = req.body;
        let { userId } = req.user;


        if (!cardId || !mongoose.isValidObjectId(cardId)) return res.status(400).json({ success: false, message: "Invalid or missing cardId.." });

        const card = await CardLead.findOne({ _id: cardId, executiveUserId: userId });

        if (!card) return res.status(404).json({ success: false, message: "Card not found.." });


        const validStatus = {
            'rejected': [],
            'un-verified': ['verified', 'rejected'],
            "pending": [],
            "verified": [],
            "failed": []
        };

        if (card.status === 'verified') return res.status(400).json({ success: false, message: "Lead is already verified.." });

        if (!Object.hasOwn(validStatus, card.status) || !validStatus[card.status].includes(status)) {
            return res.status(400).json({ success: false, message: "Invalid Status type.." });
        }

        if (card && !card?.state?.trim()) return res.status(400).json({ success: false, message: "State is Required.." });

        if (!card?.email?.trim() && !card?.mobileNo?.trim()) return res.status(400).json({ success: false, message: "Email or mobileNo is required.." });

        const duplicateConditions = [];

        if (card.email) {
            duplicateConditions.push({ email: card.email });
        }

        if (card.mobileNo) {
            duplicateConditions.push({ mobileNo: card.mobileNo });
        }

        const mobileNoRegx = /^[6-9]\d{9}$/;


        if (status === 'verified') {

            // let exist = await Lead.findOne({ $or: duplicateConditions });
            // if (exist) return res.status(409).json({ success: true, message: `A lead already exist with this email or mobile number to ${exist?.executiveUserId}` })

            if (!card?.mobileNo) return res.status(400).json({ success: false, message: "Cannot verify without mobileNo.." });

            if (!mobileNoRegx.test(card?.mobileNo)) return res.status(400).json({ success: false, message: "Invalid mobile number. Please correct it before verifying the card.." });

            let updated = await CardLead.findByIdAndUpdate(cardId, { $set: { status, rejectionReason } }, { new: true, runValidators: true });

            // send data to crm
            const quantity = String(updated.requirement || "").match(/\d+(?:\.\d+)?/);
            const parsedQuantity = quantity ? Number(quantity[0]) : 0;

            if(parsedQuantity!==0){   
                let sendData = await sendEnquiry(updated);
                console.log(sendData);
            }

            await Lead.create({
                customerName: updated?.customerName,
                companyName: updated?.companyName,
                mobileNo: updated?.mobileNo,
                email: updated?.email,
                city: updated?.city,
                state: updated?.state,
                requirement: updated?.requirement,
                executiveUserId: updated.executiveUserId,
                contactType: updated?.contactType
            });

            if (updated?.mobileNo && updated?.contactType === 'non-supplier') {
                await sendVerificationWhatsApp(updated?.mobileNo);
                console.log("send message.");
            }

            return res.status(200).json({ success: true, message: "Lead successfully verified..", updated });
        }

        if (status === 'rejected') {
            let updated = await CardLead.findByIdAndUpdate(cardId, { $set: { status, rejectionReason } }, { new: true, runValidators: true });
            return res.status(200).json({ success: true, message: "Lead rejected successfully..", updated });
        }


    } catch (er) {
        return res.status(500).json({ success: false, message: er?.message });
    }
}

// export const updateCard = async (req, res) => {
//     try {
//         let { cardId } = req.params;
//         let { userId } = req.user;

//         if (!cardId || !mongoose.isValidObjectId(cardId)) return res.status(400).json({ success: false, message: "Invalid Card Id.." });

//         let { customerName, companyName, city, requirement, email, mobileNo, contactType, alternateMobileNo, state } = req.body;

//         if (!city) return res.status(400).json({ success: false, message: "City  is required.." });

//         if (!mobileNo) return res.status(400).json({ success: false, message: "MobileNo is required.." });


//         const mobileNoRegx = /^[6-9]\d{9}$/;
//         if (!mobileNoRegx.test(mobileNo)) return res.status(400).json({ success: false, message: "Invalid MobileNo.." });


//         if (email) {
//             const emailRegx = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//             if (!emailRegx.test(email)) return res.status(400).json({ success: false, message: "Invalid email address.." });
//         }

//         let updateLead = {};

//         if (customerName) updateLead.customerName = customerName;
//         if (companyName) updateLead.companyName = companyName;
//         if (city) updateLead.city = city;
//         if (requirement) updateLead.requirement = requirement;
//         if (state) updateLead.state = state;


//         const normalizedEmail = email?.trim().toLowerCase() || "";

//         if (normalizedEmail) {
//             const emailRegx = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

//             if (!emailRegx.test(normalizedEmail)) {
//                 return res.status(400).json({
//                     success: false,
//                     message: "Invalid email address."
//                 });
//             }

//             const emailExist = await CardLead.findOne({
//                 email: normalizedEmail,
//                 _id: { $ne: cardId }
//             });

//             if (emailExist) {
//                 return res.status(409).json({
//                     success: false,
//                     message: "Email already exists."
//                 });
//             }

//             updateLead.email = normalizedEmail;
//         } else if (email !== undefined) {
//             updateLead.email = undefined;
//         }

//         if (mobileNo) {

//             const isMobileExist = await CardLead.findOne({ _id: { $ne: cardId }, $or: [{ mobileNo }, { alternateMobileNo: mobileNo }] });

//             if (isMobileExist) {
//                 return res.status(409).json({ success: false, message: "MobileNo already exists.." });
//             }
//             updateLead.mobileNo = mobileNo;

//         }

//         if (alternateMobileNo) {
//             const mobileNoRegx = /^[6-9]\d{9}$/;
//             if (!mobileNoRegx.test(alternateMobileNo)) return res.status(400).json({ success: false, message: "Invalid Alternate MobileNo.." });

//             const isMobileExist = await CardLead.findOne({ _id: { $ne: cardId }, $or: [{ alternateMobileNo }, { mobileNo: alternateMobileNo }] });

//             if (isMobileExist) {
//                 return res.status(409).json({ success: false, message: "Alternate mobile number already exists.." });
//             }
//             updateLead.alternateMobileNo = alternateMobileNo;

//         }

//         updateLead.contactType = contactType;

//         const update = await CardLead.findOneAndUpdate(
//             { _id: cardId, executiveUserId: userId, status: 'un-verified' },
//             { $set: updateLead },
//             { returnDocument: 'after', runValidators: true }
//         );

//         if (!update) return res.status(404).json({ success: false, message: "Card not found or cannot be edited." });

//         return res.status(200).json({ success: true, message: "Lead Updated successfully..", update });


//     } catch (er) {
//         return res.status(500).json({ success: false, message: er?.message });
//     }
// }


export const updateCard = async (req, res) => {
    try {
        const { cardId } = req.params;
        const { userId } = req.user;

        if (!cardId || !mongoose.isValidObjectId(cardId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid Card Id."
            });
        }

        const {
            customerName,
            companyName,
            city,
            requirement,
            email,
            mobileNo,
            contactType,
            alternateMobileNo,
            state
        } = req.body;

        if (!city?.trim()) {
            return res.status(400).json({
                success: false,
                message: "City is required."
            });
        }

        const normalizedMobile = mobileNo?.trim();

        const mobileRegex = /^[6-9]\d{9}$/;

        if (!normalizedMobile || !mobileRegex.test(normalizedMobile)) {
            return res.status(400).json({
                success: false,
                message: "A valid 10-digit mobile number is required."
            });
        }

        const normalizedAlternateMobile = alternateMobileNo?.trim() || "";

        if (
            normalizedAlternateMobile &&
            !mobileRegex.test(normalizedAlternateMobile)
        ) {
            return res.status(400).json({
                success: false,
                message: "Invalid alternate mobile number."
            });
        }

        if (
            normalizedAlternateMobile &&
            normalizedAlternateMobile === normalizedMobile
        ) {
            return res.status(400).json({
                success: false,
                message: "Primary and alternate mobile numbers cannot be the same."
            });
        }

        const normalizedEmail = email?.trim().toLowerCase() || "";

        if (normalizedEmail) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

            if (!emailRegex.test(normalizedEmail)) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid email address."
                });
            }
        }

        // const mobileExist = await CardLead.findOne({
        //     _id: { $ne: cardId },
        //     $or: [
        //         { mobileNo: normalizedMobile },
        //         { alternateMobileNo: normalizedMobile },
        //         ...(normalizedAlternateMobile
        //             ? [
        //                 { mobileNo: normalizedAlternateMobile },
        //                 { alternateMobileNo: normalizedAlternateMobile }
        //             ]
        //             : [])
        //     ]
        // });


        const updateLead = {};
        const unsetLead = {};

        if (customerName !== undefined) {
            updateLead.customerName = customerName;
        }

        if (companyName !== undefined) {
            updateLead.companyName = companyName;
        }

        updateLead.city = city.trim();

        if (requirement !== undefined) {
            updateLead.requirement = requirement;
        }

        if (state !== undefined) {
            updateLead.state = state;
        }

        updateLead.mobileNo = normalizedMobile;

        if (normalizedAlternateMobile) {
            updateLead.alternateMobileNo = normalizedAlternateMobile;
        } else if (alternateMobileNo !== undefined) {
            unsetLead.alternateMobileNo = 1;
        }

        if (normalizedEmail) {
            updateLead.email = normalizedEmail;
        } else if (email !== undefined) {
            unsetLead.email = 1;
        }

        if (contactType !== undefined) {
            updateLead.contactType = contactType;
        }

        const updateOperations = {};

        if (Object.keys(updateLead).length) {
            updateOperations.$set = updateLead;
        }

        if (Object.keys(unsetLead).length) {
            updateOperations.$unset = unsetLead;
        }

        const update = await CardLead.findOneAndUpdate(
            {
                _id: cardId,
                executiveUserId: userId,
                status: "un-verified"
            },
            updateOperations,
            {
                new: true,
                runValidators: true
            }
        );

        if (!update) {
            return res.status(404).json({
                success: false,
                message: "Card not found or cannot be edited."
            });
        }

        return res.status(200).json({
            success: true,
            message: "Lead updated successfully.",
            update
        });
    } catch (er) {
        if (er?.code === 11000) {
            return res.status(409).json({
                success: false,
                message: "Email or mobile number already exists."
            });
        }

        console.error("updateCard error:", er);

        return res.status(500).json({
            success: false,
            message: "Internal server error."
        });
    }
};


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

export const getVerifiedLead = async (req, res) => {
    try {
        let { userId } = req.user;
        let { pageNo, limit } = req.query;

        pageNo = parseInt(pageNo) || 1;
        limit = parseInt(limit) || 5;

        let lead = await Lead.find({ executiveUserId: userId }).skip((pageNo - 1) * limit).limit(limit + 1);
        const hasNext = lead.length > limit;

        if (hasNext) lead.pop();

        return res.status(200).json({ success: true, lead, hasNext });

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

export const getCardHistory = async (req, res) => {
    try {
        const { status } = req.params;
        let { pageNo, limit } = req.query;
        const { userId } = req.user;

        pageNo = parseInt(pageNo) || 1;
        limit = parseInt(limit) || 5;

        const validStatus = ['pending', 'rejected', 'un-verified', 'failed'];

        if (!validStatus.includes(status)) return res.status(400).json({ success: false, message: "Invalid status type.." });


        let leads = await CardLead.find({ executiveUserId: userId, status }).skip((pageNo - 1) * limit).limit(limit + 1);

        const hasNext = leads.length > limit;
        if (hasNext) leads.pop();


        let formatLead = leads?.map((i) => {
            return {
                _id: i?._id,
                executiveUserId: i?.executiveUserId,
                // imagePath: `http://localhost:3001/uploads/cards/${i?.imagePath}`,
                imagePath: `https://ocr.gautamsolar.com/uploads/cards/${i?.imagePath}`,
                companyName: i?.companyName,
                customerName: i?.customerName,
                mobileNo: i?.mobileNo,
                alternateMobileNo: i?.alternateMobileNo,
                email: i?.email,
                requirement: i?.requirement,
                status: i?.status,
                rejectionReason: i?.rejectionReason,
                city: i?.city,
                state: i?.state,
                createdAt: new Date(i?.createdAt),
                contactType: i?.contactType
            }
        })


        return res.status(200).json({ success: true, formatLead, hasNext });

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
                    state: 1,
                    requirement: 1,
                    email: 1,
                    mobileNo: 1,
                    alternateMobileNo: 1,
                    createdAt: 1,
                    contactType: 1,

                }
            }
        ]);

        let excelData = leads.map((i) => {
            return {
                executiveName: i?.executiveName,
                customerName: i?.customerName || 'N/A',
                city: i?.city,
                state: i?.state,
                requirement: i?.requirement || 'N/A',
                mobileNo: i?.mobileNo,
                alternateMobileNo: i?.alternateMobileNo || 'N/A',
                companyName: i?.companyName || 'N/A',
                createdAt: new Date(i?.createdAt),
                contactType: i?.contactType
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