// app/api/users/uploadCover/route.ts
import { connectDB } from "@/lib/mongodb";
import User from "@/app/models/User";
import { v2 as cloudinary } from "cloudinary";
import { getServerSession } from "next-auth";
import { authOptions } from "@/config/auth";
import { NextResponse } from "next/server";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(request: Request) {
  await connectDB();

  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const formData = await request.formData();
  const file = formData.get("file") as File;

  if (!file) {
    return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
  }

  try {
    const buffer = Buffer.from(await file.arrayBuffer());
    const base64Image = `data:${file.type};base64,${buffer.toString("base64")}`;

    const uploadResponse = await cloudinary.uploader.upload(base64Image, {
      folder: "cover_images",
    });

    // Update user's cover image in the database
    const updatedUser = await User.findByIdAndUpdate(
      session.user.id,
      { coverImage: uploadResponse.secure_url },
      { new: true }
    );

    if (!updatedUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({
      coverImage: uploadResponse.secure_url,
      user: updatedUser,
    });
  } catch (error) {
    console.error("Cover Upload Error", error);
    return NextResponse.json(
      { error: "Failed to upload cover image" },
      { status: 500 }
    );
  }
}
