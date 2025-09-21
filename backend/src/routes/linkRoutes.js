import express from "express";
import authMiddleware from "../middlewares/authMiddleware.js";
import { createLink, redirectLink } from "../controllers/linkController.js";

const router = express.Router();

router.post("/", authMiddleware, createLink);
router.post("/:slug", redirectLink); // POST for password case
router.get("/:slug", redirectLink);  // GET for normal case

export default router;
