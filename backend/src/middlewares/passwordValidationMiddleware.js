import bcrypt from "bcryptjs";
import Link from "../models/Link.js";
import FailedAttempt from "../models/FailedAttempt.js";
import { logFailedAttempt } from "./bruteForceMiddleware.js";

// Configuration - should match bruteForceMiddleware
const TRACKING_WINDOW_MINUTES = process.env.TRACKING_WINDOW_MINUTES || 60;

export const validatePassword = async (req, res, next) => {
  try {
    const { slug } = req.params;
    const password = req.method === "POST" ? req.body.password : req.query.password;

    const link = await Link.findOne({ slug });
    if (!link) {
      return res.status(404).json({ message: "Link not found" });
    }

    // Check if link is expired
    if (link.expiry && new Date() > link.expiry) {
      return res.status(410).json({ message: "Link expired" });
    }

    if (link.passwordHash) {
      if (!password) {
        return res.status(401).json({ message: "Password required" });
      }

      const valid = await bcrypt.compare(password, link.passwordHash);
      if (!valid) {
        // Count recent failed attempts from this IP for this link
        const windowStart = new Date(Date.now() - TRACKING_WINDOW_MINUTES * 60 * 1000);
        const recentFailedAttempts = await FailedAttempt.countDocuments({
          linkId: link._id,
          ip: req.ip,
          timestamp: { $gte: windowStart }
        });

        // Log failed attempt for wrong password
        await logFailedAttempt(link._id, req.ip, req.headers['user-agent'], "wrong_password");

        return res.status(403).json({
          message: "Wrong password",
          failedAttempts: recentFailedAttempts + 1
        });
      }
    }

    // Store link in request for later use
    req.link = link;
    next();
  } catch (error) {
    console.error('Password validation middleware error:', error);
    res.status(500).json({ message: "Password validation failed" });
  }
};
