import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { connectDB } from "@/lib/mongodb";
import User from "@/app/models/User";
interface DecodedToken {
  id: string;
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const token = searchParams.get("token");

    if (!token) {
      return NextResponse.json(
        { error: "Verification token is missing" },
        { status: 400 }
      );
    }

    let decoded: DecodedToken;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET!) as DecodedToken;
    } catch (err) {
      console.log(err);
      return NextResponse.json(
        { error: "Invalid or expired verification token" },
        { status: 400 }
      );
    }

    await connectDB();
    const user = await User.findById(decoded.id);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    user.verified = true;
    await user.save();

    const htmlContent = `
      <html>
        <head><title>Email Verified</title></head>
        <body style="font-family: sans-serif; text-align: center; margin-top: 50px;">
          <h1>Email verified successfully!</h1>
          <p>You can now <a href="${process.env.NEXT_PUBLIC_APP_URL}">go back to the website</a>.</p>
        </body>
      </html>
    `;

    return new NextResponse(htmlContent, {
      status: 200,
      headers: { "Content-Type": "text/html" },
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to verify email" },
      { status: 500 }
    );
  }
}
