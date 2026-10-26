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
- state
- requirement
- email
- mobileno
- alternateMobileNo

Return only valid JSON in exactly this format:

{
    "customerName": "",
    "companyName": "",
    "city": "",
    "state": "",
    "requirement": "",
    "email": "",
    "mobileno": "",
    "alternateMobileNo": ""
}

Card selection rules:
- The image may contain more than one card, or show parts of other cards at the edges.
- Extract details only from the single card that is centered in the image and fills most of it.
- Ignore any other card, including cards that are partially visible above, below, or beside the centered card.
- Never combine or mix details from different cards.
- Ignore text that is cut off at the edges of the image and clearly belongs to a different card.
- If you cannot tell which card is the centered one, return an empty string for every field.

General rules:
- If a field is missing or cannot be read reliably, return an empty string.
- Do not guess or invent information.
- Preserve the actual spelling as written in the image.
- Carefully read both printed and handwritten text.
- Return all extracted values as strings.
- Return only valid JSON without explanation or markdown.

State extraction rules:
- Extract the state only if it is written on the card, usually in the address or next to the city or pincode.
- Do not infer the state from the city, pincode, or phone number.
- If the state is written as an abbreviation (for example "UP", "MH", "HR"), return it exactly as written.
- If no state is written, return an empty string.
- Do not put a country name in the state field.

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
