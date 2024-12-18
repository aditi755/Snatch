import { NextResponse } from "next/server";
import { clerkClient } from "@clerk/nextjs/server";

export async function DELETE(req) {
  try {
    const body = await req.json(); // Parse the JSON body
    const { userId } = body;

    if (!userId) {
      return NextResponse.json(
        { message: "User ID is required" },
        { status: 400 }
      );
    }

    // Delete the user using Clerk's API
    await clerkClient.users.deleteUser(userId);

    return NextResponse.json(
      { message: "User deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting user:", error);
    return NextResponse.json(
      { message: "Failed to delete user" },
      { status: 500 }
    );
  }
}
