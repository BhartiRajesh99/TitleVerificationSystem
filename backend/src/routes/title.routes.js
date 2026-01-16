import express from "express";
import auth from "../middlewares/auth.middlewares.js";

const router = express.Router();

//import routes
import {
  getTitleByFilter,
  addTitle,
  deleteTitle,
  getAllTitles,
} from "../controllers/title.controllers.js";

router.use(auth);

// Search Titles
router.route("/search").get(getTitleByFilter);

// Add Title (with all checks)
router.route("/").post(addTitle);

// Delete Title
router.route("/:id").delete(deleteTitle);

//get all titles
router.route("/all").get(getAllTitles);

export default router;
