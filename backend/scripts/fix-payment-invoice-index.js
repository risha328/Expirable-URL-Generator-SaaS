/**
 * One-time fix: unique invoiceNumber_1 was indexing null and blocking new payments.
 * Run: node scripts/fix-payment-invoice-index.js
 */
import "dotenv/config";
import mongoose from "mongoose";

await mongoose.connect(process.env.MONGO_URI);
const col = mongoose.connection.db.collection("payments");

try {
  await col.dropIndex("invoiceNumber_1");
  console.log("Dropped old invoiceNumber_1");
} catch (e) {
  console.log("dropIndex:", e.message);
}

const unset = await col.updateMany(
  { invoiceNumber: null },
  { $unset: { invoiceNumber: "" } }
);
console.log("Cleared null invoiceNumber on", unset.modifiedCount, "docs");

await col.createIndex(
  { invoiceNumber: 1 },
  {
    unique: true,
    name: "invoiceNumber_1",
    partialFilterExpression: { invoiceNumber: { $type: "string" } },
  }
);
console.log("Created partial unique invoiceNumber_1");

await mongoose.disconnect();
