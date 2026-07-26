import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  role: { type: String, enum: ["user", "admin"], default: "user" },
  isSubscribed: { type: Boolean, default: false },
  subscriptionPlan: {
    type: String,
    enum: ["Free", "Pro", "Business", "Enterprise"],
    default: "Free",
  },
  subscriptionStatus: {
    type: String,
    enum: ["free", "active", "expired", "cancelled", "past_due"],
    default: "free",
  },
  subscriptionExpiresAt: { type: Date, default: null },
  billingCycle: {
    type: String,
    enum: ["monthly", "annual"],
    default: null,
  },
  razorpayCustomerId: { type: String, default: null },
  razorpayPaymentId: { type: String, default: null },
  razorpayOrderId: { type: String, default: null },
  razorpaySubscriptionId: { type: String, default: null },
  // GST / invoice fields (India)
  gstin: { type: String, default: null },
  businessName: { type: String, default: null },
  billingAddress: { type: String, default: null },
  phone: { type: String },
  bio: { type: String },
  dateOfBirth: { type: Date },
  address: { type: String },
  failedLoginAttempts: { type: Number, default: 0 },
  lockUntil: { type: Date, default: null },
  lockReason: { type: String, default: null },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("User", userSchema);
