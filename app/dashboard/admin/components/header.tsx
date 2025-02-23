"use client";
import { useEffect, useState } from "react";
import { useSession, signOut } from "next-auth/react";
import axios from "axios";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import useAuthStore from "@/app/store/authStore";
import { Menu } from "lucide-react";

const Header = () => {
  const { data: session } = useSession();
  const { user, setUser, clearUser } = useAuthStore();
  const [image, setImage] = useState<string>(user?.avatar || "");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  useEffect(() => {
    if (session && session.user) {
      setUser(session.user);
      setImage(session.user.avatar || "");
    }
  }, [session, setUser]);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const localImageUrl = URL.createObjectURL(file);
      setImage(localImageUrl);
      setSelectedFile(file);
      event.target.value = "";
    }
  };

  const handleSaveImage = async () => {
    if (!selectedFile) return;
    const formData = new FormData();
    formData.append("file", selectedFile);
    try {
      const response = await axios.post("/api/users/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      const uploadedImageUrl = response.data.imageUrl;
      setImage(uploadedImageUrl);
      if (user) {
        setUser({ ...user, avatar: uploadedImageUrl });
      }
      setSelectedFile(null);
    } catch (error) {
      console.error("Failed to upload image", error);
    }
  };

  const handleCancelImage = () => {
    setImage(user?.avatar || "");
    setSelectedFile(null);
  };

  const handleLogout = async () => {
    await signOut({ callbackUrl: "/" });
    clearUser();
  };

  return (
    <header className="flex justify-between items-center px-4 sm:px-6 py-4 bg-white shadow-sm">
      {/* Mobile Menu */}
      <div className="md:hidden">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <Menu className="h-5 w-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            <DropdownMenuLabel>Admin Navigation</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/dashboard/admin" className="w-full">
                Admin Panel
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/dashboard/admin/posts" className="w-full">
                Manage Posts
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/dashboard/admin/about" className="w-full">
                About Us
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Desktop Logo */}
      <Link href="/dashboard/admin" className="hidden md:block">
        <h1 className="text-lg font-semibold">Admin Panel</h1>
      </Link>

      {/* Desktop Navigation */}
      <div className="hidden md:flex gap-4">
        <Link href="/dashboard/admin/posts">
          <Button variant="ghost">Manage Posts</Button>
        </Link>
        <Link href="/dashboard/admin/about">
          <Button variant="ghost">About Us</Button>
        </Link>
      </div>

      {/* User Section */}
      <div className="flex items-center gap-2 sm:gap-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Avatar className="h-8 w-8 sm:h-10 sm:w-10 cursor-pointer object-cover">
              <AvatarImage src={image} alt="Profile" className="object-cover" />
              <AvatarFallback>
                {user?.name?.charAt(0).toUpperCase() || "A"}
              </AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>

          <DropdownMenuContent className="w-48 sm:w-56">
            <DropdownMenuLabel>User: {user?.name}</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem asChild>
                <div onClick={(e) => e.stopPropagation()}>
                  <input
                    accept="image/*"
                    type="file"
                    onClick={(e) => e.stopPropagation()}
                    onChange={handleImageChange}
                  />
                </div>
              </DropdownMenuItem>
              {/* Show Save button only when a file has been selected */}
              {selectedFile && (
                <>
                  <DropdownMenuItem asChild>
                    <div onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={handleSaveImage}
                        className="text-white  bg-blue-500 p-1 rounded-md w-full"
                      >
                        Save
                      </button>
                    </div>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={handleCancelImage}
                    className="cursor-pointer"
                  >
                    <span className="text-red-600 w-full">Cancel</span>
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout}>Logout</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Desktop Logout */}
        <Button
          onClick={handleLogout}
          className="hidden sm:block"
          variant="outline"
        >
          Logout
        </Button>
      </div>
    </header>
  );
};

export default Header;
