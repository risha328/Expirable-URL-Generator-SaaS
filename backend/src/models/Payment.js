import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  plan: {
    type: String,
    enum: ["Pro", "Business"],
    required: true,
  },
  billingCycle: {
    type: String,
    enum: ["monthly", "annual"],
    required: true,
  },
  amount: { type: Number, required: true },
  currency: { type: String, default: "INR" },
  mode: {
    type: String,
    enum: ["order", "subscription"],
    default: "order",
  },
  razorpayOrderId: { type: String, default: null },
  razorpaySubscriptionId: { type: String, default: null, index: true },
  razorpayPlanId: { type: String, default: null },
  razorpayPaymentId: { type: String, default: null },
  razorpaySignature: { type: String, default: null },
  promoCode: { type: String, default: null },
  discountPaise: { type: Number, default: 0 },
  gstin: { type: String, default: null },
  businessName: { type: String, default: null },
  // Omit until paid — unique index must not index null (see partialFilterExpression below)
  invoiceNumber: { type: String },
  receiptSentAt: { type: Date, default: null },
  failureReason: { type: String, default: null },
  status: {
    type: String,
    enum: ["created", "authenticated", "active", "paid", "failed", "cancelled"],
    default: "created",
  },
  createdAt: { type: Date, default: Date.now },
  paidAt: { type: Date, default: null },
});

paymentSchema.index({ userId: 1, createdAt: -1 });
paymentSchema.index({ razorpayOrderId: 1 }, { unique: true, sparse: true });
paymentSchema.index({ razorpayPaymentId: 1 }, { sparse: true });
// Only enforce uniqueness when a real invoice number exists (not missing/null)
paymentSchema.index(
  { invoiceNumber: 1 },
  {
    unique: true,
    partialFilterExpression: { invoiceNumber: { $type: "string" } },
  }
);

export default mongoose.model("Payment", paymentSchema);
