import FailedAttempt from "../models/FailedAttempt.js";
import Link from "../models/Link.js";

// Configuration - these should be moved to environment variables
const MAX_FAILED_ATTEMPTS = process.env.MAX_FAILED_ATTEMPTS || 5;
const LOCKOUT_DURATION_MINUTES = process.env.LOCKOUT_DURATION_MINUTES || 15;
const TRACKING_WINDOW_MINUTES = process.env.TRACKING_WINDOW_MINUTES || 60;

export const checkBruteForce = async (req, res, next) => {
  try {
    const { slug } = req.params;
    const ip = req.ip;
    const userAgent = req.headers['user-agent'];

    // Find the link
    const link = await Link.findOne({ slug });
    if (!link) {
      return res.status(404).json({ message: "Link not found" });
    }

    // Check if link is locked
    if (link.lockedUntil && new Date() < link.lockedUntil) {
      const remainingTime = Math.ceil((link.lockedUntil - new Date()) / 1000 / 60);
      return res.status(429).json({
        message: `Link temporarily locked due to too many failed attempts. Try again in ${remainingTime} minutes.`,
        lockedUntil: link.lockedUntil,
        lockReason: link.lockReason
      });
    }

    // Check if link is flagged for abuse
    if (link.flaggedForAbuse) {
      return res.status(403).json({
        message: "Link has been flagged for suspicious activity",
        flaggedReason: link.flaggedReason,
        flaggedAt: link.flaggedAt
      });
    }

    // Check recent failed attempts from this IP
    const windowStart = new Date(Date.now() - TRACKING_WINDOW_MINUTES * 60 * 1000);
    const recentFailedAttempts = await FailedAttempt.countDocuments({
      linkId: link._id,
      ip: ip,
      timestamp: { $gte: windowStart }
    });

    if (recentFailedAttempts >= MAX_FAILED_ATTEMPTS) {
      // Lock the link temporarily
      const lockUntil = new Date(Date.now() + LOCKOUT_DURATION_MINUTES * 60 * 1000);
      await Link.findByIdAndUpdate(link._id, {
        lockedUntil: lockUntil,
        lockReason: `Too many failed attempts from IP ${ip}`,
        lastFailedAttempt: new Date()
      });

      // Log the lockout
      await FailedAttempt.create({
        linkId: link._id,
        ip: ip,
        userAgent: userAgent,
        reason: "rate_limited",
        timestamp: new Date()
      });

      return res.status(429).json({
        message: `Too many failed attempts. Link locked for ${LOCKOUT_DURATION_MINUTES} minutes.`,
        lockedUntil: lockUntil
      });
    }

    // Store IP info for potential abuse tracking
    req.linkId = link._id;
    req.clientIP = ip;
    req.clientUserAgent = userAgent;

    next();
  } catch (error) {
    console.error('Brute force middleware error:', error);
    res.status(500).json({ message: "Security check failed" });
  }
};

export const logFailedAttempt = async (linkId, ip, userAgent, reason = "wrong_password") => {
  try {
    await FailedAttempt.create({
      linkId,
      ip,
      userAgent,
      reason,
      timestamp: new Date()
    });

    // Update link's failed attempt count
    await Link.findByIdAndUpdate(linkId, {
      $inc: { failedAttempts: 1 },
      lastFailedAttempt: new Date()
    });
  } catch (error) {
    console.error('Error logging failed attempt:', error);
  }
};

export const resetFailedAttempts = async (linkId) => {
  try {
    await Link.findByIdAndUpdate(linkId, {
      failedAttempts: 0,
      lastFailedAttempt: null,
      lockedUntil: null,
      lockReason: null
    });
  } catch (error) {
    console.error('Error resetting failed attempts:', error);
  }
};
