import bcrypt from "bcrypt";
import User from "../models/Users.models.js";
import jwt from "jsonwebtoken";

const registerUser = async (req, res) => {
  try {
    console.log("Registration request body:", req.body);

    const { name, email, password, role } = req.body;


    // Validate input
    if (!email || !password || !name || !role) {
      return res.status(400).json({
        message: "Email, password, name, and role are required",
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

    // Create new user
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({
      email,
      password: hashedPassword,
      name: name,
      role: role,
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
    const { email, password, role } = req.body;

    // Validate input
    if (!email || !password || !role) {
      return res.status(400).json({
        message: "Email, password, and role are required",
      });
    }

    // Find user
    const user = await User.findOne({ email, role });
    if (!user) {
      return res.status(401).json({
        message: "Invalid email or password or role",
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
      { 
        userId: user._id,
        role: user.role
      },
      process.env.JWT_SECRET || "your-secret-key",
      { expiresIn: "1d" }
    );

    console.log("Token: ",token)

    // Set cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      path: "/",
      maxAge: 24 * 60 * 60 * 1000,
    });

    // Send response
    res.status(200).json({
      message: "Login successful",
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        role: user.role,
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
  res.clearCookie("token",{
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    path: "/",
  }
  );
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
    return res.json({ user });
  } catch (err) {
    console.error("Get current user error:", err);
    return res.status(401).json({ message: "Not authenticated" });
  }
};


export {
  registerUser,
  loginUser,
  logoutUser,
  getCurrentUser,
};
