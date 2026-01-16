import express from "express";
import { adminOnly } from "../middlewares/admin.middleware.js";
import { getAllRequests, getPendingRequestsCount, updateRequestStatus } from "../controllers/adminRequest.controllers.js";

const router = express.Router();

router.use(adminOnly)
router.get("/", getAllRequests);

router.patch("/:id", updateRequestStatus);

router.get("/pending/count", getPendingRequestsCount);

export default router;
