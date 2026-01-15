import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

// Create Express app
const app = express();

const url =
  process.env.NODE_ENV === "development"
    ? process.env.DEVELOPMENT_FRONTEND_URL
    : process.env.PRODUCTION_FRONTEND_URL;
    
// CORS configuration
app.use(
  cors({
    origin: url,
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

//import routes
import authRoutes from "./src/routes/auth.routes.js";
import titleRoutes from "./src/routes/title.routes.js";
import adminRoutes from "./src/routes/admin.routes.js";

//use admin routes
app.use("/api/admin", adminRoutes);

//use routes
app.use("/api/auth", authRoutes);
app.use("/api/titles", titleRoutes);


// Error handling middleware
app.use((err, req, res, next) => {
  console.error("Error:", err);
  
  res.status(500).json({
    message: "Internal server error",
    error: err.message,
  });
});

export default app;
