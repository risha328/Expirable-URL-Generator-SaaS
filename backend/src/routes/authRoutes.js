import express from "express";
import { signup, login, adminSignup, adminLogin, validateToken } from "../controllers/authController.js";
import authMiddleware from "../middlewares/authMiddleware.js";
import adminMiddleware from "../middlewares/adminMiddleware.js";

const router = express.Router();

router.post("/signup", signup); // Public route for user signup
router.post("/login", login); // Public route for user login
router.post("/admin/signup", adminSignup); // Public route for admin signup (requires admin code)
router.post("/admin/login", adminLogin); // Public route for admin login
router.get("/validate", authMiddleware, validateToken); // Protected route for token validation

export default router;
