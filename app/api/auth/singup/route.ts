import User from "@/app/models/User";
import { connectDB } from "@/lib/mongodb";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { transporter } from "@/lib/nodemailer";

export async function POST(req: Request) {
  try {
    const { name, email, password } = await req.json();

    await connectDB();

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { error: "User already exists" },
        { status: 400 }
      );
    }

    const newUser = new User({ name, email, password, verified: false });
    await newUser.save();

    // Generate a verification token that expires in 1 hour
    const verificationToken = jwt.sign(
      { id: newUser._id },
      process.env.JWT_SECRET!,
      { expiresIn: "1h" }
    );

    // Send verification email
    const verificationUrl = `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/verify?token=${verificationToken}`;
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: newUser.email,
      subject: "Verify your email",
      html: `<p>Please click this link to verify your email: <a href="${verificationUrl}">Verify Email</a></p>`,
    });

    return NextResponse.json(
      {
        message:
          "User created successfully. Please check your email to verify your account.",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to create user" },
      { status: 500 }
    );
  }
}
