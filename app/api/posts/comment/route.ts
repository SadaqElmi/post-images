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

    // 1) Fetch the post
    const post = await Post.findById(postId);
    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    // 2) Add comment
    post.comments.push({
      userId: session.user.id,
      text,
      createdAt: new Date(),
    });

    await post.save();

    // 3) Re-fetch the updated post WITH POPULATED comments
    const updatedPost = await Post.findById(postId)
      .populate("authorId", "name avatar")
      .populate("comments.userId", "name avatar"); // Ensure user data is fetched

    return NextResponse.json(updatedPost);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to add comment" },
      { status: 500 }
    );
  }
}
