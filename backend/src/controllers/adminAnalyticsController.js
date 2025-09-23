import Analytics from "../models/Analytics.js";
import Link from "../models/Link.js";
import User from "../models/User.js";

// Helper function to get date range
const getDateRange = (days) => {
  const endDate = new Date();
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);
  return { startDate, endDate };
};

// 📊 System Analytics

// Daily Clicks Graph
export const getDailyClicksGraph = async (req, res) => {
  try {
    const { days = 30 } = req.query;
    const { startDate, endDate } = getDateRange(parseInt(days));

    const dailyClicks = await Analytics.aggregate([
      {
        $match: {
          timestamp: { $gte: startDate, $lte: endDate }
        }
      },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$timestamp" }
          },
          clicks: { $sum: 1 }
        }
      },
      {
        $sort: { "_id": 1 }
      }
    ]);

    res.json(dailyClicks);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Most Clicked Links
export const getMostClickedLinks = async (req, res) => {
  try {
    const { limit = 10 } = req.query;

    const mostClicked = await Link.aggregate([
      {
        $lookup: {
          from: "analytics",
          localField: "_id",
          foreignField: "linkId",
          as: "analytics"
        }
      },
      {
        $addFields: {
          totalClicks: { $size: "$analytics" }
        }
      },
      {
        $sort: { totalClicks: -1 }
      },
      {
        $limit: parseInt(limit)
      },
      {
        $project: {
          slug: 1,
          targetUrl: 1,
          totalClicks: 1,
          createdAt: 1
        }
      }
    ]);

    res.json(mostClicked);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Top Active Users
export const getTopActiveUsers = async (req, res) => {
  try {
    const { limit = 10 } = req.query;

    const topUsers = await Analytics.aggregate([
      {
        $group: {
          _id: "$userId",
          totalClicks: { $sum: 1 },
          lastActivity: { $max: "$timestamp" }
        }
      },
      {
        $sort: { totalClicks: -1 }
      },
      {
        $limit: parseInt(limit)
      },
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "user"
        }
      },
      {
        $unwind: "$user"
      },
      {
        $project: {
          _id: 1,
          totalClicks: 1,
          lastActivity: 1,
          "user.firstName": 1,
          "user.lastName": 1,
          "user.email": 1
        }
      }
    ]);

    res.json(topUsers);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 🌍 Traffic Insights

// Country-based Clicks
export const getCountryBasedClicks = async (req, res) => {
  try {
    const { limit = 10 } = req.query;

    const countryStats = await Analytics.aggregate([
      {
        $match: { country: { $ne: null } }
      },
      {
        $group: {
          _id: "$country",
          clicks: { $sum: 1 },
          cities: { $addToSet: "$city" }
        }
      },
      {
        $sort: { clicks: -1 }
      },
      {
        $limit: parseInt(limit)
      },
      {
        $project: {
          country: "$_id",
          clicks: 1,
          citiesCount: { $size: "$cities" }
        }
      }
    ]);

    res.json(countryStats);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Referrer Data
export const getReferrerData = async (req, res) => {
  try {
    const { limit = 10 } = req.query;

    const referrerStats = await Analytics.aggregate([
      {
        $match: { referrer: { $ne: null, $ne: "" } }
      },
      {
        $group: {
          _id: "$referrer",
          clicks: { $sum: 1 }
        }
      },
      {
        $sort: { clicks: -1 }
      },
      {
        $limit: parseInt(limit)
      },
      {
        $project: {
          referrer: "$_id",
          clicks: 1
        }
      }
    ]);

    res.json(referrerStats);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Device/Browser Stats
export const getDeviceBrowserStats = async (req, res) => {
  try {
    const deviceStats = await Analytics.aggregate([
      {
        $match: { deviceType: { $ne: null } }
      },
      {
        $group: {
          _id: "$deviceType",
          clicks: { $sum: 1 }
        }
      },
      {
        $sort: { clicks: -1 }
      }
    ]);

    const browserStats = await Analytics.aggregate([
      {
        $match: { browser: { $ne: null } }
      },
      {
        $group: {
          _id: "$browser",
          clicks: { $sum: 1 }
        }
      },
      {
        $sort: { clicks: -1 }
      },
      {
        $limit: 10
      }
    ]);

    res.json({
      devices: deviceStats,
      browsers: browserStats
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Overall Analytics Summary
export const getAnalyticsSummary = async (req, res) => {
  try {
    const totalClicks = await Analytics.countDocuments();
    const uniqueUsers = await Analytics.distinct("userId").then(ids => ids.length);
    const uniqueLinks = await Analytics.distinct("linkId").then(ids => ids.length);

    const { startDate } = getDateRange(30);
    const recentClicks = await Analytics.countDocuments({
      timestamp: { $gte: startDate }
    });

    res.json({
      totalClicks,
      uniqueUsers,
      uniqueLinks,
      recentClicks,
      averageClicksPerDay: Math.round(recentClicks / 30)
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
