import express from "express";
import { getDashboardStats } from "../controllers/adminController.js";
import adminMiddleware from "../middlewares/adminMiddleware.js";

const router = express.Router();

// Admin-only route to get dashboard statistics
router.get("/dashboard/stats", adminMiddleware, getDashboardStats);

export default router;
