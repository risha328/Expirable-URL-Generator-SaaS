import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { nanoid } from "nanoid";
import Link from "../models/Link.js";
import Analytics from "../models/Analytics.js";
import User from "../models/User.js";
import FailedAttempt from "../models/FailedAttempt.js";
import IPAnalytics from "../models/IPAnalytics.js";
import { logFailedAttempt, resetFailedAttempts } from "../middlewares/bruteForceMiddleware.js";
import {
  parseUserAgent,
  extractScreenResolution,
  extractLanguage,
  extractTimezone,
  getLocationFromIP
} from "../utils/analyticsUtils.js";
import { syncSubscriptionExpiry } from "../modules/payments/payment.controller.js";

// Simple URL safety check
const isSafeUrl = (url) => {
  try {
    const parsedUrl = new URL(url);

    // Must be http or https
    if (!['http:', 'https:'].includes(parsedUrl.protocol)) {
      return false;
    }

    // Check for suspicious keywords in the URL string
    const suspiciousKeywords = ['phishing', 'malware', 'virus', 'hack', 'exploit', 'scam', 'fake'];
    const urlString = url.toLowerCase();
    if (suspiciousKeywords.some(keyword => urlString.includes(keyword))) {
      return false;
    }

    // Blacklist of known bad domains (simple example)
    const blacklistedDomains = ['example-bad.com', 'malicious-site.net'];
    if (blacklistedDomains.includes(parsedUrl.hostname)) {
      return false;
    }

    return true;
  } catch (error) {
    // Invalid URL
    return false;
  }
};

const RESERVED_ALIASES = new Set([
  "login",
  "signup",
  "pricing",
  "features",
  "contact",
  "admin",
  "dashboard",
  "my-links",
  "create",
  "analytics",
  "secret-links",
  "api-keys",
  "billing",
  "profile",
  "auth",
  "url",
  "payments",
  "chat",
  "api",
  "assets",
  "static",
  "favicon",
  "robots",
  "sitemap",
]);

const ALIAS_PATTERN = /^[a-z0-9](?:[a-z0-9_-]{0,48}[a-z0-9])?$/;

const normalizeCustomAlias = (value) => {
  if (value == null || value === "") return null;
  return String(value).trim().toLowerCase();
};

const validateCustomAlias = (alias) => {
  if (!alias) return null;
  if (alias.length < 3 || alias.length > 50) {
    return "Custom alias must be between 3 and 50 characters";
  }
  if (!ALIAS_PATTERN.test(alias)) {
    return "Custom alias can only contain letters, numbers, hyphens, and underscores";
  }
  if (RESERVED_ALIASES.has(alias)) {
    return "This alias is reserved. Please choose another one.";
  }
  return null;
};

export const createLink = async (req, res) => {
  try {
    const { targetUrl, password, expiry, customAlias } = req.body;
    const ownerId = req.user.id;
    const alias = normalizeCustomAlias(customAlias);

    // Check if the URL is safe
    if (!isSafeUrl(targetUrl)) {
      return res.status(400).json({ message: "The provided URL appears to be unsafe and cannot be shortened." });
    }

    // Get user to check subscription status
    const user = await User.findById(ownerId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    await syncSubscriptionExpiry(user);

    // Check subscription limits for free users
    if (!user.isSubscribed) {
      // Count links created this month
      const startOfMonth = new Date();
      startOfMonth.setDate(1);
      startOfMonth.setHours(0, 0, 0, 0);

      const linksThisMonth = await Link.countDocuments({
        ownerId: ownerId,
        createdAt: { $gte: startOfMonth }
      });

      if (linksThisMonth >= 5) {
        return res.status(403).json({
          message: "Free plan limit reached. You've created 5 links this month. Upgrade to Pro for unlimited links.",
          limitReached: true
        });
      }

      // Free users cannot use password protection
      if (password) {
        return res.status(403).json({
          message: "Password protection is a Pro feature. Upgrade to Pro to use this feature.",
          requiresPro: true
        });
      }

      // Free users cannot set custom expiration times
      if (expiry) {
        return res.status(403).json({
          message: "Custom expiration times are a Pro feature. Upgrade to Pro to use this feature.",
          requiresPro: true
        });
      }

      if (alias) {
        return res.status(403).json({
          message: "Custom aliases are a Pro feature. Upgrade to Pro to use this feature.",
          requiresPro: true
        });
      }
    }

    if (alias) {
      const aliasError = validateCustomAlias(alias);
      if (aliasError) {
        return res.status(400).json({ message: aliasError });
      }

      const existing = await Link.findOne({ slug: alias }).select("_id");
      if (existing) {
        return res.status(409).json({ message: "This alias is already taken. Please choose another one." });
      }
    }

    console.log(`Creating link for user: ${req.user.firstName} ${req.user.lastName}`);
    const slug = alias || nanoid(7);

    let passwordHash = null;
    if (password) {
      const salt = await bcrypt.genSalt(10);
      passwordHash = await bcrypt.hash(password, salt);
    }

    const link = await Link.create({
      slug,
      targetUrl,
      ownerId: req.user.id,
      passwordHash,
      expiry
    });

    res.json({ slug: link.slug });
  } catch (err) {
    if (err?.code === 11000) {
      return res.status(409).json({ message: "This alias is already taken. Please choose another one." });
    }
    res.status(500).json({ message: err.message });
  }
};

// export const redirectLink = async (req, res) => {
//   try {
//     const { slug } = req.params;
//     const { password } = req.body; // if protected, frontend should send

//     const link = await Link.findOne({ slug });
//     if (!link) return res.status(404).json({ message: "Link not found" });

//     if (link.expiry && new Date() > link.expiry) {
//       return res.status(410).json({ message: "Link expired" });
//     }

//     if (link.passwordHash) {
//       if (!password) return res.status(401).json({ message: "Password required" });
//       const valid = await bcrypt.compare(password, link.passwordHash);
//       if (!valid) return res.status(403).json({ message: "Wrong password" });
//     }

//     // log analytics
//     await Analytics.create({
//       linkId: link._id,
//       ip: req.ip,
//       referrer: req.get("Referrer"),
//       userAgent: req.get("User-Agent")
//     });

//     link.clicks++;
//     await link.save();

//     return res.redirect(link.targetUrl);
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };


export const getUserLinks = async (req, res) => {
  try {
    const userId = req.user.id;
    const links = await Link.find({ ownerId: userId }).sort({ createdAt: -1 }).lean();

    // Backfill click totals from analytics when the stored counter is behind
    const linkIds = links.map((l) => l._id);
    const eventCounts = linkIds.length
      ? await Analytics.aggregate([
          { $match: { linkId: { $in: linkIds } } },
          { $group: { _id: "$linkId", count: { $sum: 1 } } },
        ])
      : [];
    const countById = Object.fromEntries(
      eventCounts.map((row) => [row._id.toString(), row.count])
    );

    const withClicks = links.map((link) => {
      const eventCount = countById[link._id.toString()] || 0;
      const clicks = Math.max(link.clicks || 0, eventCount);
      return { ...link, clicks };
    });

    // Persist corrections so dashboard stats stay accurate
    await Promise.all(
      withClicks
        .filter((link, i) => link.clicks > (links[i].clicks || 0))
        .map((link) => Link.updateOne({ _id: link._id }, { $set: { clicks: link.clicks } }))
    );

    res.json(withClicks);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getDashboardStats = async (req, res) => {
  try {
    const userId = req.user.id;

    // Get all user's links
    const links = await Link.find({ ownerId: userId }).lean();
    const linkIds = links.map((l) => l._id);
    const eventCounts = linkIds.length
      ? await Analytics.aggregate([
          { $match: { linkId: { $in: linkIds } } },
          { $group: { _id: "$linkId", count: { $sum: 1 } } },
        ])
      : [];
    const countById = Object.fromEntries(
      eventCounts.map((row) => [row._id.toString(), row.count])
    );

    // Calculate statistics (prefer analytics event count when counter is behind)
    const totalLinks = links.length;
    const totalClicks = links.reduce((sum, link) => {
      const eventCount = countById[link._id.toString()] || 0;
      return sum + Math.max(link.clicks || 0, eventCount);
    }, 0);

    // Count active links (not expired by date or admin action)
    const activeLinks = links.filter((link) => {
      if (link.status === 'expired') return false;
      return !link.expiry || new Date(link.expiry) > new Date();
    }).length;

    res.json({
      totalLinks,
      totalClicks,
      activeLinks
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const redirectLink = async (req, res) => {
  try {
    const { slug } = req.params;

    // Link is already validated and retrieved by passwordValidationMiddleware
    const link = req.link;
    if (!link) return res.status(404).json({ message: "Link not found" });

    // Extract current user if auth token is provided in request headers
    let currentUserId = null;
    const authHeader = req.headers["authorization"];
    if (authHeader && authHeader.startsWith("Bearer ")) {
      const token = authHeader.split(" ")[1];
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key-change-in-production');
        currentUserId = decoded.id;
      } catch (err) {
        // Token verification failed or expired, ignore
      }
    }

    // Extract comprehensive analytics data
    const userAgent = req.headers["user-agent"];
    const referrer = req.headers["referer"] || req.headers["referrer"];
    const acceptLanguage = req.headers["accept-language"];

    const userAgentData = parseUserAgent(userAgent);
    const screenResolution = extractScreenResolution(userAgent);
    const language = extractLanguage(acceptLanguage);
    const timezone = extractTimezone(userAgent);

    // Get location data from IP
    const locationData = await getLocationFromIP(req.ip);

    // Create detailed analytics record (do not attribute anonymous visits to the owner)
    const analyticsData = {
      linkId: link._id,
      userId: currentUserId || null,
      timestamp: new Date(),
      ip: req.ip,
      referrer: referrer,
      userAgent: userAgent,
      country: locationData.country,
      city: locationData.city,
      region: locationData.region,
      deviceType: userAgentData.deviceType,
      browser: userAgentData.browser,
      browserVersion: userAgentData.browserVersion,
      os: userAgentData.os,
      osVersion: userAgentData.osVersion,
      screenResolution: screenResolution,
      timezone: timezone,
      language: language
    };

    await Analytics.create(analyticsData);

    // Count every successful access so dashboard / My Links / Analytics stay in sync
    link.clicks = (link.clicks || 0) + 1;
    await link.save();

    // Return target URL as JSON
    return res.json({ targetUrl: link.targetUrl });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Admin functions
export const getAllLinks = async (req, res) => {
  try {
    const links = await Link.find().populate('ownerId', 'firstName lastName email').sort({ createdAt: -1 });
    res.json(links);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const deleteLink = async (req, res) => {
  try {
    const { id } = req.params;
    const link = await Link.findByIdAndDelete(id);
    if (!link) return res.status(404).json({ message: "Link not found" });
    res.json({ message: "Link deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const deleteUserLink = async (req, res) => {
  try {
    const { slug } = req.params;
    const userId = req.user.id;

    console.log(`Attempting to delete link - Slug: ${slug}, UserId: ${userId}`);

    // Find and delete the link, ensuring it belongs to the current user
    const link = await Link.findOneAndDelete({ slug, ownerId: userId });

    if (!link) {
      console.log(`Link not found - Slug: ${slug}, UserId: ${userId}`);
      return res.status(404).json({ message: "Link not found or you don't have permission to delete it" });
    }

    console.log(`Link deleted successfully - Slug: ${slug}, UserId: ${userId}`);
    res.json({ message: "Link deleted successfully" });
  } catch (err) {
    console.error(`Error deleting link - Slug: ${slug}, UserId: ${userId}, Error: ${err.message}`);
    res.status(500).json({ message: err.message });
  }
};

export const forceExpireLink = async (req, res) => {
  try {
    const { id } = req.params;
    const link = await Link.findByIdAndUpdate(id, { status: 'expired' }, { new: true });
    if (!link) return res.status(404).json({ message: "Link not found" });
    res.json({ message: "Link expired successfully", link });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getReportedLinks = async (req, res) => {
  try {
    const links = await Link.find({ status: 'reported' }).populate('ownerId', 'firstName lastName email').sort({ createdAt: -1 });
    res.json(links);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const warnUser = async (req, res) => {
  try {
    const { userId } = req.params;
    // For now, just log the warning. In a real app, you might send an email or notification.
    console.log(`Warning sent to user ${userId}`);
    res.json({ message: "User warned successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const blockUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findByIdAndUpdate(userId, { role: 'blocked' }, { new: true });
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json({ message: "User blocked successfully", user });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Security monitoring functions
export const getFailedAttempts = async (req, res) => {
  try {
    const { linkId, limit = 50 } = req.query;
    let query = {};

    if (linkId) {
      query.linkId = linkId;
    }

    const failedAttempts = await FailedAttempt.find(query)
      .populate('linkId', 'slug targetUrl')
      .sort({ timestamp: -1 })
      .limit(parseInt(limit));

    res.json({
      success: true,
      count: failedAttempts.length,
      failedAttempts
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getFlaggedLinks = async (req, res) => {
  try {
    const flaggedLinks = await Link.find({
      $or: [
        { flaggedForAbuse: true },
        { status: 'locked' },
        { status: 'flagged' }
      ]
    })
    .populate('ownerId', 'firstName lastName email')
    .sort({ flaggedAt: -1, lastFailedAttempt: -1 });

    res.json({
      success: true,
      count: flaggedLinks.length,
      flaggedLinks
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getIPAnalytics = async (req, res) => {
  try {
    const { flagged, blocked, limit = 50 } = req.query;
    let query = {};

    if (flagged === 'true') query.flagged = true;
    if (blocked === 'true') query.blocked = true;

    const ipAnalytics = await IPAnalytics.find(query)
      .populate('linksAccessed', 'slug targetUrl')
      .sort({ lastRequest: -1 })
      .limit(parseInt(limit));

    res.json({
      success: true,
      count: ipAnalytics.length,
      ipAnalytics
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const unflagLink = async (req, res) => {
  try {
    const { id } = req.params;
    const link = await Link.findByIdAndUpdate(id, {
      flaggedForAbuse: false,
      flaggedReason: null,
      flaggedAt: null,
      lockedUntil: null,
      lockReason: null
    }, { new: true });

    if (!link) return res.status(404).json({ message: "Link not found" });

    res.json({
      success: true,
      message: "Link unflagged successfully",
      link
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const blockIP = async (req, res) => {
  try {
    const { ip } = req.params;
    const { reason, duration } = req.body; // duration in minutes

    let resetTime = null;
    if (duration) {
      resetTime = new Date(Date.now() + duration * 60 * 1000);
    }

    const ipAnalytics = await IPAnalytics.findOneAndUpdate(
      { ip },
      {
        blocked: true,
        blockReason: reason || 'Manual block by admin',
        blockedAt: new Date(),
        resetTime
      },
      { upsert: true, new: true }
    );

    res.json({
      success: true,
      message: "IP blocked successfully",
      ipAnalytics
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const unblockIP = async (req, res) => {
  try {
    const { ip } = req.params;

    const ipAnalytics = await IPAnalytics.findOneAndUpdate(
      { ip },
      {
        blocked: false,
        blockReason: null,
        blockedAt: null,
        resetTime: null
      },
      { new: true }
    );

    if (!ipAnalytics) {
      return res.status(404).json({ message: "IP not found" });
    }

    res.json({
      success: true,
      message: "IP unblocked successfully",
      ipAnalytics
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};