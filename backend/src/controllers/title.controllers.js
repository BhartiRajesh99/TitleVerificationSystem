import mongoose from "mongoose";
import Title from "../models/Title.models.js";
import {
  normalizeTitle,
  hasDisallowedPrefix,
  hasDisallowedSuffix,
  containsDisallowedWord,
  containsPeriodicity,
} from "../utils/similarity.js";

import { OpenAIEmbeddings } from "@langchain/openai";
import { QdrantVectorStore } from "@langchain/qdrant";
import {Document} from "@langchain/core/documents";
import { UUID } from "mongodb";

import "dotenv/config"
import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
})

const addTitle = async (req, res) => {
  try {
    const {
      titleCode,
      titleName,
      hindiTitle,
      publicationName,
      periodity,
      ownerName,
      state,
    } = req.body;
  
    const normalized = normalizeTitle(titleName);
  
    // Basic validation
    if (!normalized) {
      return res.status(400).json({ message: "Title name is required" });
    }
  
    // Business rule validation
    if (hasDisallowedPrefix(normalized))
      return res.status(400).json({ message: "Disallowed prefix" });
  
    if (hasDisallowedSuffix(normalized))
      return res.status(400).json({ message: "Disallowed suffix" });
  
    if (containsDisallowedWord(normalized))
      return res.status(400).json({ message: "Contains disallowed word" });
  
    if (containsPeriodicity(normalized))
      return res.status(400).json({ message: "Contains disallowed periodicity" });
  
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
      createdBy: req.user.id,
      embedded: false
    });
  
    console.log("New Title Created: ", newTitle);
  
    // AI generated response setup
    const embeddings = new OpenAIEmbeddings({
      model: "text-embedding-3-large"
    });
    
    // AI similarity search
    const vectorStore = await QdrantVectorStore.fromExistingCollection(embeddings, {
      url: process.env.QDRANT_URL,
      collectionName: "titles",
    });
  
    const vectorSearcher = vectorStore.asRetriever({
      k: 10,
    })

    const relevantChunk = await vectorSearcher.invoke(newTitle.normalized);

    const fetchedSimilarTitles = relevantChunk.map((doc) => ({
      normalized: doc.pageContent,
      verified: doc.metadata.verified,
    }));
    
    console.log("Titles given to LLM: \n",fetchedSimilarTitles)

    const SYSTEM_PROMPT = `You are an automated Title Verification Agent for the Press Registrar General of India (PRGI).

    Your task is to decide whether a newly submitted title should be VERIFIED or REJECTED
    by strictly comparing it against PROVIDED CONTEXT titles provided to you.

    You MUST operate as a deterministic rule-based verifier.
    Personal judgment, subjective opinions, or assumptions are NOT allowed.

    You will receive structured input containing:
    - title_to_verify (string)
    
    You MUST use ONLY this provided data.
    You MUST NOT ask the user for additional information.

    1. Similarity Evaluation (PRIMARY)
    - You have to five Similarity scores range from 1 to 10:
      1–3  = Low similarity (distinct)
      4–5  = Moderate similarity
      6–10 = High similarity (confusing / duplicate)

    - Similarity must consider:
      a) Phonetic similarity
      b) Semantic similarity (meaning, intent, naming confusion)

    2. Decision Rules (NON-NEGOTIABLE)

    - If ANY similar title has similarity score > 4:
      → verified MUST be false
      → AcceptabilityScore MUST be < 4

    - If ALL similarity scores ≤ 4:
      → The title MUST be considered distinct
      → verified MUST be true
      → AcceptabilityScore MUST be ≥ 6

    - Low similarity AND low acceptability is INVALID.
    - High similarity AND verified=true is INVALID.

    3. Acceptability Score (1–10)
    - AcceptabilityScore represents likelihood of approval.
    - It MUST be mathematically consistent with similarity.
    - AcceptabilityScore = 10 − (maximum similarity score).

    4. Disallowed Logic (STRICT)
    Even if similarity is low, verified MUST be false if:
    - The title is a combination of two existing titles
    - The title is an existing title with added periodicity
    - The title is a translated or synonymous version of an existing title
    - The title violates naming guidelines implied by similarity data

    5. OUTPUT RULES (STRICT ENFORCEMENT)
    - Output MUST be valid JSON only
    - No extra text, no markdown
    - No explanations outside JSON
    - All numeric fields MUST follow the rules above

    6. OUTPUT FORMAT (EXACT)
    {
      "verified": true | false,
      "reason": "Explain your decision briefly based on similarity findings.",
      "similarTitlesConsidered": [
        {
          "titleName": "Existing title name",
          "score": 1–10 (for each similar title)
        }
      ],
      "suggestions": ["If rejected, suggest up to 3 alternative distinct titles."],
      "AcceptabilityScore": 1–10
    }

    PROVIDED CONTEXT FOR SIMILARITY CHECK:
    Title to verify: "${JSON.stringify(fetchedSimilarTitles, null, 2)}"
    `

    const response = await client.chat.completions.create({
      model: 'gpt-4.1-mini',
      messages: [
        {role: 'system', content: SYSTEM_PROMPT},
        {role: 'user', content: `Verify the title: "${newTitle.normalized}" strictly based on the provided context.`}
      ],
      
    })

    console.log(response.choices[0].message.content);

    const result = JSON.parse(response.choices[0].message.content);

    newTitle.verified = result.verified
    newTitle.verificationProbability = result.AcceptabilityScore * 10
    newTitle.similarity = 100 - newTitle.verificationProbability
    newTitle.message = result.reason
    newTitle.suggestions = result.suggestions || []

    const newDocument = [
      new Document({
        pageContent: newTitle.normalized,
        metadata: {
          id: newTitle._id.toString(),
          verified: newTitle.verified,
          titleCode: newTitle.titleCode,
          titleName: newTitle.titleName,
          verificationProbability: newTitle.verificationProbability,
          similarity: newTitle.similarity
        },
        id: new UUID().toString(),
      })
    ]

    console.log("New Document for embedd: \n",newDocument)

    if(newTitle.verified){
      await vectorStore.addDocuments(newDocument);
      newTitle.embedded = true;
      newTitle.point_id = newDocument[0].id;
      console.log("Document added to vectore store")
    }
    await newTitle.save();
  
    return res.status(200).json({
      title: {
        id: newTitle._id,
        titleCode: newTitle.titleCode,
        message: newTitle.message,
        titleName: newTitle.titleName,
        hindiTitle: newTitle.hindiTitle,
        ownerName: newTitle.ownerName,
        state: newTitle.state,
        publicationName: newTitle.publicationName,
        periodity: newTitle.periodity,
        verified: newTitle.verified,
        similarity: newTitle.similarity,
        verificationProbability: newTitle.verificationProbability,
        embedded: newTitle.embedded,
        suggestions: result?.suggestions,
        similarTitlesConsidered: result.similarTitlesConsidered,
        createdBy: newTitle.createdBy
      },
    });
  } catch (error) {
    console.error("Error in createTitle:", error);
    return res.status(500).json({ message: error.message || "Internal server error" });
  }
};

const deleteTitle = async (req, res) => {
  try {
    // Check if title exists
    const existingTitle = await Title.findById(req.params.id);
    if (!existingTitle) {
      return res.status(404).json({ message: "Title not found" });
    }
    console.log("Existing Title: ", existingTitle);
    const isOwner = existingTitle.createdBy.toString() === req.user.id;

    const isAdmin = req.user.role === "admin";

    if (!isOwner && !isAdmin) {
      return res.status(403).json({
        message: "You are not authorized to delete this title",
      });
    }

    await Title.findByIdAndDelete(req.params.id);
    console.log("Title deleted from DB");

    const embeddings = new OpenAIEmbeddings({
      model: "text-embedding-3-large"
    });
    const vectorStore = await QdrantVectorStore.fromExistingCollection(embeddings, {
      url: process.env.QDRANT_URL,
      collectionName: "titles",
    });

    if(existingTitle.embedded && !existingTitle?.point_id){
      await vectorStore.delete({
        ids: [existingTitle.point_id.toString()]
      });
    }
    console.log("Vector embeddings deleted")

    res.json({ message: "Title deleted successfully" });
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

export {
  addTitle,
  deleteTitle,
  getAllTitles,
  getTitleByFilter,
};
