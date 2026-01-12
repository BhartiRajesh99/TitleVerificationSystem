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

// Temporary route to update existing documents in the titles collection
import Title from "./src/models/Title.models.js";
app.get("/update-db", async (req, res) => {
  try {
    const STATE_MAP = {
      MP: "Madhya Pradesh",
      UP: "Uttar Pradesh",
      WB: "West Bengal",

      RAJ: "Rajasthan",
      PUN: "Punjab",
      CHA: "Chandigarh",

      BIH: "Bihar",
      JHA: "Jharkhand",
      DEL: "Delhi",

      TEL: "Telangana",
      ODI: "Odisha",
      MAH: "Maharashtra",

      UTT: "Uttarakhand",
      JK: "Jammu and Kashmir",
      HP: "Himachal Pradesh",

      HAR: "Haryana",
      KAR: "Karnataka",
      AP: "Andhra Pradesh",

      SIK: "Sikkim",
      GUJ: "Gujarat",
      CHH: "Chhattisgarh",

      AND: "Andaman and Nicobar Islands",
      ARP: "Arunachal Pradesh",
      ASS: "Assam",

      DD: "Dadra and Nagar Haveli and Daman and Diu",
      GOA: "Goa",
      KER: "Kerala",

      LD: "Lakshadweep",
      LAK: "Ladakh",

      MAN: "Manipur",
      MEG: "Meghalaya",
      MIZ: "Mizoram",
      NAG: "Nagaland",

      PON: "Puducherry",
      TN: "Tamil Nadu",
      TRI: "Tripura",
    };
    const titles = await Title.find({}, { state: 1 });

    let updated = 0;

    for (const doc of titles) {
      if (!doc.state) continue;

      const normalized = doc.state
        .trim()
        .toUpperCase()
        .replace(/\./g, "");

      if (STATE_MAP[normalized]) {
        await Title.updateOne(
          { _id: doc._id },
          { $set: { state: STATE_MAP[normalized] } }
        );
        updated++;
      }
    }

    res.status(200).json({ message: "Titles updated successfully", result: updated });
  } catch (error) {
    res.status(500).json({ message: "Error updating titles", error: error.message });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error("Error:", err);
  
  res.status(500).json({
    message: "Internal server error",
    error: err.message,
  });
});

export default app;
