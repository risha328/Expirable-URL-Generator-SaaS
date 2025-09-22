import express from "express";
import authMiddleware from "../middlewares/authMiddleware.js";
import { createLink, getUserLinks, getDashboardStats, redirectLink } from "../controllers/linkController.js";

const router = express.Router();

router.post("/", authMiddleware, createLink);
router.get("/my", authMiddleware, getUserLinks); // Get user's links
router.get("/stats", authMiddleware, getDashboardStats); // Get dashboard statistics
router.post("/:slug", redirectLink); // POST for password case
router.get("/:slug", redirectLink);  // GET for normal case

export default router;
