import mongoose from "mongoose";

const linkSchema = new mongoose.Schema({
  slug: { type: String, required: true, unique: true },
  targetUrl: { type: String, required: true },
  ownerId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  passwordHash: { type: String, default: null },
  expiry: { type: Date, default: null },
  clicks: { type: Number, default: 0 },
  status: { type: String, enum: ["active", "expired", "reported", "locked", "flagged"], default: "active" },
  reportedReason: { type: String, default: null },
  // Security fields
  failedAttempts: { type: Number, default: 0 },
  lastFailedAttempt: { type: Date },
  lockedUntil: { type: Date }, // For temporary lockouts
  lockReason: String,
  flaggedForAbuse: { type: Boolean, default: false },
  flaggedReason: String,
  flaggedAt: Date,
  // Request tracking for abuse detection
  recentRequests: [{
    ip: String,
    timestamp: { type: Date, default: Date.now },
    userAgent: String
  }],
  analytics: [{
    timestamp: { type: Date, default: Date.now },
    ip: String,
    userAgent: String
  }],
  createdAt: { type: Date, default: Date.now }
});

// Indexes for security queries
linkSchema.index({ lockedUntil: 1 }, { expireAfterSeconds: 0 });
linkSchema.index({ status: 1, flaggedForAbuse: 1 });
linkSchema.index({ "recentRequests.timestamp": -1 });

export default mongoose.model("Link", linkSchema);
