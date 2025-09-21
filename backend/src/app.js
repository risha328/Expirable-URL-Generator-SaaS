import express from "express";
import dotenv from "dotenv";
import helmet from "helmet";
import cors from "cors";
import rateLimit from "express-rate-limit";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";

dotenv.config();
connectDB();

const app = express();

// Middleware
app.use(express.json());
app.use(helmet());
app.use(cors());
app.use(rateLimit({ windowMs: 1 * 60 * 1000, max: 100 }));

// Routes
app.get("/", (req, res) => {
  res.send("Expirable URL API Running 🚀");
});

app.use("/auth", authRoutes);
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
