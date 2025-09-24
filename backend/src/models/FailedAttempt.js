import mongoose from "mongoose";

const failedAttemptSchema = new mongoose.Schema({
  linkId: { type: mongoose.Schema.Types.ObjectId, ref: "Link", required: true },
  ip: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
  userAgent: String,
  reason: { type: String, enum: ["wrong_password", "rate_limited", "suspicious_activity"], required: true }
});

// Index for efficient querying
failedAttemptSchema.index({ linkId: 1, ip: 1, timestamp: -1 });
failedAttemptSchema.index({ timestamp: 1 }, { expireAfterSeconds: 86400 }); // Auto-delete after 24 hours

export default mongoose.model("FailedAttempt", failedAttemptSchema);
