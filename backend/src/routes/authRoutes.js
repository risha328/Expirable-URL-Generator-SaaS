import express from "express";
import { signup, login, validateToken } from "../controllers/authController.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.get("/validate", authMiddleware, validateToken);

export default router;
