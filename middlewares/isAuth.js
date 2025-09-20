// import jwt from "jsonwebtoken";

// const isAuth = async (req, res, next) => {
//   try {
//     const token = req.cookies.token;
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
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1]; // Bearer <token>

  if (!token) {
    return res.status(400).json({ message: "token is not found" });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: "invalid token" });
    req.user = user;
    next();
  });
}
