import express from "express";
import auth from "../middlewares/auth.middlewares.js";
import { getMyRequests, submitRequest } from "../controllers/userRequest.controllers.js";
const router = express.Router();

router.use(auth)

router.post("/", submitRequest);

router.get("/my-requests", getMyRequests);

export default router;
