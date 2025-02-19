//import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import User from "@/app/models/User";
import { connectDB } from "@/lib/mongodb";
import bcrypt from "bcryptjs";
import NextAuth from "next-auth";

const handler = NextAuth({
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
    async jwt({ token, user }: { token: any; user?: any }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.avatar = user.avatar; // Include avatar if needed
      }
      return token;
    },
    async session({ session, token }: { session: any; token: any }) {
      session.user.id = token.id;
      session.user.role = token.role;
      session.user.avatar = token.avatar; // Include avatar if needed
      return session;
    },
  },
  session: {
    strategy: "jwt", // Use JWT for session management
  },
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/login",
  },
});

export { handler as GET, handler as POST };
