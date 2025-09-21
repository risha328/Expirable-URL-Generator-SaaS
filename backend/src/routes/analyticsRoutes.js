import express from "express";
import authMiddleware from "../middlewares/authMiddleware.js";
import { getAnalytics } from "../controllers/analyticsController.js";

const router = express.Router();

router.get("/:linkId", authMiddleware, getAnalytics);

export default router;
