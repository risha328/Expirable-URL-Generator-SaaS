import "dotenv/config";
import express from "express";
import helmet from "helmet";
import cors from "cors";
import { globalLimiter, authLimiter, chatbotLimiter } from "./middlewares/rateLimiter.js";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import linkRoutes from "./routes/linkRoutes.js";
import analyticsRoutes from "./routes/analyticsRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import chatbotRoutes from "./routes/chatbotRoutes.js";
import paymentRoutes from "./modules/payments/payment.routes.js";
import { startSubscriptionExpiryJob } from "./modules/payments/expiry.job.js";
import { seedDefaultPromos } from "./modules/payments/payment.controller.js";

connectDB().then(async () => {
  try {
    await seedDefaultPromos();
  } catch (e) {
    console.warn("Promo seed skipped:", e.message);
  }
});
startSubscriptionExpiryJob();

const app = express();

// Trust reverse proxies (such as Cloudflare, Nginx, Vercel)
app.set("trust proxy", 1);

// Middleware
app.use(helmet({
  contentSecurityPolicy: false,
}));
app.use(cors(
  {
    origin: [
      "http://localhost:5173",
      "https://expireo.vercel.app",
      "https://expireo.site",
      "https://www.expireo.site",
    ],
  }
));
app.use(globalLimiter);

// Capture raw body for Razorpay webhook signature verification
app.use(
  express.json({
    verify: (req, res, buf) => {
      if (req.originalUrl?.startsWith("/payments/webhook")) {
        req.rawBody = buf.toString("utf8");
      }
    },
  })
);

// Routes
app.get("/", (req, res) => {
  res.send("Expirable URL API Running");
});

// Selective rate limiting for sensitive/resource-intensive endpoints
app.use("/auth/login", authLimiter);
app.use("/auth/signup", authLimiter);
app.use("/auth/admin/login", authLimiter);
app.use("/auth/admin/signup", authLimiter);
app.use("/chat/message", chatbotLimiter);

app.use("/auth", authRoutes);
app.use("/url", linkRoutes);
app.use("/analytics", analyticsRoutes);
app.use("/admin", adminRoutes);
app.use("/chat", chatbotRoutes);
app.use("/payments", paymentRoutes);

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
