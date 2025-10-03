import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  firstName: { type: String, required: true },   // new
  lastName: { type: String, required: true },    // new
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  role: { type: String, enum: ["user", "admin"], default: "user" },
  isSubscribed: { type: Boolean, default: false },
  subscriptionPlan: { type: String, enum: ["Free", "Pro", "Business", "Enterprise"], default: "Free" },
  phone: { type: String },
  bio: { type: String },
  dateOfBirth: { type: Date },
  address: { type: String },
  failedLoginAttempts: { type: Number, default: 0 },
  lockUntil: { type: Date, default: null },
  lockReason: { type: String, default: null },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("User", userSchema);
