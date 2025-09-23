import express from "express";
import { getDashboardStats, getChartData } from "../controllers/adminController.js";
import adminMiddleware from "../middlewares/adminMiddleware.js";

const router = express.Router();

// Admin-only route to get dashboard statistics
router.get("/dashboard/stats", adminMiddleware, getDashboardStats);

// Admin-only route to get chart data
router.get("/dashboard/chart-data", adminMiddleware, getChartData);

export default router;
