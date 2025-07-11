import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import multer from "multer";

// Load environment variables
dotenv.config();

// Get current file path and directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Create Express app
const app = express();

const url =
  process.env.NODE_ENV === "development"
    ? process.env.DEVELOPMENT_FRONTEND_URL
    : process.env.PRODUCTION_FRONTEND_URL;
// CORS configuration
app.use(
  cors({
    origin: url.toString(),
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "X-Requested-With",
      "Accept",
      "Origin",
    ],
    exposedHeaders: ["Set-Cookie"],
    preflightContinue: false,
    optionsSuccessStatus: 204,
  })
);

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Serve static files from the public directory
app.use("/public", express.static(join(__dirname, "public")));

// Create public/temp directory if it doesn't exist
import fs from "fs";
const tempDir = join(__dirname, "public", "temp");
if (!fs.existsSync(tempDir)) {
  fs.mkdirSync(tempDir, { recursive: true });
}

//import routes
import authRoutes from "./src/routes/auth.routes.js";
import titleRoutes from "./src/routes/title.routes.js";

//use routes
app.use("/api/auth", authRoutes);
app.use("/api/titles", titleRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error("Error:", err);
  if (err instanceof multer.MulterError) {
    return res.status(400).json({
      message: "File upload error",
      error: err.message,
    });
  }
  res.status(500).json({
    message: "Internal server error",
    error: err.message,
  });
});

export default app;
