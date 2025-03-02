"use client";
import { Toaster } from "react-hot-toast";
import Header from "../components/Header";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={` antialiased dark:bg-[#1c1c1d] dark:text-white`}>
        <div className="fixed z-50 w-full bg-white">
          <Header />
        </div>
        <div className="pt-20">{children}</div>
        <Toaster position="top-right" />
      </body>
    </html>
  );
}
