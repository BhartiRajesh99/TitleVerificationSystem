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
    registerSerialNo: {
      type: String,
      index: true,
    },
    regnNo: {
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
    publicationCity: {
      type: String,
      index: true,
    },
    periodity: {
      type: String,
      index: true,
    },
    verified: {
      type: Boolean,
      required: true,
      default: false,
      index: true,
    },
    // Verification fields
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
      default: 0,
      index: true,
    },
    verificationProbability: {
      type: Number,
      default: 100,
      index: true,
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
TitleSchema.index({ regnNo: 1, state: 1 });
TitleSchema.index({ ownerName: 1, state: 1 });
TitleSchema.index({ verified: 1, similarity: 1 });
TitleSchema.index({ verificationProbability: 1, verified: 1 });

export default mongoose.model("Title", TitleSchema);
