import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

export default async function isAuth(req, res, next) {
  try {
    console.log("🔐 Auth middleware triggered");
    console.log("📨 Headers:", req.headers);
    console.log("🍪 Cookies:", req.cookies);

    // Get token from multiple sources
    let token = null;

    // 1. Check Authorization header first
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith("Bearer ")) {
      token = authHeader.split(" ")[1];
      console.log("✅ Token found in Authorization header");
    }
    
    // 2. Check cookies if no header token
    if (!token && req.cookies?.token) {
      token = req.cookies.token;
      console.log("✅ Token found in cookies");
    }

    // 3. Check query string (for development/testing)
    if (!token && req.query?.token) {
      token = req.query.token;
      console.log("✅ Token found in query string");
    }

    if (!token) {
      console.log("❌ No token found in request");
      return res.status(401).json({ 
        message: "Authentication required. Please login again.",
        details: "No token provided in headers or cookies"
      });
    }

    // Verify token
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log("✅ Token verified successfully");
      console.log("🔑 Decoded token:", decoded);
    } catch (err) {
      console.log("❌ Token verification failed:", err.message);
      return res.status(401).json({ 
        message: "Invalid or expired token. Please login again.",
        details: err.message 
      });
    }

    // Check if user exists in database
    const user = await User.findById(decoded.userId).select("-password");
    if (!user) {
      console.log("❌ User not found in database");
      return res.status(401).json({ 
        message: "User account not found. Please login again." 
      });
    }

    // Attach user to request
    req.userId = user._id;
    req.user = user;
    
    console.log("✅ Authentication successful for user:", user.email);
    next();

  } catch (error) {
    console.error("🔴 Auth middleware unexpected error:", error);
    return res.status(500).json({ 
      message: "Authentication failed due to server error",
      ...(process.env.NODE_ENV === 'development' && { error: error.message })
    });
  }
}

// Optional: Role-based middleware
export function requireRole(allowedRoles) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: "Authentication required" });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ 
        message: "Access denied. Insufficient permissions.",
        requiredRoles: allowedRoles,
        userRole: req.user.role
      });
    }

    next();
  };
}
