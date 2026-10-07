import "dotenv/config";
import express from "express";
import mainRouter from "./routes/mainRouter.js";
import cors from "cors";
import connectDB from "./config/db.js";
import dns from "dns";
import cookieParser from "cookie-parser";
dns.setServers(["8.8.8.8", "8.8.4.4"]);

const app = express();

app.use(
    cors({
        origin: "http://localhost:5173",
        credentials: true,
    }),
);

app.use((req, res, next) => {
    console.log(`${req.method} ${req.originalUrl}`);
    next();
});

app.use(express.json());
app.use(cookieParser());

app.get("/health", (req, res) => {
    res.send("health good..");
});

app.use("/api/v1", mainRouter);

app.get("/", (req, res) => {
    res.send("hello from server..");
});

app.listen(3001, async () => {
    await connectDB();
    console.log("Server is running on 3001...");
});
