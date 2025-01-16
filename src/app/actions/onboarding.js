"use server"
import connectDb from "@/db/mongoose";
import OnboardingData from "@/models/onboarding.model";
import User from "@/models/user.model";
import mongoose from "mongoose";

// Server action handler
export async function handler({ userId, formData }) {
  try {
   // Connect to the database
   console.log("Server Action - Testing from", userId, formData);
    await connectDb();

    console.log("Server Action - User ID:", userId, formData);

    // Validate userId
    if (!userId) {
      return {
        success: false,
        message: "userId is required",
        status: 400,
      };
    }

    // Check if onboarding data already exists
    const existingOnboarding = await OnboardingData.findOne({ userId });
    if (existingOnboarding) {
      return {
        success: true,
        message: "Onboarding data already exists",
        status: 400,
      };
    }

    // Create OnboardingData
    const onboardingData = await OnboardingData.create({
      userId,
      ...formData,
    });

    console.log("New Onboarding Data created:", onboardingData);

    //Check if a User exists
    let user = await User.findOne({ userId });

    if (!user) {
      // Create a new User if none exists
      user = await User.create({
        userId,
        instagramUsername: onboardingData.username,
        onboardingData: onboardingData._id,  //this linemight cause call stack size max rangeneerrpr
      });
    } else {
      // Link OnboardingData to existing User
      user.onboardingData = onboardingData._id;
      await user.save();
    }

    // Return success response
    return {
      success: true,
      message: "Success",
      data: { onboardingData, user },
      status: 201,
    };
  } catch (error) {
    // Return error response
    return {
      success: false,
      message: error.message,
      status: 500,
    };
  }
}


//edit route for onboardingdata , user is tehre just update it 