import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import Post from "@/app/models/Post";
import { connectDB } from "@/lib/mongodb";

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { postId, text } = await req.json();

    if (!postId || !text.trim()) {
      return NextResponse.json(
        { error: "Post ID and text are required" },
        { status: 400 }
      );
    }

    // 1) Fetch and populate
    const post = await Post.findById(postId)
      .populate("authorId", "name avatar")
      .populate("comments.userId", "name avatar");

    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    // 2) Add the new comment
    post.comments.push({
      userId: session.user.id,
      text,
      createdAt: new Date(),
    });

    // 3) Save
    await post.save();

    // 4) Re-fetch the updated post to ensure the new comment is populated
    const updatedPost = await Post.findById(postId)
      .populate("authorId", "name avatar")
      .populate("comments.userId", "name avatar");

    // 5) Return fully populated post
    return NextResponse.json(updatedPost);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to add comment" },
      { status: 500 }
    );
  }
}
