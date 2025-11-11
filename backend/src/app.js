import express from "express";
import dotenv from "dotenv";
import helmet from "helmet";
import cors from "cors";
import rateLimit from "express-rate-limit";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import linkRoutes from "./routes/linkRoutes.js";
import analyticsRoutes from "./routes/analyticsRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import chatbotRoutes from "./routes/chatbotRoutes.js";

dotenv.config();
connectDB();

const app = express();

// Middleware
app.use(helmet());
app.use(cors(
  { origin: ["http://localhost:5173", "https://expireo.vercel.app"] }
));
// app.use(rateLimit({ windowMs: 1 * 60 * 1000, max: 100 })); // Disabled for development

// Use express.json() for all requests
app.use(express.json());

// Routes
app.get("/", (req, res) => {
  res.send("Expirable URL API Running 🚀");
});

app.use("/auth", authRoutes);
app.use("/url", linkRoutes);
app.use("/analytics", analyticsRoutes);
app.use("/admin", adminRoutes);
app.use("/chat", chatbotRoutes);

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));



