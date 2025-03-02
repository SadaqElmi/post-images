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

        if (
          credentials &&
          user &&
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
            avatar: user.image, // Google returns the image as `user.image`
            role: "user", // default role
          });
          await existingUser.save();
        }
        // Overwrite the Google id with the MongoDB _id
        user.id = existingUser._id.toString();
        user.role = existingUser.role;
        user.avatar = existingUser.avatar;
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
  },
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/login",
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
