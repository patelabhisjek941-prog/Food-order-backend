import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

export default async function isAuth(req, res, next) {
  try {
    let token = null;

    // Check Authorization header first
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith("Bearer ")) {
      token = authHeader.split(" ")[1];
    }
    
    // Check cookies if no header token
    if (!token && req.cookies?.token) {
      token = req.cookies.token;
    }

    if (!token) {
      return res.status(401).json({ 
        message: "Authentication required" 
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId).select("-password");
    
    if (!user) {
      return res.status(401).json({ 
        message: "User not found" 
      });
    }

    req.userId = user._id;
    req.user = user;
    
    next();
  } catch (error) {
    console.error("Auth error:", error);
    return res.status(401).json({ 
      message: "Invalid token" 
    });
  }
}

export function requireRole(allowedRoles) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: "Authentication required" });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ 
        message: "Access denied" 
      });
    }

    next();
  };
}
