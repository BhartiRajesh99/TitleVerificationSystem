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

const searchTitle = async (req, res) => {
  const { q, state, verified, ownerName } = req.query;

  let query = {};

  if (q) {
    const normalized = normalizeTitle(q);
    const { soundex, metaphone } = getPhoneticCodes(q);

    query.$or = [
      { titleName: { $regex: q, $options: "i" } },
      { hindiTitle: { $regex: q, $options: "i" } },
      { ownerName: { $regex: q, $options: "i" } },
      { regnNo: { $regex: q, $options: "i" } },
      { normalized: { $regex: normalized, $options: "i" } },
      { soundex },
      { metaphone },
    ];
  }

  if (state) query.state = { $regex: state, $options: "i" };
  if (verified !== undefined) query.verified = verified === "true";
  if (ownerName) query.ownerName = { $regex: ownerName, $options: "i" };

  try {
    const titles = await Title.find(query).limit(20);

    // Calculate similarity if search query provided
    const results = titles.map((t) => ({
      id: t._id,
      titleCode: t.titleCode,
      titleName: t.titleName,
      hindiTitle: t.hindiTitle,
      registerSerialNo: t.registerSerialNo,
      regnNo: t.regnNo,
      ownerName: t.ownerName,
      state: t.state,
      publicationCity: t.publicationCity,
      periodity: t.periodity,
      verified: t.verified,
      similarity: t.similarity,
      verificationProbability: t.verificationProbability,
      createdAt: t.createdAt,
      updatedAt: t.updatedAt,
    }));

    res.json({ results });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error searching titles", error: error.message });
  }
};

const addTitle = async (req, res) => {
  const {
    titleCode,
    titleName,
    hindiTitle,
    registerSerialNo,
    regnNo,
    ownerName,
    state,
    stateCode,
    publicationCity,
    periodity,
  } = req.body;

  if (!titleName) {
    return res.status(400).json({ message: "Title name is required" });
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

  // Get ALL existing titles to calculate similarity
  const allExistingTitles = await Title.find();

  let maxSim = 0;
  let mostSimilarTitle = null;

  // Check similarity against ALL existing titles
  for (let t of allExistingTitles) {
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
  // Save new title with similarity and verificationProbability
  const isVerified = maxSim < 0.5;
  const newTitle = new Title({
    titleCode,
    titleName,
    hindiTitle,
    registerSerialNo,
    regnNo,
    ownerName,
    state,
    stateCode,
    publicationCity,
    periodity,
    verified: isVerified,
    normalized,
    soundex,
    metaphone,
    similarity: Math.round(maxSim * 100),
    verificationProbability: 100 - Math.round(maxSim * 100),
    createdBy: req.user.id,
  });
  await newTitle.save();
  await updateSimilarityForTitleAndRelated(newTitle._id);

  return res.json({
    message: "Title added successfully",
    title: {
      id: newTitle._id,
      titleCode: newTitle.titleCode,
      titleName: newTitle.titleName,
      hindiTitle: newTitle.hindiTitle,
      registerSerialNo: newTitle.registerSerialNo,
      regnNo: newTitle.regnNo,
      ownerName: newTitle.ownerName,
      state: newTitle.state,
      stateCode: newTitle.stateCode,
      publicationCity: newTitle.publicationCity,
      periodity: newTitle.periodity,
      verified: newTitle.verified,
      similarity: newTitle.similarity,
      verificationProbability: newTitle.verificationProbability,
    },
    similarity: Math.round(maxSim * 100),
    verificationProbability: 100 - Math.round(maxSim * 100),
    mostSimilarTo: mostSimilarTitle ? mostSimilarTitle.titleName : "None",
  });
};

const updateTitle = async (req, res) => {
  const {
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

    // Check if user owns this title
    if (existingTitle.createdBy.toString() !== req.user.id) {
      return res
        .status(403)
        .json({ message: "Not authorized to delete this title" });
    }

    await Title.findByIdAndDelete(req.params.id);
    const anyTitle = await Title.findOne();
    if (anyTitle) await updateSimilarityForTitleAndRelated(anyTitle._id);

    res.json({ message: "Title deleted and scores updated" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting title", error: error.message });
  }
};

const getTitleById = async (req, res) => {
  try {
    const title = await Title.findById(req.params.id);
    if (!title) {
      return res.status(404).json({ message: "Title not found" });
    }

    // Check if user owns this title
    if (title.createdBy.toString() !== req.user.id) {
      return res
        .status(403)
        .json({ message: "Not authorized to view this title" });
    }

    res.json({
      title: {
        id: title._id,
        titleCode: title.titleCode,
        titleName: title.titleName,
        hindiTitle: title.hindiTitle,
        registerSerialNo: title.registerSerialNo,
        regnNo: title.regnNo,
        ownerName: title.ownerName,
        state: title.state,
        publicationCity: title.publicationCity,
        periodity: title.periodity,
        verified: title.verified,
        similarity: title.similarity,
        verificationProbability: title.verificationProbability,
        createdAt: title.createdAt,
        updatedAt: title.updatedAt,
      },
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching title", error: error.message });
  }
};

const getAllTitles = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      sortBy = "createdAt",
      sortOrder = "desc",
      verified,
      state,
    } = req.query;

    let query = { createdBy: req.user.id };

    if (verified !== undefined) query.verified = verified === "true";
    if (state) query.state = { $regex: state, $options: "i" };

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
      registerSerialNo: t.registerSerialNo,
      regnNo: t.regnNo,
      ownerName: t.ownerName,
      state: t.state,
      publicationCity: t.publicationCity,
      periodity: t.periodity,
      verified: t.verified,
      similarity: t.similarity,
      verificationProbability: t.verificationProbability,
      createdAt: t.createdAt,
      updatedAt: t.updatedAt,
    }));

    res.json({
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
  const thisTitle = await Title.findById(titleId);
  if (!thisTitle) return;
  // Find the most similar other title
  const others = await Title.find({ _id: { $ne: titleId } });
  let maxSim = 0;
  let mostSimilar = null;
  for (let t of others) {
    const sim = similarityScore(thisTitle.normalized, t.normalized);
    if (sim > maxSim) {
      maxSim = sim;
      mostSimilar = t;
    }
  }
  thisTitle.similarity = Math.round(maxSim * 100);
  thisTitle.verificationProbability = 100 - Math.round(maxSim * 100);
  await thisTitle.save();
  // Also update the most similar title (since its closest match may have changed)
  if (mostSimilar) {
    let maxOtherSim = 0;
    for (let t of others) {
      if (t._id.toString() === mostSimilar._id.toString()) continue;
      const sim = similarityScore(mostSimilar.normalized, t.normalized);
      if (sim > maxOtherSim) maxOtherSim = sim;
    }
    mostSimilar.similarity = Math.round(maxOtherSim * 100);
    mostSimilar.verificationProbability = 100 - Math.round(maxOtherSim * 100);
    await mostSimilar.save();
  }
};

export {
  searchTitle,
  addTitle,
  updateTitle,
  deleteTitle,
  getAllTitles,
  getTitleById,
};
