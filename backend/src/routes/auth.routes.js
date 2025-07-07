import express from "express";
import { upload } from "../middlewares/multer.middlewares.js";
import {
  registerUser,
  loginUser,
  logoutUser,
  getCurrentUser,
  introductionPage,
} from "../controllers/auth.controllers.js";

const router = express.Router();

// Register with file upload
router.post("/register", upload.single("avatar"), registerUser);

// Login
router.post("/login", loginUser);

// Logout
router.post("/logout", logoutUser);

// Get current user
router.get("/me", getCurrentUser);

// Get introduction page
router.get("/", introductionPage);

export default router;
