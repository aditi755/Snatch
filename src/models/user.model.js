import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
      unique: true, // Ensures no duplicate entries for Clerk's userId
    },
    instagramAccessToken: {
      type: String,
      required: false,
    },
    instagramAccountId: {
      type: String,
      required: false,
    },
    instagramUsername: {
      type: String,
      required: true, // Required because it is the user's primary Instagram username
    },
    onboardingData: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "OnboardingData", // Links to the OnboardingData schema
      required: false, // Allows flexibility to add this field later
    },
  },
  { timestamps: true }
);

const User =  mongoose?.models?.User || mongoose.model("User", userSchema);
export default User;

