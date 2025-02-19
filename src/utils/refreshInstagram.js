import cron from "node-cron";
import axios from "axios";
import dbConnect from "@/db/mongoose";
import ProjectDraft from "@/models/project.model";
import User from "@/models/user.model";

// Schedule the cron job (Runs every 5 minutes)
cron.schedule("*/5 * * * *", async () => {
  console.log("Running cron job: Refreshing Instagram media URLs...");

  try {
    await dbConnect();

    const drafts = await ProjectDraft.aggregate([
      {
        $match: { instagramSelected: { $exists: true, $ne: [] } },
      },
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "userId",
          as: "userData",
        },
      },
      {
        $unwind: "$userData",
      },
      {
        $match: { "userData.instagramAccessToken": { $exists: true, $ne: null } },
      },
    ]);

    if (drafts.length === 0) {
      console.log("No drafts found with valid Instagram access.");
      return;
    }

    for (const draft of drafts) {
      const user = draft.userData;
      const accessToken = user.instagramAccessToken;

      for (let i = 0; i < draft.instagramSelected.length; i++) {
        const instaItem = draft.instagramSelected[i];
        const mediaId = instaItem.mediaId;

        const apiUrl = `https://graph.instagram.com/${mediaId}?fields=media_url&access_token=${accessToken}`;

        try {
          const response = await axios.get(apiUrl);
          instaItem.mediaLink = response.data.media_url;
        } catch (err) {
          console.error(`Failed to update media for mediaId ${mediaId}:`, err.message);
        }
      }

      await ProjectDraft.updateOne(
        { _id: draft._id },
        { $set: { instagramSelected: draft.instagramSelected } }
      );
    }

    console.log("✅ Instagram media URLs refreshed successfully.");
  } catch (error) {
    console.error("❌ Error refreshing Instagram media URLs:", error);
  }
});
