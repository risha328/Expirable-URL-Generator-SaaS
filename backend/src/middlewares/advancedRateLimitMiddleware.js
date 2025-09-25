import IPAnalytics from "../models/IPAnalytics.js";

// Configuration - should be moved to environment variables
const MAX_REQUESTS_PER_IP = process.env.MAX_REQUESTS_PER_IP || 50; // per hour
const MAX_REQUESTS_PER_LINK = process.env.MAX_REQUESTS_PER_LINK || 100; // per hour
const TRACKING_WINDOW_HOURS = process.env.TRACKING_WINDOW_HOURS || 1;
const SUSPICIOUS_THRESHOLD = process.env.SUSPICIOUS_THRESHOLD || 30; // requests per hour

export const ipRateLimit = async (req, res, next) => {
  try {
    const ip = req.ip;

    // Find or create IP analytics record
    let ipAnalytics = await IPAnalytics.findOne({ ip });

    if (!ipAnalytics) {
      ipAnalytics = new IPAnalytics({ ip });
    }

    // Check if IP is blocked
    if (ipAnalytics.blocked) {
      if (ipAnalytics.resetTime && new Date() > ipAnalytics.resetTime) {
        // Reset block if time has passed
        ipAnalytics.blocked = false;
        ipAnalytics.blockReason = null;
        ipAnalytics.resetTime = null;
        await ipAnalytics.save();
      } else {
        return res.status(403).json({
          message: "IP address is temporarily blocked",
          blockReason: ipAnalytics.blockReason,
          resetTime: ipAnalytics.resetTime
        });
      }
    }

    // Check request rate using sliding window
    const windowStart = new Date(Date.now() - TRACKING_WINDOW_HOURS * 60 * 60 * 1000);
    const recentRequests = ipAnalytics.requestTimestamps.filter(req =>
      req.timestamp >= windowStart
    ).length;

    if (recentRequests >= MAX_REQUESTS_PER_IP) {
      // Flag IP for suspicious activity
      ipAnalytics.flagged = true;
      ipAnalytics.flaggedReason = `Exceeded ${MAX_REQUESTS_PER_IP} requests per hour`;
      ipAnalytics.flaggedAt = new Date();
      await ipAnalytics.save();

      return res.status(429).json({
        message: `Rate limit exceeded. Maximum ${MAX_REQUESTS_PER_IP} requests per hour.`,
        retryAfter: TRACKING_WINDOW_HOURS * 60 * 60
      });
    }

    // Update request timestamps and last request time
    const currentTime = new Date();
    ipAnalytics.requestTimestamps.push({ timestamp: currentTime });
    ipAnalytics.lastRequest = currentTime;

    // Keep only recent timestamps (last 1000 to prevent unbounded growth)
    if (ipAnalytics.requestTimestamps.length > 1000) {
      ipAnalytics.requestTimestamps = ipAnalytics.requestTimestamps.slice(-1000);
    }

    await ipAnalytics.save();

    // Store IP analytics in request for later use
    req.ipAnalytics = ipAnalytics;

    next();
  } catch (error) {
    console.error('IP rate limit middleware error:', error);
    res.status(500).json({ message: "Rate limiting check failed" });
  }
};

export const linkAbuseDetection = async (req, res, next) => {
  try {
    const { slug } = req.params;
    const ip = req.ip;

    // Find the link
    const Link = (await import("../models/Link.js")).default;
    const link = await Link.findOne({ slug });

    if (!link) {
      return res.status(404).json({ message: "Link not found" });
    }

    // Check if link is flagged for abuse
    if (link.flaggedForAbuse) {
      return res.status(403).json({
        message: "Link has been flagged for suspicious activity",
        flaggedReason: link.flaggedReason,
        flaggedAt: link.flaggedAt
      });
    }

    // Track recent requests for this link
    const windowStart = new Date(Date.now() - TRACKING_WINDOW_HOURS * 60 * 60 * 1000);

    // Count requests from this IP to this specific link
    const recentRequestsForLink = link.recentRequests.filter(req =>
      req.ip === ip && req.timestamp >= windowStart
    ).length;

    if (recentRequestsForLink >= MAX_REQUESTS_PER_LINK) {
      // Flag link for abuse
      link.flaggedForAbuse = true;
      link.flaggedReason = `IP ${ip} made ${recentRequestsForLink} requests to this link in ${TRACKING_WINDOW_HOURS} hours`;
      link.flaggedAt = new Date();
      await link.save();

      return res.status(429).json({
        message: `Too many requests to this link. Link has been temporarily disabled.`,
        flaggedReason: link.flaggedReason
      });
    }

    // Add current request to tracking
    link.recentRequests.push({
      ip: ip,
      timestamp: new Date(),
      userAgent: req.headers['user-agent']
    });

    // Keep only recent requests (last 1000)
    if (link.recentRequests.length > 1000) {
      link.recentRequests = link.recentRequests.slice(-1000);
    }

    await link.save();

    // Store link in request for later use
    req.link = link;

    next();
  } catch (error) {
    console.error('Link abuse detection middleware error:', error);
    res.status(500).json({ message: "Abuse detection check failed" });
  }
};

export const updateIPAnalytics = async (req, res, next) => {
  try {
    const ip = req.ip;
    const ipAnalytics = req.ipAnalytics;

    if (ipAnalytics && req.link) {
      // Add link to IP's accessed links if not already present
      if (!ipAnalytics.linksAccessed.includes(req.link._id)) {
        ipAnalytics.linksAccessed.push(req.link._id);
        await ipAnalytics.save();
      }
    }

    next();
  } catch (error) {
    console.error('Update IP analytics error:', error);
    next(); // Don't block request for analytics errors
  }
};
