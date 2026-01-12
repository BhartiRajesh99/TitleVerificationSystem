import express from "express";
import auth from "../middlewares/auth.middlewares.js";
import { adminOnly } from "../middlewares/admin.middleware.js";
const router = express.Router();

//import routes
import {
    getTodayRequestsCount, 
    getAdminDashboardStats, 
    getRejectionInsights, 
    getProbabilityBreakdown, 
    getTopStatesBySubmissions, 
    getRecentSubmissions,
} from "../controllers/admin.controllers.js";
import { deleteTitle } from "../controllers/title.controllers.js";

router.use(auth);
router.use(adminOnly);

// Today's requests count
router.route("/today-requests").get(getTodayRequestsCount);

// Admin dashboard stats
router.route("/stats").get(getAdminDashboardStats);

// Rejection insights
router.route("/rejection-insights").get(getRejectionInsights);

// Probability breakdown
router.route("/probability-breakdown").get(getProbabilityBreakdown);

// Top states by submissions
router.route("/top-states").get(getTopStatesBySubmissions);

// Recent submissions
router.route("/recent-submissions").get(getRecentSubmissions);

// Delete title by admin
router.route("/delete-title/:id").delete(deleteTitle);

export default router