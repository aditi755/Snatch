import mongoose from "mongoose";
const onboardingDataSchema = new mongoose.Schema(
  {
    userId: {
     type: String,
     required: true,
     //unique: true,
    },
    username: {
      type: String,
      required: true,
    },
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
    },
    gender: {
      type: String,
    },
    location: {
      type: String,
    },
    links: [
      {
        icon: { type: String },
        url: { type: String },
      },
    ],
    instagram: {
      type: String,
      required: true
    },
    profilePicture: {
      type: String,
    },
    backgroundPicture: {
      type: String,
    },
    profilePictureName: {
      type: String,
    },
    backgroundPictureName: {
      type: String,
    },
    industry: [
      {
        type: String,
      },
    ],
    contentType: [
      {
        type: String,
      },
    ],
    languages: [
      {
        type: String,
      },
    ],
    compensation: [
      {
        type: String,
      },
    ],
    post: {
      type: String,
    },
    story: {
      type: String,
    },
    reels: {
      type: String,
    },
    dateOfBirth: {
      type: String,
    },

    // Add other fields as needed
    isDraft: {
      type: Boolean,
      default: true
    },
    updatedAt: {
      type: Date,
      default: Date.now
    }
    
  },
  { timestamps: true }
);

const OnboardingData =  mongoose?.models?.OnboardingData || mongoose.model("OnboardingData", onboardingDataSchema);
// Debugging: Check if the model is correctly registered
console.log("Available models:", mongoose.models);
export default OnboardingData;
