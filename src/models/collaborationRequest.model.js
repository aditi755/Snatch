// /models/collaborationRequest.model.ts

import mongoose from "mongoose";

const CollaborationRequestSchema = new mongoose.Schema(
  {
    brandName: { type: String, required: true },
    email: { type: String, required: true },  // Brand's email (used to prevent duplicate requests)
    role: { type: String, required: true },
    bio: { type: String },
    discussion: { type: String },

    influencerUsername: { type: String, required: true },
    influencerUserId: { type: String, required: true }, // Clerk userId

    // Optional: can be used for future status handling
    //status: { type: String, enum: ["pending", "approved", "rejected"], default: "pending" },
  },
  { timestamps: true }
);

// Unique combination of brand email + influencer userId
CollaborationRequestSchema.index({ email: 1, influencerUserId: 1 }, { unique: true });

export default mongoose.models.CollaborationRequest ||
  mongoose.model("CollaborationRequest", CollaborationRequestSchema);
