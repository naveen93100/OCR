import { openAi } from "../config/openAi.js";

export async function extractImageDetails(buffer) {

    const base64 = buffer.toString('base64');


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
- alternateMobileNo

Return only valid JSON in exactly this format:

{
    "customerName": "",
    "companyName": "",
    "city": "",
    "requirement": "",
    "email": "",
    "mobileno": "",
    "alternateMobileNo": ""
}

General rules:
- If a field is missing or cannot be read reliably, return an empty string.
- Do not guess or invent information.
- Preserve the actual spelling as written in the image.
- Carefully read both printed and handwritten text.
- Return all extracted values as strings.
- Return only valid JSON without explanation or markdown.

Mobile number extraction rules:
- Carefully inspect the area labeled "Phone No.", "Mobile No.", or similar.
- Pay special attention to handwritten digits.
- Read each digit individually from left to right.
- Do not skip digits or confuse one digit with another.
- Return the complete mobile number as written in the image.
- Preserve leading zeros if present.
- Do not add a country code unless it is written in the image.
- If only one mobile number is present, store it in "mobileno" and leave "alternateMobileNo" empty.
- If two mobile numbers are present, store the first in "mobileno" and the second in "alternateMobileNo".
- If more than two mobile numbers are present, store the first two in these fields and ignore the rest.
- If a number is partially visible or cannot be read reliably, return an empty string for that number rather than guessing.
- Do not extract unrelated numbers, such as quantities, postal codes, or project capacities, as mobile numbers.
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


    return response?.output_text;
}
