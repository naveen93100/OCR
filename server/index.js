import 'dotenv/config'
import express from 'express';
import mainRouter from './routes/mainRouter.js'
import connectDB from './config/db.js';
import dns from 'dns';
import cookieParser from 'cookie-parser';
dns.setServers(["8.8.8.8", "8.8.4.4"]);


const app = express();

app.use(express.json());
app.use(cookieParser());



app.get("/health",(req,res)=>{
     res.send("health good..");
})

app.use('/api/v1', mainRouter)


app.get('/', (req, res) => {
    res.send("hello from server..");
})

app.listen(3001, async () => {
    await connectDB()
    console.log('Server is running on 3001...');
})