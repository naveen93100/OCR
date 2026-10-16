import 'dotenv/config'
export const sendVerificationWhatsApp = async () => {
  console.log(process.env.AISENSY_API_KEY)
  console.log(process.env.AISENSY_CAMPAIGN_NAME)
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
        // destination: card.mobileNo,
        destination: 9310097505,
        userName: 'naveen',
        templateParams: [''],
      }),
    }
  );

  const responseText = await response.text();

  if (!response.ok) {
    throw new Error(`AiSensy error: ${responseText}`);
  }

  return responseText;
};

sendVerificationWhatsApp()