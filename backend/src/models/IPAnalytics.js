import mongoose from "mongoose";

const ipAnalyticsSchema = new mongoose.Schema({
  ip: { type: String, required: true, unique: true },
  requestCount: { type: Number, default: 0 }, // Keep for backward compatibility, but will deprecate
  lastRequest: { type: Date, default: Date.now },
  linksAccessed: [{ type: mongoose.Schema.Types.ObjectId, ref: "Link" }],
  flagged: { type: Boolean, default: false },
  flaggedReason: String,
  flaggedAt: Date,
  blocked: { type: Boolean, default: false },
  blockedAt: Date,
  blockReason: String,
  resetTime: Date, // For temporary blocks
  // Location data
  country: { type: String, default: 'Unknown' },
  city: { type: String, default: 'Unknown' },
  region: { type: String, default: 'Unknown' },
  // Request tracking for rate limiting
  requestTimestamps: [{
    timestamp: { type: Date, default: Date.now }
  }],
  createdAt: { type: Date, default: Date.now }
});

// Index for efficient querying
ipAnalyticsSchema.index({ ip: 1 });
ipAnalyticsSchema.index({ flagged: 1, blocked: 1 });
ipAnalyticsSchema.index({ resetTime: 1 }, { expireAfterSeconds: 0 }); // TTL index for temporary blocks

export default mongoose.model("IPAnalytics", ipAnalyticsSchema);
