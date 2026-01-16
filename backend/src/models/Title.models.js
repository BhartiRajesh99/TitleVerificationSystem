import mongoose from "mongoose";

const TitleSchema = new mongoose.Schema(
  {
    titleCode: {
      type: String,
      index: true,
    },
    titleName: {
      type: String,
      required: true,
      index: true,
    },
    hindiTitle: {
      type: String,
      index: true,
    },
    ownerName: {
      type: String,
      index: true,
    },
    state: {
      type: String,
      index: true,
    },
    periodity: {
      type: String,
      index: true,
    },
    publicationName: {
      type: String,
      index: true,
    },
    verified: {
      type: Boolean,
      
      index: true,
    },
    normalized: {
      type: String,
      required: true,
      index: true,
    },
    soundex: {
      type: String,
      required: true,
      index: true,
    },
    metaphone: {
      type: String,
      required: true,
      index: true,
    },
    similarity: {
      type: Number,
      index: true,
    },
    verificationProbability: {
      type: Number,
      index: true,
    },
    message: {
      type: String,
      default: "",
      index: true,
    },
    suggestions: {
      type: [String],
      default: [],
    },
    embedded: {
      type: Boolean,
      default: false,
      index: true,
    },
    point_id: {
      type: String,
      defalut: "",
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      index: true,
    },
    stateCode: { type: String, index: true },
  },
  { timestamps: true }
);

// Compound indexes for better query performance
TitleSchema.index({ titleName: 1, state: 1 });
TitleSchema.index({ ownerName: 1, state: 1 });
TitleSchema.index({ verified: 1, similarity: 1 });
TitleSchema.index({ verificationProbability: 1, verified: 1 });

// Add a compound text index for full-text search
TitleSchema.index({
  titleName: "text",
  hindiTitle: "text",
  ownerName: "text",
  titleCode: "text",
  normalized: "text",
});

export default mongoose.model("Title", TitleSchema);
