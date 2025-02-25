import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/config/auth";
import Post from "@/app/models/Post";
import { connectDB } from "@/lib/mongodb";

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { postId } = await req.json();

    if (!postId) {
      return NextResponse.json(
        { error: "Post ID is required" },
        { status: 400 }
      );
    }

    // 1) Find the post
    const post = await Post.findById(postId);
    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    // 2) Toggle like
    const userId = session.user.id;
    const isLiked = post.likes.includes(userId);
    if (isLiked) {
      post.likes = post.likes.filter((id: string) => id.toString() !== userId);
    } else {
      post.likes.push(userId);
    }

    // 3) Save the post
    await post.save();

    // 4) Re-fetch and populate after saving
    const updatedPost = await Post.findById(postId)
      .populate("authorId", "name avatar")
      .populate("comments.userId", "name avatar");

    return NextResponse.json(updatedPost);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to toggle like" },
      { status: 500 }
    );
  }
}
