"use client";
import { useEffect } from "react";
import { useSession, signOut } from "next-auth/react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import useAuthStore from "@/app/store/authStore";
import { HomeIcon, Info, PlusCircle } from "lucide-react";

const Header = () => {
  const { data: session } = useSession();
  const { user, setUser, clearUser } = useAuthStore();
  const isAdmin = user?.role === "admin";

  useEffect(() => {
    if (session && session.user) {
      setUser({ ...session?.user, coverImage: session?.user.coverImage || "" });
    }
  }, [session, setUser]);

  const handleLogout = async () => {
    await signOut({ callbackUrl: "/" });
    clearUser();
  };

  return (
    <header className="flex justify-between items-center px-4 sm:px-6 py-4 bg-white shadow-sm">
      {/* Mobile Menu */}
      <div className="md:hidden flex  items-center w-full">
        {/* Logo (Separate from Icons) */}
        <Link href={isAdmin ? "/dashboard/admin" : "/dashboard/user"}>
          <div className="bg-white text-[#1877f2] rounded-full h-8 w-8 flex items-center justify-center font-bold text-xl">
            F
          </div>
        </Link>

        {/* Mobile Navigation (Icons) */}
        <div className="flex gap-5 items-center justify-center w-full">
          <Link
            href="/dashboard/user"
            className="p-2 hover:bg-gray-100 rounded-md flex items-center justify-center"
          >
            <HomeIcon className="h-6 w-6 text-[#1877f2]" />
          </Link>
          <Link
            href="/dashboard/user/createpost"
            className="p-2 hover:bg-gray-100 rounded-md flex items-center justify-center"
          >
            <PlusCircle className="h-6 w-6 text-[#1877f2]" />
          </Link>
          <Link
            href="/dashboard/user/about"
            className="p-2 hover:bg-gray-100 rounded-md flex items-center justify-center"
          >
            <Info className="h-6 w-6 text-[#1877f2]" />
          </Link>
        </div>
      </div>

      {/* Desktop Logo */}
      <Link
        href={isAdmin ? "/dashboard/admin" : "/dashboard/user"}
        className="hidden md:block"
      >
        <h1 className="text-lg font-semibold">
          {isAdmin ? "Admin Panel" : "Home"}
        </h1>
      </Link>

      {/* Desktop Navigation */}
      <div className="hidden md:flex gap-4">
        {isAdmin ? (
          <Link href="/dashboard/posts">
            <Button variant="ghost">Manage Posts</Button>
          </Link>
        ) : (
          <>
            <Link href="/dashboard/user/createpost">
              <Button variant="ghost">Create Post</Button>
            </Link>
            <Link
              href={
                isAdmin ? "/dashboard/admin/about" : "/dashboard/user/about"
              }
            >
              <Button variant="ghost">About Us</Button>
            </Link>
          </>
        )}
      </div>

      {/* User Section */}
      <div className="flex items-center gap-2 sm:gap-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Avatar className="h-8 w-8 sm:h-10 sm:w-10 cursor-pointer object-cover">
              <AvatarImage
                src={user?.avatar}
                alt="Profile"
                className="object-cover"
              />
              <AvatarFallback>
                {user?.name?.charAt(0).toUpperCase() || (isAdmin ? "A" : "U")}
              </AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <Link href="/dashboard/profile">
                <DropdownMenuItem>
                  Profile
                  <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
                </DropdownMenuItem>
              </Link>

              <DropdownMenuItem>
                Settings
                <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
              </DropdownMenuItem>
            </DropdownMenuGroup>

            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout}>
              Log out
              <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};

export default Header;
