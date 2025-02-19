import { connectDB } from "@/lib/mongodb";
import User from "@/app/models/User";
import { v2 as cloudinary } from "cloudinary";
import { NextResponse } from "next/server";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(request: Request) {
  await connectDB();

  const formData = await request.formData();
  const file = formData.get("file") as File;
  const userId = formData.get("userId") as string;

  if (!file) {
    return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
  }
  if (!userId) {
    return NextResponse.json({ error: "User ID is required" }, { status: 400 });
  }

  // Convert file to buffer and upload to Cloudinary
  const buffer = Buffer.from(await file.arrayBuffer());
  const base64Image = `data:${file.type};base64,${buffer.toString("base64")}`;

  try {
    const uploadResponse = await cloudinary.uploader.upload(base64Image, {
      folder: "user_profiles",
    });

    // ✅ THIS IS THE IMPORTANT FIX
    const user = await User.findByIdAndUpdate(
      userId,
      { avatar: uploadResponse.secure_url },
      { new: true }
    );

    return NextResponse.json({
      imageUrl: uploadResponse.secure_url,
      user,
    });
  } catch (error) {
    console.error("Cloudinary Upload Error:", error);
    return NextResponse.json(
      { error: "Failed to upload image" },
      { status: 500 }
    );
  }
}
