import mongoose from "mongoose";

const razorpayPlanCacheSchema = new mongoose.Schema({
  key: { type: String, required: true, unique: true },
  razorpayPlanId: { type: String, required: true },
  plan: String,
  billingCycle: String,
  amount: Number,
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("RazorpayPlanCache", razorpayPlanCacheSchema);
