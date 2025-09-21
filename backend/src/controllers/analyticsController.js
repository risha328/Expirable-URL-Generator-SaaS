import Link from "../models/Link.js";
import Analytics from "../models/Analytics.js"

export const getAnalytics = async (req, res) => {
  try {
    const { linkId } = req.params;

    const link = await Link.findOne({ slug: linkId });
    if (!link) return res.status(404).json({ message: "Link not found" });

    res.json({
      clicks: link.clicks,
      createdAt: link.createdAt,
      expiry: link.expiry,
      analytics: link.analytics || []
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
