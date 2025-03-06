// pages/api/auth/[...nextauth].ts or wherever your NextAuth configuration is defined
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import User from "@/app/models/User";
import { connectDB } from "@/lib/mongodb";
import bcrypt from "bcryptjs";
import NextAuth, { AuthOptions } from "next-auth";

export const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        await connectDB();
        const user = await User.findOne({ email: credentials?.email });
        if (!user) throw new Error("User not found");

        // Check if the user is verified
        if (!user.verified) {
          throw new Error(
            "Please check your email to verify before logging in"
          );
        }

        if (user.bannedUntil && new Date(user.bannedUntil) > new Date()) {
          const banTime = new Date(user.bannedUntil).toLocaleString("en-US", {
            timeZone: "Africa/Mogadishu",
          });
          throw new Error(`User banned until ${banTime}`);
        }

        if (
          credentials &&
          user &&
          user.password &&
          (await bcrypt.compare(credentials.password, user.password))
        ) {
          return {
            id: user._id.toString(),
            name: user.name,
            email: user.email,
            role: user.role,
            avatar: user.avatar,
            coverImage: user.coverImage,
            language: user.language,
          };
        }
        throw new Error("Invalid credentials");
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      await connectDB();
      if (account?.provider === "google") {
        let existingUser = await User.findOne({ email: user.email });
        if (!existingUser) {
          existingUser = new User({
            name: user.name,
            email: user.email,
            avatar: user.image,
            role: "user",
            verified: true, // Automatically verify Google users
          });
          await existingUser.save();
        }
        user.id = existingUser._id.toString();
        user.role = existingUser.role;
        user.avatar = existingUser.avatar;

        if (
          existingUser.bannedUntil &&
          new Date(existingUser.bannedUntil) > new Date()
        ) {
          return false;
        }
      }
      return true;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.avatar = user.avatar || user.image;
        token.darkMode = user.darkMode;
        token.language = user.language;
      }
      return token;
    },
    async session({ session, token }) {
      const freshUser = await User.findById(token.id);
      session.user.id = token.id as string;
      session.user.role = token.role as string;
      session.user.darkMode = freshUser?.darkMode ?? false;
      session.user.language = freshUser?.language || "so";
      session.user.avatar = freshUser?.avatar || token.avatar;
      session.user.coverImage = freshUser?.coverImage;
      return session;
    },
  },
  session: {
    strategy: "jwt",
    // Set session expiration to 1 hour
    maxAge: 60 * 60, // 1 hour in seconds
  },
  jwt: {
    // Also set JWT expiration
    maxAge: 60 * 60,
  },
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/login",
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
