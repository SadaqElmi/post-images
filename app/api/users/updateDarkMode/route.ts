import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import User from "@/app/models/User";
import { authOptions } from "@/config/auth";

export async function PATCH(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { darkMode } = await request.json();

  try {
    await User.findByIdAndUpdate(session.user.id, { darkMode });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }
}
