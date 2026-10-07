import 'dotenv/config'
import OpenAi from 'openai'


export const openAi=new OpenAi({
     apikey:process.env.OPENAI_API_KEY
})

