import FailedAttempt from "../models/FailedAttempt.js";
import IPAnalytics from "../models/IPAnalytics.js";
import Link from "../models/Link.js";

// Get failed login attempts
export const getFailedAttempts = async (req, res) => {
  try {
    const { limit = 50 } = req.query;

    const failedAttempts = await FailedAttempt.aggregate([
      {
        $group: {
          _id: "$ip",
          attempts: { $sum: 1 },
          lastAttempt: { $max: "$timestamp" },
          userAgent: { $first: "$userAgent" },
          reasons: { $addToSet: "$reason" }
        }
      },
      {
        $sort: { attempts: -1, lastAttempt: -1 }
      },
      {
        $limit: parseInt(limit)
      },
      {
        $project: {
          ip: "$_id",
          attempts: 1,
          lastAttempt: 1,
          userAgent: 1,
          reasons: 1
        }
      }
    ]);

    res.json(failedAttempts);
  } catch (err) {
    console.error("Error fetching failed attempts:", err);
    res.status(500).json({ message: "Error fetching failed attempts" });
  }
};

// Get flagged suspicious links
export const getFlaggedLinks = async (req, res) => {
  try {
    const { limit = 50 } = req.query;

    const flaggedLinks = await Link.find({
      $or: [
        { flaggedForAbuse: true },
        { status: "flagged" }
      ]
    })
    .populate('ownerId', 'firstName lastName email')
    .sort({ flaggedAt: -1, failedAttempts: -1 })
    .limit(parseInt(limit))
    .select('slug targetUrl flaggedForAbuse flaggedReason flaggedAt failedAttempts status createdAt');

    // Add suspicious clicks count based on failed attempts
    const linksWithSuspiciousClicks = await Promise.all(
      flaggedLinks.map(async (link) => {
        const suspiciousClicks = await FailedAttempt.countDocuments({ linkId: link._id });
        return {
          ...link.toObject(),
          suspiciousClicks
        };
      })
    );

    res.json(linksWithSuspiciousClicks);
  } catch (err) {
    console.error("Error fetching flagged links:", err);
    res.status(500).json({ message: "Error fetching flagged links" });
  }
};

// Get IP analytics data
export const getIPAnalytics = async (req, res) => {
  try {
    const { limit = 50, flagged, blocked } = req.query;

    let query = {};

    // Build query based on filters
    if (flagged === 'true') {
      query.flagged = true;
    } else if (flagged === 'false') {
      query.flagged = false;
    }

    if (blocked === 'true') {
      query.blocked = true;
    } else if (blocked === 'false') {
      query.blocked = false;
    }

    // If no specific filters, show IPs with activity
    if (Object.keys(query).length === 0) {
      query = {
        $or: [
          { flagged: true },
          { blocked: true },
          { requestCount: { $gt: 5 } } // IPs with moderate activity
        ]
      };
    }

    const ipAnalytics = await IPAnalytics.find(query)
      .sort({ requestCount: -1, lastRequest: -1 })
      .limit(parseInt(limit))
      .populate('linksAccessed', 'slug targetUrl');

    res.json({ ipAnalytics });
  } catch (err) {
    console.error("Error fetching IP analytics:", err);
    res.status(500).json({ message: "Error fetching IP analytics" });
  }
};

// Unflag a link
export const unflagLink = async (req, res) => {
  try {
    const { linkId } = req.params;

    const link = await Link.findByIdAndUpdate(
      linkId,
      {
        flaggedForAbuse: false,
        flaggedReason: null,
        flaggedAt: null,
        status: "active"
      },
      { new: true }
    );

    if (!link) {
      return res.status(404).json({ message: "Link not found" });
    }

    res.json({ message: "Link unflagged successfully", link });
  } catch (err) {
    console.error("Error unflagging link:", err);
    res.status(500).json({ message: "Error unflagging link" });
  }
};

// Block an IP address
export const blockIP = async (req, res) => {
  try {
    const { ip } = req.body;

    if (!ip) {
      return res.status(400).json({ message: "IP address is required" });
    }

    const ipAnalytics = await IPAnalytics.findOneAndUpdate(
      { ip },
      {
        blocked: true,
        blockedAt: new Date(),
        blockReason: "Admin blocked"
      },
      { new: true, upsert: true }
    );

    res.json({ message: "IP blocked successfully", ipAnalytics });
  } catch (err) {
    console.error("Error blocking IP:", err);
    res.status(500).json({ message: "Error blocking IP" });
  }
};

// Unblock an IP address
export const unblockIP = async (req, res) => {
  try {
    const { ip } = req.body;

    if (!ip) {
      return res.status(400).json({ message: "IP address is required" });
    }

    const ipAnalytics = await IPAnalytics.findOneAndUpdate(
      { ip },
      {
        blocked: false,
        blockedAt: null,
        blockReason: null
      },
      { new: true }
    );

    if (!ipAnalytics) {
      return res.status(404).json({ message: "IP analytics not found" });
    }

    res.json({ message: "IP unblocked successfully", ipAnalytics });
  } catch (err) {
    console.error("Error unblocking IP:", err);
    res.status(500).json({ message: "Error unblocking IP" });
  }
};
