import { NextResponse, NextRequest } from "next/server";
import Post from "@/app/models/Post";
import { connectDB } from "@/lib/mongodb";
import mongoose from "mongoose";

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    // Get query parameters from request URL
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    // Build query object
    let query = {};
    if (userId) {
      // Validate and convert to ObjectId
      if (!mongoose.Types.ObjectId.isValid(userId)) {
        return NextResponse.json(
          { error: "Invalid user ID format" },
          { status: 400 }
        );
      }
      query = { authorId: new mongoose.Types.ObjectId(userId) };
    }

    // Fetch posts with optional filtering
    const posts = await Post.find(query)
      .populate("authorId", "name avatar")
      .populate("comments.userId", "name avatar")
      .lean()
      .sort({ createdAt: -1 });

    return NextResponse.json(posts);
  } catch (error) {
    console.error("Error fetching posts:", error);
    return NextResponse.json(
      { error: "Failed to fetch posts" },
      { status: 500 }
    );
  }
}
