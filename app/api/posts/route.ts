import { NextResponse } from "next/server";
import Post from "@/app/models/Post";
import { connectDB } from "@/lib/mongodb";

export async function GET() {
  try {
    await connectDB();

    const posts = await Post.find()
      .populate("authorId", "name avatar") // 🟢 Populate authorId with name and avatar
      .sort({ createdAt: -1 });

    return NextResponse.json(posts);
  } catch (error) {
    console.error("Failed to fetch posts", error);
    return NextResponse.json(
      { error: "Failed to fetch posts" },
      { status: 500 }
    );
  }
}
