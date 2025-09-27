import bcrypt from "bcryptjs";
import sendMail from "../config/mail.js";
import genToken from "../config/token.js";
import User from "../models/user.model.js";

export const signUp = async (req, res) => {
  try {
    const { fullName, email, password, role = "user", mobile = "" } = req.body;

    if (!fullName || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already exists!" });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ 
      fullName, 
      email, 
      role, 
      mobile, 
      password: hashedPassword 
    });

    const token = genToken(user._id);

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 10 * 24 * 60 * 60 * 1000
    });

    const userResponse = {
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      role: user.role,
      mobile: user.mobile,
      token: token
    };

    return res.status(201).json({
      message: "User created successfully",
      user: userResponse
    });

  } catch (error) {
    console.error("Signup error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const signIn = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const token = genToken(user._id);

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 10 * 24 * 60 * 60 * 1000
    });

    const userResponse = {
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      role: user.role,
      mobile: user.mobile,
      token: token
    };

    return res.status(200).json({
      message: "Login successful",
      user: userResponse
    });

  } catch (error) {
    console.error("Signin error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// ... other auth functions remain similar but with better error handling
