//import CredentialsProvider from "next-auth/providers/credentials";
//import GoogleProvider from "next-auth/providers/google";
//import User from "@/app/models/User";
//import { connectDB } from "@/lib/mongodb";
//import bcrypt from "bcryptjs";
//import NextAuth, { AuthOptions } from "next-auth";
//
//export const authOptions: AuthOptions = {
//  providers: [
//    CredentialsProvider({
//      name: "Credentials",
//      credentials: {
//        email: { label: "Email", type: "email" },
//        password: { label: "Password", type: "password" },
//      },
//      async authorize(credentials) {
//        await connectDB();
//        const user = await User.findOne({ email: credentials?.email });
//
//        if (
//          credentials &&
//          user &&
//          (await bcrypt.compare(credentials.password, user.password))
//        ) {
//          return {
//            id: user._id.toString(),
//            name: user.name,
//            email: user.email,
//            role: user.role,
//            avatar: user.avatar,
//          };
//        }
//        throw new Error("Invalid credentials");
//      },
//    }),
//    GoogleProvider({
//      clientId: process.env.GOOGLE_CLIENT_ID!,
//      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
//    }),
//  ],
//  callbacks: {
//    async jwt({ token, user }) {
//      if (user) {
//        token.id = user.id;
//        token.role = user.role;
//        token.avatar = user.avatar;
//      }
//      return token;
//    },
//    async session({ session, token }) {
//      session.user.id = token.id as string;
//      session.user.role = token.role as string;
//      session.user.avatar = token.avatar as string;
//      return session;
//    },
//  },
//  session: {
//    strategy: "jwt",
//  },
//  secret: process.env.NEXTAUTH_SECRET,
//  pages: {
//    signIn: "/login",
//  },
//};
//
//const handler = NextAuth(authOptions);
//export { handler as GET, handler as POST };

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
      // For social providers like Google, save the user if they don't exist
      if (account?.provider === "google") {
        await connectDB();
        const existingUser = await User.findOne({ email: user.email });
        if (!existingUser) {
          const newUser = new User({
            name: user.name,
            email: user.email,
            avatar: user.image, // Google returns the image as `user.image`
            role: "user", // set a default role; you can adjust as needed
          });
          await newUser.save();
        }
      }
      return true;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.avatar = user.avatar || user.image;
      }
      return token;
    },
    async session({ session, token }) {
      session.user.id = token.id as string;
      session.user.role = token.role as string;
      session.user.avatar = token.avatar as string;
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
