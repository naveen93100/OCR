import 'dotenv/config'

export const sendVerificationWhatsApp = async (mobileNo) => {
    const response = await fetch(
        "https://backend.aisensy.com/campaign/t1/api/v2",
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                apiKey: process.env.AISENSY_API_KEY,
                campaignName: process.env.AISENSY_CAMPAIGN_NAME,
                destination: `+91${mobileNo}`,
                userName: 'Test Customer',
                templateParams: [],
                media: {
                    url: "https://d3jt6ku4g6z5l8.cloudfront.net/IMAGE/643fe7d3e7a936073a0582e8/7fade778-83b0-4fc9-a33a-c5b5d8b0fd6d_Gautam Solar Expo Showcase 2.png",
                    filename: "sample_media"
                }
            }),
        }
    );

    const responseText = await response.text();

    console.log("HTTP status:", response.status);
    console.log("AiSensy response:", responseText);

    if (!response.ok) {
        throw new Error(`AiSensy error: ${responseText}`);
    }
};