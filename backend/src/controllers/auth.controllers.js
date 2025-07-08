import bcrypt from "bcrypt";
import User from "../models/Users.models.js";
import jwt from "jsonwebtoken";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

const registerUser = async (req, res) => {
  try {
    console.log("Registration request body:", req.body);
    console.log("Registration request file:", req.file);

    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required",
      });
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        message: "Invalid email format",
      });
    }

    // Password length validation
    if (password.length < 8) {
      return res.status(400).json({
        message: "Password must be at least 8 characters long",
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        message: "Email already registered",
      });
    }

    // Handle avatar upload
    let avatarUrl = null;
    if (req.file) {
      try {
        const cloudinaryResponse = await uploadOnCloudinary(req.file.path);
        if (cloudinaryResponse) {
          avatarUrl = cloudinaryResponse.secure_url;
        }
      } catch (uploadError) {
        console.error("Avatar upload error:", uploadError);
      }
    }

    // Create new user
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({
      email,
      password: hashedPassword,
      avatar: avatarUrl,
    });

    // Save user
    const savedUser = await user.save();
    console.log("User saved successfully:", savedUser);

    res.status(201).json({
      message: "Registration successful",
    });
  } catch (err) {
    console.error("Registration error details:", err);
    res.status(500).json({
      message: "Server error during registration",
      error: err.message,
    });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required",
      });
    }

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    // Generate token
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET || "your-secret-key",
      { expiresIn: "1d" }
    );

    // Set cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "none",
      maxAge: 24 * 60 * 60 * 1000, // 1 day
      path: "/",
    });

    // Send response
    res.status(200).json({
      message: "Login successful",
      user: {
        id: user._id,
        email: user.email,
        avatar: user.avatar,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({
      message: "An error occurred during login",
      error: error.message,
    });
  }
};

const logoutUser = (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "none",
    path: "/",
  });
  res.json({ message: "Logged out successfully" });
};

const getCurrentUser = async (req, res) => {
  try {
    const token = req.cookies.token || "";
    if (token.length === 0) {
      return res.status(201).json({ message: "Not authenticated" });
    }
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "your-secret-key"
    );
    const user = await User.findById(decoded.userId).select("-password");

    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }
    res.json({ user });
  } catch (err) {
    console.error("Get current user error:", err);
    res.status(401).json({ message: "Not authenticated" });
  }
};

const introductionPage = (req, res) => {
  res.status(200).json({
    message:
      "Welcome to the Title Verification System! This is the introduction page.",
  });
};

export {
  registerUser,
  loginUser,
  logoutUser,
  getCurrentUser,
  introductionPage,
};
