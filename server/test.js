import "dotenv/config";
import { cardQueue } from "./queue/cardQueue.js";


await cardQueue.add("extract-card", { cardId: "test123" }, { jobId: "test123" });
console.log("Test job added");
process.exit(0);