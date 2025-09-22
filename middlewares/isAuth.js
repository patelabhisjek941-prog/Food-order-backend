
import jwt from "jsonwebtoken";

export const isAuth = (req, res, next) => {
  try {
    const authHeader = req.headers["authorization"];
    if (!authHeader) {
      return res.status(400).json({ message: "token is not found" });
    }

    const token = authHeader.split(" ")[1]; // Bearer <token>
    if (!token) {
      return res.status(400).json({ message: "token is not found" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.id; // attach user id to request
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid token" });
  }
};









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



