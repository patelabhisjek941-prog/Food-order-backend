import express from "express";
import {
  signUp,
  signIn,
  signOut,
  googleAuth,
  sendOtp,
  verifyOtp,
  resetPassword,
  getCurrentUser
} from "../controllers/auth.controllers.js";
import isAuth from "../middlewares/isAuth.js";

const authRouter = express.Router();

// Public routes
authRouter.post("/signup", signUp);
authRouter.post("/signin", signIn);
authRouter.post("/googleauth", googleAuth);
authRouter.post("/sendotp", sendOtp);
authRouter.post("/verifyotp", verifyOtp);
authRouter.post("/resetpassword", resetPassword);

// Protected routes
authRouter.get("/signout", isAuth, signOut);
authRouter.get("/me", isAuth, getCurrentUser);

export default authRouter;
