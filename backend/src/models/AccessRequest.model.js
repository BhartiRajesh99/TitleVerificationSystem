import mongoose from "mongoose";

const accessRequestSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      lowercase: true,
    },

    organization: {
      type: String,
      required: true,
    },

    message: {
      type: String,
      required: true,
      maxlength: 500,
    },

    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
     
    },
  },
  { timestamps: true }
);

export default mongoose.model("AccessRequest", accessRequestSchema);
