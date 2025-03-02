import { connectDB } from "@/lib/mongodb";
import Report from "@/app/models/Report";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/config/auth";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    const user = session?.user;

    if (!user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { postId, reason } = await req.json();

    await connectDB();
    const newReport = new Report({
      postId,
      reportedBy: user.id,
      reason,
    });

    await newReport.save();
    return NextResponse.json(newReport);
  } catch (error) {
    console.error("Error creating report:", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    const user = session?.user;

    // Only allow admins to view reports
    if (!user || user.role !== "admin") {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    await connectDB();

    const reports = await Report.find()
      .populate({
        path: "postId",
        model: "Post",
        select: "description",
      })
      .populate({
        path: "reportedBy",
        model: "User",
        select: "name",
      })
      .sort({ createdAt: -1 });

    return NextResponse.json(reports);
  } catch (error) {
    console.error("Error fetching reports:", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
