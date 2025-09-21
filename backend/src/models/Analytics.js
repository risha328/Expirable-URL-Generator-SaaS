import mongoose from "mongoose";

const analyticsSchema = new mongoose.Schema({
  linkId: { type: mongoose.Schema.Types.ObjectId, ref: "Link" },
  timestamp: { type: Date, default: Date.now },
  ip: String,
  referrer: String,
  userAgent: String
});

export default mongoose.model("Analytics", analyticsSchema);
