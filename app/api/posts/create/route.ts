import Post from "@/app/models/Post";
import { connectDB } from "@/lib/mongodb";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { title, description, imageUrl, authorId } = await req.json();

    await connectDB();

    const post = await Post.create({ title, description, imageUrl, authorId });

    return NextResponse.json(post, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to create post" },
      { status: 500 }
    );
  }
}
