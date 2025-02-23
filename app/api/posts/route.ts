import { NextResponse, NextRequest } from "next/server";
import Post from "@/app/models/Post";
import { connectDB } from "@/lib/mongodb";

export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const posts = await Post.find()
      .populate("authorId", "name avatar")
      .populate("comments.userId", "name avatar")
      .sort({ createdAt: -1 });

    return NextResponse.json(posts);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to fetch posts" },
      { status: 500 }
    );
  }
}
