import { NextResponse } from "next/server";
import User from "@/app/models/User";
import { connectDB } from "@/lib/mongodb";

export async function DELETE(
  request: Request, // Add Request as the first parameter
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    const id = params.id;
    await User.findByIdAndDelete(id);
    return NextResponse.json({ message: "User deleted" });
  } catch (error) {
    console.error("Failed to delete user", error);
    return NextResponse.json(
      { error: "Failed to delete user" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { role } = await request.json();
  try {
    await connectDB();
    const id = params.id;
    const updatedUser = await User.findByIdAndUpdate(
      id,
      { role },
      { new: true }
    );
    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error("Failed to update user role", error);
    return NextResponse.json(
      { error: "Failed to update user role" },
      { status: 500 }
    );
  }
}
