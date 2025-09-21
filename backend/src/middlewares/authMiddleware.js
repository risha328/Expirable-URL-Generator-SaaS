import jwt from "jsonwebtoken";

const authMiddleware = (req, res, next) => {
  // Get token from header
  const authHeader = req.headers["authorization"];
  if (!authHeader) return res.status(401).json({ message: "No token provided" });

  const token = authHeader.split(" ")[1]; // Bearer <token>
  if (!token) return res.status(401).json({ message: "Invalid token" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Add user info to req.user
    req.user = {
      id: decoded.id,
      firstName: decoded.firstName,
      lastName: decoded.lastName,
      role: decoded.role
    };

    next();
  } catch (err) {
    return res.status(403).json({ message: "Token is not valid" });
  }
};

export default authMiddleware;
