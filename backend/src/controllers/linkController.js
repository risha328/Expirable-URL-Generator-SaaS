import bcrypt from "bcryptjs";
import { nanoid } from "nanoid";
import Link from "../models/Link.js";
import Analytics from "../models/Analytics.js";

export const createLink = async (req, res) => {
  try {
    const { targetUrl, password, expiry } = req.body;

     const ownerId = req.user.id;
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
    // Accept password from body for POST, query for GET
    const password = req.method === "POST" ? req.body.password : req.query.password;

    const link = await Link.findOne({ slug });
    if (!link) return res.status(404).json({ message: "Link not found" });

    if (link.expiry && new Date() > link.expiry) {
      return res.status(410).json({ message: "Link expired" });
    }

    if (link.passwordHash) {
      if (!password) return res.status(401).json({ message: "Password required" });
      const valid = await bcrypt.compare(password, link.passwordHash);
      if (!valid) return res.status(403).json({ message: "Wrong password" });
    }

    link.clicks++;
    link.analytics.push({
      ip: req.ip,
      timestamp: new Date(),
      userAgent: req.headers["user-agent"]
    });

    await link.save();

    // Return target URL as JSON instead of server-side redirect
    return res.json({ targetUrl: link.targetUrl });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
