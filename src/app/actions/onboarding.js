

"use server";
import connectDb from "@/db/mongoose";
import OnboardingData from "@/models/onboarding.model";
import User from "@/models/user.model";

export async function handler({ userId, formData }) {
  try {
    await connectDb();

    if (!userId) {
      return {
        success: false,
        message: "userId is required",
        status: 400,
      };
    }

    // Safely extract and transform the form data
    const { isDraft, _id, __v, createdAt, updatedAt, ...cleanFormData } = formData;
    
    // Check if onboarding data exists
    const existingOnboarding = await OnboardingData.findOne({ userId });
    let onboardingData;

    if (existingOnboarding) {
      // Update existing record
      onboardingData = await OnboardingData.findOneAndUpdate(
        { userId },
        {
          ...cleanFormData,
          isDraft: false
        },
        { 
          new: true,
          runValidators: true
        }
      );
    } else {
      // Create new record
      onboardingData = await OnboardingData.create({
        ...cleanFormData,
        userId,
        isDraft: false
      });
    }

    // Convert MongoDB document to plain object and handle _id
    onboardingData = onboardingData.toObject();
    onboardingData._id = onboardingData._id.toString();

    // Handle user creation/update
    let user = await User.findOne({ userId });
    if (!user) {
      user = await User.create({
        userId,
        instagramUsername: onboardingData.username,
        onboardingData: onboardingData._id
      });
    } else {
      user.onboardingData = onboardingData._id;
      user.instagramUsername = onboardingData.username;
      await user.save();
    }

    // Convert user to plain object and handle IDs
    user = user.toObject();
    user._id = user._id.toString();
    user.onboardingData = user.onboardingData.toString();

    return {
      success: true,
      message: "Success",
      data: { onboardingData, user },
      status: 201
    };

  } catch (error) {
    console.error("Error in server action:", error);
    return {
      success: false,
      message: error.message,
      status: 500
    };
  }
}