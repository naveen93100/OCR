import Redis from "ioredis";

export const redisConnection = new Redis({
    host: process.env.REDIS_HOST || "127.0.0.1",
    port: process.env.REDIS_PORT || 6379,
    password: process.env.REDIS_PASSWORD || "",
    maxRetriesPerRequest: null,
    enableReadyCheck: false,
});

redisConnection.on("ready", () => {
    console.log("🚀 Redis ready to use");
});

redisConnection.on("connect", () => {
    console.log("✅ Redis connected");
});

redisConnection.on("error", (err) => {
    console.error("❌ Redis error:", err);
});
