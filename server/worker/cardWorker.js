import "dotenv/config";
import { UnrecoverableError, Worker } from "bullmq";
import { redisConnection } from "../config/redisConfig.js";
import CardLead from "../models/cardLeadModel.js";
import path from 'path';
import { readFile } from "fs/promises";
import { extractImageDetails } from "../utils/extractImageDetails.js";

function cleanMobileNumber(number) {
  if (!number || typeof number !== "string") {
    return "";
  }

  return number
    .replace(/^\+91\s*/, "")
    .replace(/[\s()-]/g, "")
    .trim();
}

export const worker = new Worker('extract', async (job) => {
  console.log("Processing job:", job.id, job.data);
  if (job.name === 'extract-single-card' || job.name === 'extract-bulk-card') {

    let cardId = job.data.cardId;
    let doc = await CardLead.findOne({ _id: job.data.cardId });

    if (!doc) return { ok: false, message: "Card lead not found.." };

    const absolutePath = path.resolve("uploads/cards", doc.imagePath);

    let buff = await readFile(absolutePath);


    let extractImg = await extractImageDetails(buff);
    const stringExtract = JSON.parse(extractImg)
    const isNotReadableImage = Object.values(stringExtract).every((v) => String(v) === "");


    if (isNotReadableImage) throw new UnrecoverableError("No readable card details found in the image.");

    const update = {
      customerName: stringExtract.customerName,
      companyName: stringExtract.companyName,
      city: stringExtract.city,
      requirement: stringExtract.requirement,
      email: stringExtract?.email?.trim()?.toLowerCase() || "",
      mobileNo: cleanMobileNumber(stringExtract.mobileno),
      alternateMobileNo: cleanMobileNumber(stringExtract.alternateMobileNo),
      status: 'un-verified',
    };

    let duplicate = [];

    if (update.email) {
      duplicate.push({ email: update.email })
    }

    if (update.mobileNo) {
      duplicate.push(
        { mobileNo: update.mobileNo },
        { alternateMobileNo: update.mobileNo }
      );
    }
    if (update.alternateMobileNo) {
      duplicate.push(
        { mobileNo: update.alternateMobileNo },
        { alternateMobileNo: update.alternateMobileNo }
      );

    }

    if (duplicate.length > 0) {

      let isExist = await CardLead.findOne({
        _id: { $ne: cardId }, $or: duplicate
      });

      if (isExist) {
        await CardLead.findOneAndUpdate(
          { _id: cardId, status: 'pending' },
          { $set: { ...update, status: 'rejected', rejectionReason: 'Duplicate Card Details found...' } },
          { runValidators: true }
        );

        return {
          cardId: job.data.cardId,
          extractedData: stringExtract
        }
      }
    }

    await CardLead.findOneAndUpdate(
      { _id: cardId, status: 'pending' },
      { $set: update },
      { runValidators: true }
    );

    return {
      cardId: job.data.cardId,
      extractedData: stringExtract
    }
  }
  return { ok: true };
},
  {
    connection: redisConnection,
    concurrency: 3,
  }
);



worker.on("completed", async (job) => {
  console.log("Job completed:", job.id);
});

worker.on("failed", async (job, err) => {
  console.error("Job failed:", job?.id, err.message);
  if (!job) return;
  const isUnrecoverable = err.name === "UnrecoverableError";

  const noRetriesLeft =
    job.attemptsMade >= (job.opts.attempts || 1);

  if (isUnrecoverable || noRetriesLeft) {
    try {
      await CardLead.findOneAndUpdate(
        { _id: job.data.cardId, status: 'pending' },
        { $set: { status: 'rejected', rejectionReason: err?.message } }
      );
    } catch (e) {
      console.error("Could not mark card as failed:", e.message);
    }
  }
  return;

});

worker.on("error", (err) => {
  console.error("Worker error:", err.message);
});

const shutdown = async () => {
  console.log("Shutting down worker...");
  await worker.close();
  process.exit(0);
};

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);

console.log("Card worker started");