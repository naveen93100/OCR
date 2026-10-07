import { openAi } from '../config/openAi.js';
import sharp from 'sharp';
import Lead from '../models/LeadModel.js'

export const scanCard = async (req, res) => {
    try {

        // let { customerName, companyName, city, requirement, email, mobileNo } = req.body;

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
        return res.status(500).json({
            success: false,
            message: er?.message
        });
    }
};

export const createLead = async (req, res) => {
    try {

        let { userId } = req.user;
        let { customerName, companyName, city, requirement, email, mobileNo } = req.body;

        if (!city || !mobileNo) return res.status(400).json({ success: false, message: "City and MobileNo is required.." });

        const mobileNoRegx = /^[6-9]\d{9}$/;
        if (!mobileNoRegx.test(mobileNo)) return res.status(400).json({ success: false, message: "Invalid MobileNo.." });

        if (email) {
            const emailRegx = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegx.test(email)) return res.status(400).json({ success: false, message: "Invalid email address.." });
        }

        let createLead = {};

        if (customerName) createLead.customerName = customerName;
        if (companyName) createLead.companyName = companyName;
        if (city) createLead.city = city;
        if (requirement) createLead.requirement = requirement;
        if (email) createLead.email = email;
        if (mobileNo) createLead.mobileNo = mobileNo;

        createLead.executivePersonId = userId;

        let savedLead = await Lead.create(createLead);

        return res.status(200).json({ success: true, message: "Lead Saved successfully..", savedLead });


    } catch (er) {
        return res.status(500).json({ success: false, message: er?.message });
    }
}