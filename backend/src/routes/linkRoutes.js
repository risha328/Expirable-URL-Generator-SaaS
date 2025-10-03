import express from "express";
import authMiddleware from "../middlewares/authMiddleware.js";
import adminMiddleware from "../middlewares/adminMiddleware.js";
import { checkBruteForce } from "../middlewares/bruteForceMiddleware.js";
import { ipRateLimit, linkAbuseDetection, updateIPAnalytics } from "../middlewares/advancedRateLimitMiddleware.js";
import { validatePassword } from "../middlewares/passwordValidationMiddleware.js";
import { createLink, getUserLinks, getDashboardStats, redirectLink, getAllLinks, deleteLink, deleteUserLink, forceExpireLink, getReportedLinks, warnUser, blockUser, getFailedAttempts, getFlaggedLinks, getIPAnalytics, unflagLink, blockIP, unblockIP } from "../controllers/linkController.js";

const router = express.Router();

router.post("/", authMiddleware, createLink);
router.get("/my", authMiddleware, getUserLinks); // Get user's links
router.get("/stats", authMiddleware, getDashboardStats); // Get dashboard statistics
router.delete("/:slug", authMiddleware, deleteUserLink); // Delete user's own link
router.post("/:slug", ipRateLimit, validatePassword, linkAbuseDetection, checkBruteForce, updateIPAnalytics, redirectLink); // POST for password case
router.get("/:slug", ipRateLimit, validatePassword, linkAbuseDetection, checkBruteForce, updateIPAnalytics, redirectLink);  // GET for normal case

// Admin routes
router.get("/admin/all", adminMiddleware, getAllLinks);
router.get("/admin/reported", adminMiddleware, getReportedLinks);
router.delete("/admin/delete/:id", adminMiddleware, deleteLink);
router.put("/admin/expire/:id", adminMiddleware, forceExpireLink);
router.post("/admin/warn/:userId", adminMiddleware, warnUser);
router.put("/admin/block/:userId", adminMiddleware, blockUser);

// Security monitoring routes
router.get("/admin/security/failed-attempts", adminMiddleware, getFailedAttempts);
router.get("/admin/security/flagged-links", adminMiddleware, getFlaggedLinks);
router.get("/admin/security/ip-analytics", adminMiddleware, getIPAnalytics);
router.put("/admin/security/unflag/:id", adminMiddleware, unflagLink);
router.put("/admin/security/block-ip/:ip", adminMiddleware, blockIP);
router.put("/admin/security/unblock-ip/:ip", adminMiddleware, unblockIP);

export default router;
