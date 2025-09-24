import bcrypt from "bcryptjs";
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

export const createLink = async (req, res) => {
  try {
    const { targetUrl, password, expiry } = req.body;
    const ownerId = req.user.id;

    // Get user to check subscription status
    const user = await User.findById(ownerId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

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
    }

    console.log(`Creating link for user: ${req.user.firstName} ${req.user.lastName}`);
    const slug = nanoid(7);

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

    res.json({ shortUrl: `${process.env.BASE_URL}/${slug}` });
  } catch (err) {
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
    const links = await Link.find({ ownerId: userId }).sort({ createdAt: -1 });
    res.json(links);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getDashboardStats = async (req, res) => {
  try {
    const userId = req.user.id;

    // Get all user's links
    const links = await Link.find({ ownerId: userId });

    // Calculate statistics
    const totalLinks = links.length;
    const totalClicks = links.reduce((sum, link) => sum + (link.clicks || 0), 0);

    // Count active links (not expired)
    const activeLinks = links.filter(link => {
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

    // Extract comprehensive analytics data
    const userAgent = req.headers["user-agent"];
    const referrer = req.headers["referer"] || req.headers["referrer"];
    const acceptLanguage = req.headers["accept-language"];

    const userAgentData = parseUserAgent(userAgent);
    const screenResolution = extractScreenResolution(userAgent);
    const language = extractLanguage(acceptLanguage);
    const timezone = extractTimezone(userAgent);

    // Get location data from IP (placeholder for now)
    const locationData = await getLocationFromIP(req.ip);

    // Create detailed analytics record
    const analyticsData = {
      linkId: link._id,
      userId: link.ownerId,
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

    // Save analytics data
    await Analytics.create(analyticsData);

    // Update link click count
    link.clicks++;
    await link.save();

    // Return target URL as JSON instead of server-side redirect
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
