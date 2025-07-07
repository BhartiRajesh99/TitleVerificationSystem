import express from "express";
import auth from "../middlewares/auth.middlewares.js";

const router = express.Router();

//import routes
import {
  searchTitle,
  addTitle,
  updateTitle,
  deleteTitle,
  getAllTitles,
} from "../controllers/title.controllers.js";

// Search Titles
router.route("/search").get(auth, searchTitle);

// Add Title (with all checks)
router.route("/").post(auth, addTitle);

// Update Title
router.route("/:id").put(auth, updateTitle);

// Delete Title
router.route("/:id").delete(auth, deleteTitle);

//get all titles
router.route("/all").get(auth, getAllTitles);

export default router;
