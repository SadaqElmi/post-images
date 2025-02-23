import { NextResponse } from "next/server";
import User from "@/app/models/User";
import { connectDB } from "@/lib/mongodb";

export async function GET() {
  try {
    await connectDB();

    const Users = await User.find();

    return NextResponse.json(Users);
  } catch (error) {
    console.error("Failed to fetch Users", error);
    return NextResponse.json(
      { error: "Failed to fetch Users" },
      { status: 500 }
    );
  }
}
