import express from "express";
import authMiddleware from "../middlewares/authMiddleware.js";
import adminMiddleware from "../middlewares/adminMiddleware.js";
import { createLink, getUserLinks, getDashboardStats, redirectLink, getAllLinks, deleteLink, forceExpireLink, getReportedLinks, warnUser, blockUser } from "../controllers/linkController.js";

const router = express.Router();

router.post("/", authMiddleware, createLink);
router.get("/my", authMiddleware, getUserLinks); // Get user's links
router.get("/stats", authMiddleware, getDashboardStats); // Get dashboard statistics
router.post("/:slug", redirectLink); // POST for password case
router.get("/:slug", redirectLink);  // GET for normal case

// Admin routes
router.get("/admin/all", adminMiddleware, getAllLinks);
router.get("/admin/reported", adminMiddleware, getReportedLinks);
router.delete("/admin/delete/:id", adminMiddleware, deleteLink);
router.put("/admin/expire/:id", adminMiddleware, forceExpireLink);
router.post("/admin/warn/:userId", adminMiddleware, warnUser);
router.put("/admin/block/:userId", adminMiddleware, blockUser);

export default router;
