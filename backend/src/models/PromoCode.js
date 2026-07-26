import mongoose from "mongoose";

const promoCodeSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true, uppercase: true, trim: true },
  description: { type: String, default: "" },
  discountPercent: { type: Number, default: 0, min: 0, max: 100 },
  discountAmount: { type: Number, default: 0 }, // paise flat off
  applicablePlans: {
    type: [String],
    default: ["Pro", "Business"],
  },
  maxUses: { type: Number, default: null }, // null = unlimited
  usedCount: { type: Number, default: 0 },
  validUntil: { type: Date, default: null },
  active: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
});

promoCodeSchema.methods.isValidFor = function (plan) {
  if (!this.active) return false;
  if (this.validUntil && new Date(this.validUntil) < new Date()) return false;
  if (this.maxUses != null && this.usedCount >= this.maxUses) return false;
  if (this.applicablePlans?.length && !this.applicablePlans.includes(plan)) return false;
  return true;
};

promoCodeSchema.methods.applyToAmount = function (amountPaise) {
  let discounted = amountPaise;
  if (this.discountPercent > 0) {
    discounted = Math.round(amountPaise * (1 - this.discountPercent / 100));
  }
  if (this.discountAmount > 0) {
    discounted = Math.max(100, discounted - this.discountAmount); // min ₹1
  }
  return Math.max(100, discounted);
};

export default mongoose.model("PromoCode", promoCodeSchema);
