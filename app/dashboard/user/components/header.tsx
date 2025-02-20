"use client";
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
import { signOut } from "next-auth/react";
import useAuthStore from "@/app/store/authStore";
import { useState } from "react";
import axios from "axios";

const Header = () => {
  const { user, clearUser, setUser } = useAuthStore();
  const [image, setImage] = useState<string | null>(user?.avatar || null);
  const [loading, setLoading] = useState(false);

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    console.log("Uploading image...");
    setLoading(true);
    console.log(formData);

    try {
      const res = await axios.post("/api/users/upload", formData);
      setImage(res.data.imageUrl);
    } catch (error) {
      console.error("Upload failed", error);
    }
  };

  const handleLogout = async () => {
    await signOut({ callbackUrl: "/" });
    clearUser();
  };

  return (
    <div className="flex justify-around items-center px-25 py-4">
      <Link href="/dashboard/user">
        <h1>Posts</h1>
      </Link>
      <div>
        <Link href="/dashboard/user/createpost">
          <Button>Create Post</Button>
        </Link>
      </div>
      <div className="flex items-center gap-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Avatar>
              <AvatarImage
                src={image || user?.avatar}
                alt={user?.name || "Profile"}
                className="object-cover"
              />
              <AvatarFallback>
                {user?.name?.charAt(0).toUpperCase() || "U"}
              </AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>

          <DropdownMenuContent className="w-56">
            <DropdownMenuLabel>User: {user?.name}</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem>
                <input type="file" onChange={handleImageChange} />
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>

        <Button onClick={handleLogout}>LogOut</Button>
      </div>
    </div>
  );
};

export default Header;
