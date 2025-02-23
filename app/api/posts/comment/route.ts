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

    // Fetch the post
    const post = await Post.findById(postId);
    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    // Add the new comment
    post.comments.push({
      userId: session.user.id,
      text,
      createdAt: new Date(),
    });

    await post.save();

    // Re-fetch the updated post with populated data
    const updatedPost = await Post.findById(postId)
      .populate("authorId", "name avatar")
      .populate("comments.userId", "name avatar");

    return NextResponse.json(updatedPost);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to add comment" },
      { status: 500 }
    );
  }
}
export async function PUT(req: NextRequest) {
  try {
    await connectDB();
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { postId, commentId, newText } = await req.json();
    console.log("Received Data:", { postId, commentId, newText }); // Debugging

    if (!postId || !commentId || !newText.trim()) {
      return NextResponse.json(
        { error: "Post ID, Comment ID, and new text are required" },
        { status: 400 }
      );
    }

    const post = await Post.findById(postId);
    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    const comment = post.comments.id(commentId); // Use Mongoose subdocument lookup
    if (!comment) {
      return NextResponse.json({ error: "Comment not found" }, { status: 404 });
    }

    if (comment.userId.toString() !== session.user.id) {
      return NextResponse.json(
        { error: "Unauthorized to edit this comment" },
        { status: 403 }
      );
    }

    comment.text = newText;
    await post.save();

    return NextResponse.json({
      message: "Comment updated",
      updatedComment: comment,
    });
  } catch (error) {
    console.error("Error updating comment:", error);
    return NextResponse.json(
      { error: "Failed to update comment" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    await connectDB();
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { postId, commentId } = await req.json();
    console.log("Received Data:", { postId, commentId }); // Debugging

    if (
      !postId ||
      !commentId ||
      typeof commentId !== "string" ||
      commentId.trim() === ""
    ) {
      return NextResponse.json(
        { error: "Post ID and Comment ID are required" },
        { status: 400 }
      );
    }

    const post = await Post.findById(postId);
    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    const commentIndex = post.comments.findIndex(
      (c: { _id: string; userId: string }) =>
        c._id.toString() === commentId &&
        c.userId.toString() === session.user.id
    );

    if (commentIndex === -1) {
      return NextResponse.json(
        { error: "Comment not found or unauthorized" },
        { status: 403 }
      );
    }

    post.comments.splice(commentIndex, 1);
    await post.save();

    return NextResponse.json({ message: "Comment deleted successfully" });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to delete comment" },
      { status: 500 }
    );
  }
}
