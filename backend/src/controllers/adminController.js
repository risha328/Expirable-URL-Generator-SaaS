import User from "../models/User.js";
import Link from "../models/Link.js";
import Analytics from "../models/Analytics.js";

export const getDashboardStats = async (req, res) => {
  try {
    // Get total users with role = "user"
    const totalUsers = await User.countDocuments({ role: "user" });

    // Get total count of links
    const totalLinks = await Link.countDocuments();

    // Get total clicks (sum of all link clicks)
    const linksWithClicks = await Link.aggregate([
      {
        $group: {
          _id: null,
          totalClicks: { $sum: "$clicks" }
        }
      }
    ]);
    const totalClicks = linksWithClicks.length > 0 ? linksWithClicks[0].totalClicks : 0;

    // Get active links count
    const activeLinks = await Link.countDocuments({ status: "active" });

    res.json({
      totalUsers,
      totalLinks,
      totalClicks,
      activeLinks
    });
  } catch (err) {
    console.error("Error fetching dashboard stats:", err);
    res.status(500).json({ message: "Error fetching dashboard statistics" });
  }
};
