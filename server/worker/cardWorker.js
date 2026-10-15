import "dotenv/config";
import { Worker } from "bullmq";
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
    const isReadableImage = Object.values(stringExtract).every((v) => String(v) === "");


    if (isReadableImage) throw new UnrecoverableError("No readable card details found in the image.");

    const update = {
      customerName: stringExtract.customerName,
      companyName: stringExtract.companyName,
      city: stringExtract.city,
      requirement: stringExtract.requirement,
      email: stringExtract.email,
      mobileNo: cleanMobileNumber(stringExtract.mobileno),
      alternateMobileNo: cleanMobileNumber(stringExtract.alternateMobileNo),
      status: 'un-verified',
    };

    let isExist = await CardLead.findOne({
      _id: { $ne: cardId }, $or: [
        ...(update.email ? [{ email: update.email }] : []),
        ...(update.mobileNo ? [{ mobileNo: update.mobileNo }] : [])]
    })

    if (isExist) {
      await CardLead.findOneAndUpdate(
        { _id: cardId, status: 'pending' },
        { $set: { ...update, status: 'rejected', rejectionReason: 'Duplicate Card Details found...' } },
        { runValidators: true }
      );
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
  const noRetriesLeft = job && job.attemptsMade >= (job.opts.attempts || 1);
  if (!noRetriesLeft) return;

  const isFinal =
    err.name === "UnrecoverableError" ||
    job.attemptsMade >= (job.opts.attempts || 1);
  if (!isFinal) return;

  try {
    await CardLead.findOneAndUpdate(
      { _id: job.data.cardId, status: 'pending' },
      { $set: { status: 'failed', rejectionReason: 'No readable card details found in the image.' } }
    );
  } catch (e) {
    console.error("Could not mark card as failed:", e.message);
  }
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