import express from "express";
import { signup, login, adminSignup, adminLogin, validateToken, getAllUsers, updateSubscription, getProfile, updateProfile } from "../controllers/authController.js";
import authMiddleware from "../middlewares/authMiddleware.js";
import adminMiddleware from "../middlewares/adminMiddleware.js";

const router = express.Router();

router.post("/signup", signup); // Public route for user signup
router.post("/login", login); // Public route for user login
router.post("/admin/signup", adminSignup); // Public route for admin signup (requires admin code)
router.post("/admin/login", adminLogin); // Public route for admin login
router.get("/validate", authMiddleware, validateToken); // Protected route for token validation
router.get("/profile", authMiddleware, getProfile); // Protected route for getting user profile
router.put("/profile", authMiddleware, updateProfile); // Protected route for updating user profile
router.put("/subscription", authMiddleware, updateSubscription); // Protected route for updating subscription
router.get("/admin/users", adminMiddleware, getAllUsers); // Admin-only route to get all users

export default router;
