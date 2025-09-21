import mongoose from "mongoose";

const linkSchema = new mongoose.Schema({
  slug: { type: String, required: true, unique: true },
  targetUrl: { type: String, required: true },
  ownerId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  passwordHash: { type: String, default: null },
  expiry: { type: Date, default: null },
  clicks: { type: Number, default: 0 },
  analytics: [{
    timestamp: { type: Date, default: Date.now },
    ip: String,
    userAgent: String
  }],
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("Link", linkSchema);
