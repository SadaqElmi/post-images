import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import User from "@/app/models/User";
import { connectDB } from "@/lib/mongodb";
import { authOptions } from "@/config/auth";

export async function PUT(req: Request) {
  await connectDB();
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { name, email } = await req.json();

  try {
    const user = await User.findByIdAndUpdate(
      session.user.id,
      { name, email },
      { new: true }
    );

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Profile updated successfully" });
  } catch (error) {
    console.error("Failed to fetch Users", error);
    return NextResponse.json(
      { error: "Failed to fetch Users" },
      { status: 500 }
    );
  }
}
