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

export const getChartData = async (req, res) => {
  try {
    const { timeRange = '7d' } = req.query;

    // Calculate date range
    const now = new Date();
    let startDate = new Date();

    switch (timeRange) {
      case '7d':
        startDate.setDate(now.getDate() - 7);
        break;
      case '30d':
        startDate.setDate(now.getDate() - 30);
        break;
      case '90d':
        startDate.setDate(now.getDate() - 90);
        break;
      default:
        startDate.setDate(now.getDate() - 7);
    }

    // Get daily clicks data
    const dailyClicks = await Link.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate }
        }
      },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$createdAt" }
          },
          clicks: { $sum: "$clicks" },
          count: { $sum: 1 }
        }
      },
      {
        $sort: { "_id": 1 }
      }
    ]);

    // Get active users trend (users created in the time range)
    const activeUsers = await User.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate },
          role: "user"
        }
      },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$createdAt" }
          },
          count: { $sum: 1 }
        }
      },
      {
        $sort: { "_id": 1 }
      }
    ]);

    // Generate all dates in the range for consistent data
    const allDates = [];
    const currentDate = new Date(startDate);

    while (currentDate <= now) {
      allDates.push(currentDate.toISOString().split('T')[0]);
      currentDate.setDate(currentDate.getDate() + 1);
    }

    // Fill in missing dates with 0 values
    const dailyClicksMap = dailyClicks.reduce((acc, item) => {
      acc[item._id] = item.clicks;
      return acc;
    }, {});

    const activeUsersMap = activeUsers.reduce((acc, item) => {
      acc[item._id] = item.count;
      return acc;
    }, {});

    const dailyClicksData = allDates.map(date => dailyClicksMap[date] || 0);
    const activeUsersData = allDates.map(date => activeUsersMap[date] || 0);

    // Generate labels based on time range
    const labels = allDates.map(date => {
        const dateObj = new Date(date);
        const dayOfWeek = dateObj.getDay();

        if (timeRange === '7d') {
          // For 7-day range, show day names
          const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
          return dayNames[dayOfWeek];
        } else if (timeRange === '30d') {
          return `Day ${dateObj.getDate()}`;
        } else if (timeRange === '90d') {
          const weekNum = Math.floor((dateObj - startDate) / (7 * 24 * 60 * 60 * 1000)) + 1;
          const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
          return `Week ${weekNum}.${dayNames[dayOfWeek]}`;
        }
        return date;
      });

    res.json({
      labels,
      dailyClicks: dailyClicksData,
      activeUsers: activeUsersData
    });
  } catch (err) {
    console.error("Error fetching chart data:", err);
    res.status(500).json({ message: "Error fetching chart data" });
  }
};
