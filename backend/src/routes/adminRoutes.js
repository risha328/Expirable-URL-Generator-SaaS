import express from "express";
import { getDashboardStats, getChartData } from "../controllers/adminController.js";
import {
  getDailyClicksGraph,
  getMostClickedLinks,
  getTopActiveUsers,
  getCountryBasedClicks,
  getReferrerData,
  getDeviceBrowserStats,
  getAnalyticsSummary
} from "../controllers/adminAnalyticsController.js";
import {
  getFailedAttempts,
  getFlaggedLinks,
  getIPAnalytics,
  unflagLink,
  blockIP,
  unblockIP
} from "../controllers/adminSecurityController.js";
import adminMiddleware from "../middlewares/adminMiddleware.js";

const router = express.Router();

// Admin-only route to get dashboard statistics
router.get("/dashboard/stats", adminMiddleware, getDashboardStats);

// Admin-only route to get chart data
router.get("/dashboard/chart-data", adminMiddleware, getChartData);

// System Analytics Routes
router.get("/analytics/daily-clicks", adminMiddleware, getDailyClicksGraph);
router.get("/analytics/most-clicked-links", adminMiddleware, getMostClickedLinks);
router.get("/analytics/top-active-users", adminMiddleware, getTopActiveUsers);

// Traffic Insights Routes
router.get("/analytics/country-clicks", adminMiddleware, getCountryBasedClicks);
router.get("/analytics/referrer-data", adminMiddleware, getReferrerData);
router.get("/analytics/device-browser-stats", adminMiddleware, getDeviceBrowserStats);

// Analytics Summary
router.get("/analytics/summary", adminMiddleware, getAnalyticsSummary);

// Security Routes
router.get("/security/failed-attempts", adminMiddleware, getFailedAttempts);
router.get("/security/flagged-links", adminMiddleware, getFlaggedLinks);
router.get("/security/ip-analytics", adminMiddleware, getIPAnalytics);
router.post("/security/unflag-link/:linkId", adminMiddleware, unflagLink);
router.post("/security/block-ip", adminMiddleware, blockIP);
router.post("/security/unblock-ip", adminMiddleware, unblockIP);

export default router;
