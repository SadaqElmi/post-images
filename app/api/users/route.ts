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

export async function POST(req: Request) {
  try {
    await connectDB();
    const { userIds } = await req.json();

    const users = await User.find({ _id: { $in: userIds } }).select(
      "_id name avatar"
    );

    return NextResponse.json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json(
      { error: "Failed to fetch users" },
      { status: 500 }
    );
  }
}
