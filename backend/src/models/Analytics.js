import mongoose from "mongoose";

const analyticsSchema = new mongoose.Schema({
  linkId: { type: mongoose.Schema.Types.ObjectId, ref: "Link" },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  timestamp: { type: Date, default: Date.now },
  ip: String,
  referrer: String,
  userAgent: String,
  country: String,
  city: String,
  region: String,
  deviceType: { type: String, enum: ["desktop", "mobile", "tablet"] },
  browser: String,
  browserVersion: String,
  os: String,
  osVersion: String,
  screenResolution: String,
  timezone: String,
  language: String
});

export default mongoose.model("Analytics", analyticsSchema);
