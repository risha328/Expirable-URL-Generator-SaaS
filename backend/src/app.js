import express from "express";
import dotenv from "dotenv";
import helmet from "helmet";
import cors from "cors";
import rateLimit from "express-rate-limit";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import linkRoutes from "./routes/linkRoutes.js";
import analyticsRoutes from "./routes/analyticsRoutes.js";

dotenv.config();
connectDB();

const app = express();

// Removed duplicate imports and declarations

// import express from "express";
// import dotenv from "dotenv";
// import helmet from "helmet";
// import cors from "cors";
// import rateLimit from "express-rate-limit";
// import connectDB from "./config/db.js";
// import authRoutes from "./routes/authRoutes.js";
// import linkRoutes from "./routes/linkRoutes.js";

// dotenv.config();
// connectDB();

// const app = express();

// Middleware
app.use(helmet());
app.use(cors());
app.use(rateLimit({ windowMs: 1 * 60 * 1000, max: 100 }));

// Use express.json() for all requests to /url and /auth routes
app.use("/url", express.json());
app.use("/auth", express.json());

app.use("/analytics", analyticsRoutes);// For analytics route if needed

// Routes
app.get("/", (req, res) => {
  res.send("Expirable URL API Running 🚀");
});

app.use("/auth", authRoutes);
app.use("/url", linkRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

// // Routes
// app.get("/", (req, res) => {
//   res.send("Expirable URL API Running 🚀");
// });

// app.use("/auth", authRoutes);
// app.use("/url", linkRoutes);

// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
