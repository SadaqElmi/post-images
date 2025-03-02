// app/api/admin/actions/route.ts

import { connectDB } from "@/lib/mongodb";
import Report from "@/app/models/Report";
import User from "@/app/models/User";
import Post from "@/app/models/Post";
import { NextResponse } from "next/server";
import { authOptions } from "@/config/auth";
import { getServerSession } from "next-auth";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    const user = session?.user;

    // Authorization check
    if (!user || user.role !== "admin") {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    const { reportId, action, banDurationHours } = await req.json();
    await connectDB();

    const report = await Report.findById(reportId)
      .populate({
        path: "postId",
        populate: { path: "authorId" },
      })
      .populate("reportedBy");

    if (!report) return new NextResponse("Report not found", { status: 404 });

    // Handle deletion actions first
    if (["delete", "deleteReport"].includes(action)) {
      if (action === "delete" && report.postId) {
        await Post.findByIdAndDelete(report.postId._id);
      }
      await Report.findByIdAndDelete(reportId);
      return NextResponse.json({ success: true });
    }

    // Process other actions
    switch (action) {
      case "ban": {
        if (!report.postId?.authorId?._id) {
          return NextResponse.json(
            { error: "Post author not found" },
            { status: 400 }
          );
        }

        const banHours = banDurationHours || 1;
        const banUntil = new Date();
        banUntil.setHours(banUntil.getHours() + banHours);

        await User.findByIdAndUpdate(report.postId.authorId._id, {
          bannedUntil: banUntil,
        });
        report.adminAction = "userBanned";
        break;
      }

      case "unban": {
        if (!report.postId?.authorId?._id) {
          return NextResponse.json(
            { error: "Post author not found" },
            { status: 400 }
          );
        }

        await User.findByIdAndUpdate(report.postId.authorId._id, {
          $unset: { bannedUntil: 1 },
        });
        report.adminAction = "unbanned"; // Use simplified enum value
        break;
      }

      case "ignore":
        report.adminAction = "ignored";
        break;

      default:
        throw new Error("Invalid action");
    }

    report.status = "resolved";
    await report.save();

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Admin action failed:", error);
    return new NextResponse(
      error instanceof Error ? error.message : "Internal server error",
      { status: 500 }
    );
  }
}
