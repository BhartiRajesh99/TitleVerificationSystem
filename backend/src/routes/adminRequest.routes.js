import express from "express";
import { adminOnly } from "../middlewares/admin.middleware.js";
import { getAllRequests, updateRequestStatus } from "../controllers/adminRequest.controllers.js";

const router = express.Router();

router.use(adminOnly)
router.get("/", getAllRequests);

router.patch("/:id", updateRequestStatus);

export default router;
