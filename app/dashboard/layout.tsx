"use client";
import { SessionProvider } from "next-auth/react";
import { Toaster } from "react-hot-toast";
import Header from "../components/Header";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <SessionProvider>
          <div className="fixed z-50 w-full bg-white">
            <Header />
          </div>
          <div className="pt-20">{children}</div>
          <Toaster position="top-right" />
        </SessionProvider>
      </body>
    </html>
  );
}
