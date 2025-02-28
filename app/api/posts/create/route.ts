import { NextResponse, NextRequest } from "next/server";
import Post from "@/app/models/Post";
import { connectDB } from "@/lib/mongodb";
import { getServerSession } from "next-auth";
import { authOptions } from "@/config/auth";

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { description, imageUrl, mediaType } = await req.json();
    console.log("Creating post with:", { description, imageUrl, mediaType });

    const newPost = new Post({
      authorId: session.user.id,
      description,
      imageUrl,
      mediaType,
    });

    await newPost.save();

    return NextResponse.json(newPost, { status: 201 });
  } catch (error) {
    console.error("Post creation error:", error);
    return NextResponse.json(
      { error: "Failed to create post" },
      { status: 500 }
    );
  }
}
