import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import User from "@/app/models/User";
import { getServerSession } from "next-auth";
import { authOptions } from "@/config/auth";

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || session.user.role !== "admin") {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { id } = await params;
    await connectDB();

    await User.findByIdAndUpdate(id, { $unset: { bannedUntil: 1 } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Unban error:", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
