
// import jwt from "jsonwebtoken";

// const isAuth = async (req, res, next) => {
//   try {
//     const token = req.cookies.token || req.headers.authorization?.split(" ")[1];
//     if (!token) {
//       return res.status(400).json({ message: "token is not found" });
//     }

//     const verifyToken = jwt.verify(token, process.env.JWT_SECRET);
//     req.userId = verifyToken.userId;

//     next();
//   } catch (error) {
//     return res.status(500).json({ message: `is auth error ${error}` });
//   }
// };

// export default isAuth;

import jwt from "jsonwebtoken";

export default function isAuth(req, res, next) {
  try {
    // Get token from header or cookie
    const authHeader = req.headers.authorization;
    const token = authHeader?.startsWith("Bearer ")
      ? authHeader.split(" ")[1]
      : req.cookies?.token;

    if (!token) {
      return res.status(401).json({ message: "No token found. Please login again." });
    }

    // Verify token
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      return res.status(401).json({ message: "Invalid or expired token." });
    }

    // Attach userId to request
    req.userId = decoded.userId || decoded.id || decoded._id;

    if (!req.userId) {
      return res.status(401).json({ message: "Invalid token payload." });
    }

    next();
  } catch (err) {
    console.error("isAuth unexpected error:", err);
    return res.status(500).json({ message: "Authentication failed." });
  }
}






