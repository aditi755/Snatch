

"use server";
import connectDb from "@/db/mongoose";
import OnboardingData from "@/models/onboarding.model";
import User from "@/models/user.model";

// Server action handler for final storage
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

    // Remove isDraft from formData to avoid overriding
    const { isDraft, ...restFormData } = formData;
    console.log("Form data after removing isDraft:", restFormData);

    // Check if onboarding data already exists (draft or final)
    const existingOnboarding = await OnboardingData.findOne({ userId });

    let onboardingData;

    if (existingOnboarding) {
      console.log("Existing onboarding data found:", existingOnboarding);

      // If a draft exists, update it to mark it as final
      const updatedData = {
        ...restFormData, // Use restFormData (without isDraft)
        isDraft: false, // Explicitly set isDraft to false for final storage
      };

      console.log("Updated data before save:", updatedData);

      onboardingData = await OnboardingData.findOneAndUpdate(
        { userId }, // Query
        updatedData, // Update
        { new: true } // Return the updated document
      );

      console.log("Onboarding data saved as final:", onboardingData);
    } else {
      // If no draft exists, create a new record as final
      console.log("Form data before creation:", restFormData);

      onboardingData = await OnboardingData.create({
        ...restFormData, // Spread restFormData (without isDraft)
        userId,
        isDraft: false, // Explicitly set isDraft to false for final storage
      });

      console.log("New onboarding data created as final:", onboardingData);
    }

    // Ensure _id is a string
    if (onboardingData._id && typeof onboardingData._id !== "string") {
      onboardingData._id = onboardingData._id.toString();
    }

    console.log("Onboarding Data saved:", onboardingData);

    // Check if a User exists
    let user = await User.findOne({ userId });

    if (!user) {
      // Create a new User if none exists
      user = await User.create({
        userId,
        instagramUsername: onboardingData.username,
        onboardingData: onboardingData._id, // Link to OnboardingData
      });
    } else {
      // Link OnboardingData to existing User
      user.onboardingData = onboardingData._id;
      await user.save();
    }
    user = user.toObject(); // Convert to plain object

    // Ensure _id is a string
    if (user._id && typeof user._id !== "string") {
      user._id = user._id.toString();
    }

    // Ensure onboardingData._id is a string in the user object
    if (user.onboardingData && typeof user.onboardingData !== "string") {
      user.onboardingData = user.onboardingData.toString();
    }

    console.log("User data saved:", user);

    // Return success response with plain objects
    const response = {
      success: true,
      message: "Success",
      data: { onboardingData, user },
      status: 201,
    };

    console.log("Final response:", JSON.stringify(response, null, 2)); // Log the final response

    return response;
  } catch (error) {
    // Return error response
    console.error("Error in server action:", error);
    return {
      success: false,
      message: error.message,
      status: 500,
    };
  }
}