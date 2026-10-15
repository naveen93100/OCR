import { Queue } from "bullmq"

import { redisConnection } from "../config/redisConfig.js"

//  basic bullmq setup
export const cardQueue = new Queue('extract', {
    connection: redisConnection,
    defaultJobOptions: {
        attempts: 3,
        backoff: { type: "exponential", delay: 3000 },
        removeOnComplete: { count: 500 },
        removeOnFail: { count: 1000 }
    }
})