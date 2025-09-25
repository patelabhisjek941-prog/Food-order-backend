import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

export default async function isAuth(req, res, next) {
  try {
    // Get token from multiple sources
    let token = null;

    // 1. Check Authorization header
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith("Bearer ")) {
      token = authHeader.split(" ")[1];
    }
    
    // 2. Check cookies
    if (!token && req.cookies?.token) {
      token = req.cookies.token;
    }

    // 3. Check query string (optional, for development)
    if (!token && req.query?.token) {
      token = req.query.token;
    }

    if (!token) {
      return res.status(401).json({ 
        message: "Access denied. No token provided." 
      });
    }

    // Verify token
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      return res.status(401).json({ 
        message: "Invalid or expired token." 
      });
    }

    // Check if user still exists
    const user = await User.findById(decoded.userId || decoded.id || decoded._id);
    if (!user) {
      return res.status(401).json({ 
        message: "User no longer exists." 
      });
    }

    // Attach user to request
    req.userId = user._id;
    req.user = user;

    next();
  } catch (error) {
    console.error("Auth middleware error:", error);
    return res.status(500).json({ 
      message: "Authentication failed." 
    });
  }
}

// Optional: Middleware to check specific roles
export function requireRole(roles) {
  return async (req, res, next) => {
    try {
      if (!req.userId) {
        return res.status(401).json({ message: "Authentication required" });
      }

      const user = await User.findById(req.userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      if (!roles.includes(user.role)) {
        return res.status(403).json({ 
          message: "Access denied. Insufficient permissions." 
        });
      }

      next();
    } catch (error) {
      console.error("Role check error:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  };
}
