import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  firstName: { type: String, required: true },   // new
  lastName: { type: String, required: true },    // new
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  role: { type: String, enum: ["user", "admin"], default: "user" },
  isSubscribed: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("User", userSchema);
