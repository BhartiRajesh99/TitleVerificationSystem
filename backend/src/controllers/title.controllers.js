import mongoose from "mongoose";
import Title from "../models/Title.models.js";
import {
  normalizeTitle,
  hasDisallowedPrefix,
  hasDisallowedSuffix,
  containsDisallowedWord,
  containsPeriodicity,
  getPhoneticCodes,
  similarityScore,
} from "../utils/similarity.js";

const addTitle = async (req, res) => {
  const {
    titleCode,
    titleName,
    hindiTitle,
    publicationName,
    periodity,
    ownerName,
    state,
  } = req.body;

    // Basic validation
    if (!titleName?.trim()) {
      return res.status(400).json({ message: "Title name is required" });
    }

    // Business rule validation
    if (hasDisallowedPrefix(titleName))
      return res.status(400).json({ message: "Disallowed prefix" });

    if (hasDisallowedSuffix(titleName))
      return res.status(400).json({ message: "Disallowed suffix" });

    if (containsDisallowedWord(titleName))
      return res.status(400).json({ message: "Contains disallowed word" });

    if (containsPeriodicity(titleName))
      return res.status(400).json({ message: "Contains disallowed periodicity" });

    // Preprocessing
    const normalized = normalizeTitle(titleName);
    const { soundex, metaphone } = getPhoneticCodes(titleName);

  // Save minimal title (NO similarity here)
  const newTitle = await Title.create({
    titleCode,
    titleName,
    hindiTitle,
    ownerName,
    state,
    periodity,
    publicationName,
    normalized,
    soundex,
    metaphone,
    createdBy: req.user.id,

    // temporary values
    verified: false,
    similarity: 0,
    verificationProbability: 0,
  });

  const updatedTitle = await updateSimilarityForTitleAndRelated(newTitle._id);

  console.log(updatedTitle)

  return res.status(200).json({
    title: {
      id: updatedTitle._id,
      titleCode: updatedTitle.titleCode,
       message: updatedTitle.verified         //TODO: use AI generated message
        ? "Title verified successfully"
        : "Title rejected due to similarity",
      titleName: updatedTitle.titleName,
      hindiTitle: updatedTitle.hindiTitle,
      ownerName: updatedTitle.ownerName,
      state: updatedTitle.state,
      publicationName: updatedTitle.publicationName,
      periodity: updatedTitle.periodity,
      verified: updatedTitle.verified,
      similarity: updatedTitle.similarity,
      verificationProbability: updatedTitle.verificationProbability,
    },
  });
};

const updateTitle = async (req, res) => {
  const {
    titleCode,
    titleName,
    hindiTitle,
    ownerName,
    state,
    periodity,
    verified,
  } = req.body;

  if (!titleName) {
    return res.status(400).json({ message: "Title name is required" });
  }

  // Check if title exists
  const existingTitle = await Title.findById(req.params.id);
  if (!existingTitle) {
    return res.status(404).json({ message: "Title not found" });
  }

  // Check if user owns this title
  if (existingTitle.createdBy.toString() !== req.user.id) {
    return res
      .status(403)
      .json({ message: "Not authorized to update this title" });
  }

  const normalized = normalizeTitle(titleName);

  // Disallowed checks
  if (hasDisallowedPrefix(titleName))
    return res.status(400).json({ message: "Disallowed prefix" });
  if (hasDisallowedSuffix(titleName))
    return res.status(400).json({ message: "Disallowed suffix" });
  if (containsDisallowedWord(titleName))
    return res.status(400).json({ message: "Contains disallowed word" });
  if (containsPeriodicity(titleName))
    return res.status(400).json({ message: "Contains disallowed periodicity" });

  const { soundex, metaphone } = getPhoneticCodes(titleName);

  // Check similarity against other titles (excluding current title)
  const otherTitles = await Title.find({ _id: { $ne: req.params.id } });
  let maxSim = 0;
  let mostSimilarTitle = null;

  for (let t of otherTitles) {
    const sim = similarityScore(normalized, t.normalized);
    if (sim > maxSim) {
      maxSim = sim;
      mostSimilarTitle = t;
    }
    // Reject if too similar (above 50% threshold)
    if (sim > 0.5) {
      return res.status(400).json({
        message: `Title too similar to existing: ${t.titleName}`,
        similarity: Math.round(sim * 100),
        verificationProbability: 100 - Math.round(sim * 100),
        mostSimilarTo: t.titleName,
      });
    }
  }

  // Update title
  const updatedTitle = await Title.findByIdAndUpdate(
    req.params.id,
    {
      titleCode,
      titleName,
      hindiTitle,
      registerSerialNo,
      regnNo,
      ownerName,
      state,
      publicationCity,
      periodity,
      verified,
      normalized,
      soundex,
      metaphone,
      similarity: Math.round(maxSim * 100),
      verificationProbability: 100 - Math.round(maxSim * 100),
    },
    { new: true }
  );
  await updateSimilarityForTitleAndRelated(updatedTitle._id);

  res.json({
    message: "Title updated successfully",
    title: {
      id: updatedTitle._id,
      titleCode: updatedTitle.titleCode,
      titleName: updatedTitle.titleName,
      hindiTitle: updatedTitle.hindiTitle,
      registerSerialNo: updatedTitle.registerSerialNo,
      regnNo: updatedTitle.regnNo,
      ownerName: updatedTitle.ownerName,
      state: updatedTitle.state,
      publicationCity: updatedTitle.publicationCity,
      periodity: updatedTitle.periodity,
      verified: updatedTitle.verified,
      similarity: updatedTitle.similarity,
      verificationProbability: updatedTitle.verificationProbability,
    },
    similarity: Math.round(maxSim * 100),
    verificationProbability: 100 - Math.round(maxSim * 100),
    mostSimilarTo: mostSimilarTitle ? mostSimilarTitle.titleName : "None",
  });
};

const deleteTitle = async (req, res) => {
  try {
    // Check if title exists
    const existingTitle = await Title.findById(req.params.id);
    if (!existingTitle) {
      return res.status(404).json({ message: "Title not found" });
    }

    const isOwner = existingTitle.createdBy.toString() === req.user.id;

    const isAdmin = req.user.role === "admin";

    if (!isOwner && !isAdmin) {
      return res.status(403).json({
        message: "You are not authorized to delete this title",
      });
    }

    await Title.findByIdAndDelete(req.params.id);
    const anyTitle = await Title.findOne();
    if (anyTitle) {
      await updateSimilarityForTitleAndRelated(anyTitle._id);
    }

    res.json({ message: "Title deleted and scores updated" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting title", error: error.message });
  }
};

const getTitleByFilter = async (req, res) => {
  try {
    let { titleCode, state, status } = req.query;

    titleCode = titleCode?.trim() || "";
    state = state?.trim() || "";
    status = status?.trim().toUpperCase() || "";

    if (state === "All States") state = "";
    if (status === "All Status") status = "";

    const matchStage = {
      createdBy: new mongoose.Types.ObjectId(req.user.id)
    };

    if (titleCode) {
      matchStage.titleCode = titleCode
    }

    // state filter
    if (state) {
      matchStage.state = state;
    }

    // status filter
    if (status === "ACCEPTED") {
      matchStage.verified = true;
    } else if (status === "REJECTED") {
      matchStage.verified = false;
    }
    console.log("Aggregation Pipeline: ", matchStage);

    const pipeline = [
      {$match: matchStage},
      { $sort: { createdAt: -1 } },
    ];

    const titles = await Title.aggregate(pipeline);

    if (!titles || titles.length === 0) {
      return res.status(200).json({ results: [], message: "Title not found" });
    }

    console.log("Fetched Titles: ", titles);

    // Check if user owns this title
    for (const title of titles) {
      if (title.createdBy.toString() !== req.user.id) {
        return res
          .status(400)
          .json({ message: "Not authorized to view this title" });
      }
    }

    const results = titles.map((t) => ({...t, id: t._id}));

    res.status(200).json({
      results: results,
    });

  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching title", error: error.message });
  }
};

//TODO: Pagination in frontend
const getAllTitles = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      sortBy = "createdAt",
      sortOrder = "desc",
    } = req.query;

    let query = { createdBy: req.user.id };

    const skip = (page - 1) * limit;
    const sort = { [sortBy]: sortOrder === "desc" ? -1 : 1 };

    const titles = await Title.find(query)
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Title.countDocuments(query);

    const results = titles.map((t) => ({
      id: t._id,
      titleCode: t.titleCode,
      titleName: t.titleName,
      hindiTitle: t.hindiTitle,
      ownerName: t.ownerName,
      state: t.state,
      periodity: t.periodity,
      verified: t.verified,
      similarity: t.similarity,
      verificationProbability: t.verificationProbability,
      createdAt: t.createdAt,
      updatedAt: t.updatedAt,
    }));

    res.status(200).json({
      results,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        totalItems: total,
        itemsPerPage: parseInt(limit),
      },
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching titles", error: error.message });
  }
};

// Helper: Find and update similarity for a single title and its closest match
const updateSimilarityForTitleAndRelated = async (titleId) => {
  const newTitle = await Title.findById(titleId);
  if (!newTitle) return null;

  const others = await Title.find({ _id: { $ne: titleId } });

  let maxSim = 0;
  const bulkUpdates = [];

  for (const other of others) {
    const sim = Math.round(
      similarityScore(newTitle.normalized, other.normalized) * 100
    );

    if (sim > maxSim) maxSim = sim;

    if (sim > (other.similarity || 0)) {
      bulkUpdates.push({
        updateOne: {
          filter: { _id: other._id },
          update: {
            similarity: sim,
            verificationProbability: 100 - sim,
          },
        },
      });
    }
  }

  newTitle.similarity = maxSim;
  newTitle.verificationProbability = 100 - maxSim;
  newTitle.verified = maxSim <= 40;

  await newTitle.save();

  if (bulkUpdates.length) {
    await Title.bulkWrite(bulkUpdates);
  }

  return newTitle; // IMPORTANT
};

export {
  addTitle,
  updateTitle,
  deleteTitle,
  getAllTitles,
  getTitleByFilter,
};
