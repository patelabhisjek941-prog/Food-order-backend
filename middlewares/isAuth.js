
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
    // Check Authorization header first, fallback to cookie
    const token =
      req.headers.authorization?.split(" ")[1] ||
      req.cookies?.token;

    if (!token) {
      return res.status(400).json({ message: "token is not found" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.userId || decoded.id || decoded._id;

    next();
  } catch (err) {
    console.error("isAuth error:", err);
    return res.status(401).json({ message: "invalid or expired token" });
  }
}





