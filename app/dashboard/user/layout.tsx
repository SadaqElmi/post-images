"use client";
import { SessionProvider } from "next-auth/react";
import Header from "./components/header";

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
        </SessionProvider>
      </body>
    </html>
  );
}
