import Link from "../models/Link.js";
import Analytics from "../models/Analytics.js"

export const getAnalytics = async (req, res) => {
  try {
    const { linkId } = req.params;
    const { range = '7d' } = req.query;

    const link = await Link.findOne({ slug: linkId });
    if (!link) return res.status(404).json({ message: "Link not found" });

    // Calculate date range
    const now = new Date();
    let startDate;
    switch (range) {
      case '30d':
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
      case '90d':
        startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
        break;
      case 'all':
        startDate = new Date(0); // Beginning of time
        break;
      default: // '7d'
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    }

    // Fetch analytics from the Analytics collection
    const analytics = await Analytics.find({
      linkId: link._id,
      timestamp: { $gte: startDate }
    }).sort({ timestamp: -1 });

    res.json({
      clicks: link.clicks,
      createdAt: link.createdAt,
      expiry: link.expiry,
      analytics: analytics
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
