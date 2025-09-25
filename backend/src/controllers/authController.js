import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const signup = async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;

    // check all fields
    if (!firstName || !lastName || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: "User already exists" });

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const user = await User.create({
      firstName,
      lastName,
      email,
      passwordHash
    });

    res.json({ message: "User created successfully", userId: user._id });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ message: "Email and password required" });

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign(
      { id: user._id, firstName: user.firstName, lastName: user.lastName, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      token,
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
        isSubscribed: user.isSubscribed
      }
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const adminSignup = async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;

    // check all fields
    if (!firstName || !lastName || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: "User already exists" });

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const user = await User.create({
      firstName,
      lastName,
      email,
      passwordHash,
      role: "admin"
    });

    res.json({ message: "Admin account created successfully", userId: user._id });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ message: "Email and password required" });

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    // Check if user has admin role
    if (user.role !== "admin") {
      return res.status(403).json({ message: "Admin access required" });
    }

    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign(
      { id: user._id, firstName: user.firstName, lastName: user.lastName, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      token,
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role
      }
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const validateToken = async (req, res) => {
  try {
    // Token validation is handled by authMiddleware
    // If we reach here, token is valid
    const user = await User.findById(req.user.id).select('-passwordHash');
    if (!user) return res.status(401).json({ message: "User not found" });

    res.json({
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
        isSubscribed: user.isSubscribed
      }
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    // Admin middleware already verified admin role
    // Only return users with role "user", exclude admins
    const users = await User.find({ role: 'user' }).select('-passwordHash').sort({ createdAt: -1 });

    res.json({
      success: true,
    users: users.map(user => ({
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
        isSubscribed: user.isSubscribed,
        subscriptionPlan: user.subscriptionPlan || (user.isSubscribed ? "Pro" : "Free"),
        createdAt: user.createdAt
    }))
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const updateSubscription = async (req, res) => {
  try {
    const userId = req.user.id;
    const { isSubscribed, subscriptionPlan } = req.body;

    if (typeof isSubscribed !== 'boolean') {
      return res.status(400).json({ message: "isSubscribed must be a boolean" });
    }

    const updateData = { isSubscribed };
    if (subscriptionPlan) {
      updateData.subscriptionPlan = subscriptionPlan;
    }

    const user = await User.findByIdAndUpdate(
      userId,
      updateData,
      { new: true }
    ).select('-passwordHash');

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      message: "Subscription updated successfully",
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
        isSubscribed: user.isSubscribed,
        subscriptionPlan: user.subscriptionPlan
      }
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-passwordHash');
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone,
        bio: user.bio,
        dateOfBirth: user.dateOfBirth,
        address: user.address,
        role: user.role,
        isSubscribed: user.isSubscribed,
        subscriptionPlan: user.subscriptionPlan,
        createdAt: user.createdAt
      }
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const { firstName, lastName, phone, bio, dateOfBirth, address } = req.body;

    // Validate required fields
    if (!firstName || !lastName) {
      return res.status(400).json({ message: "First name and last name are required" });
    }

    const updateData = {
      firstName,
      lastName,
      phone,
      bio,
      address
    };

    // Handle date of birth
    if (dateOfBirth) {
      updateData.dateOfBirth = new Date(dateOfBirth);
    }

    const user = await User.findByIdAndUpdate(
      userId,
      updateData,
      { new: true }
    ).select('-passwordHash');

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      message: "Profile updated successfully",
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone,
        bio: user.bio,
        dateOfBirth: user.dateOfBirth,
        address: user.address,
        role: user.role,
        isSubscribed: user.isSubscribed,
        subscriptionPlan: user.subscriptionPlan,
        createdAt: user.createdAt
      }
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
