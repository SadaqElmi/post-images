import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import User from "@/app/models/User";
import { getServerSession } from "next-auth";
import { authOptions } from "@/config/auth";

// app/api/users/[id]/ban/route.ts

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || session.user.role !== "admin") {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { id } = await params;
    const { hours } = await request.json();
    await connectDB();

    const bannedUntil = new Date();
    bannedUntil.setHours(bannedUntil.getHours() + hours);

    await User.findByIdAndUpdate(id, { $set: { bannedUntil } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Ban error:", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
