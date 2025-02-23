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

const Header = () => {
  const { data: session } = useSession();
  const { user, setUser, clearUser } = useAuthStore();
  // State for the currently displayed avatar image
  const [image, setImage] = useState<string>(user?.avatar || "");
  // State for the selected file that is pending confirmation
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  // Update the user and avatar when the session changes
  useEffect(() => {
    if (session && session.user) {
      setUser(session.user);
      setImage(session.user.avatar || "");
    }
  }, [session, setUser]);

  // When a file is selected, create a local preview and save the file reference
  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const localImageUrl = URL.createObjectURL(file);
      setImage(localImageUrl);
      setSelectedFile(file);
      event.target.value = "";
    }
  };

  // When the user clicks "Save", upload the selected image
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
      // Clear the selected file after a successful upload
      setSelectedFile(null);
    } catch (error) {
      console.error("Failed to upload image", error);
    }
  };

  // When the user clicks "Cancel", revert the preview and clear the selected file
  const handleCancelImage = () => {
    setImage(user?.avatar || "");
    setSelectedFile(null);
  };
  const handleLogout = async () => {
    await signOut({ callbackUrl: "/" });
    clearUser();
  };
  return (
    <>
      <div className="flex justify-around items-center px-25 py-4">
        <Link href="/dashboard/admin">
          <h1>Admin Panel</h1>
        </Link>
        <div className="">
          <Link href="/dashboard/admin/posts">
            <Button> Posts </Button>
          </Link>
        </div>
        <div className="flex items-center gap-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Avatar>
                <AvatarImage
                  src={image || ""}
                  alt="Profile"
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
                {/* File input with event propagation stopped so the dropdown doesn't close */}
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
                {/* Show Save and Cancel buttons only when a file has been selected */}
                {selectedFile && (
                  <>
                    <DropdownMenuItem asChild>
                      <div onClick={(e) => e.stopPropagation()}>
                        <button
                          onClick={handleSaveImage}
                          className="text-white bg-blue-500 p-1 rounded-md w-full"
                        >
                          Save
                        </button>
                      </div>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <div onClick={(e) => e.stopPropagation()}>
                        <button
                          onClick={handleCancelImage}
                          className="text-white bg-red-500 p-1 rounded-md w-full"
                        >
                          Cancel
                        </button>
                      </div>
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>

          <Button onClick={handleLogout}>LogOut</Button>
        </div>
      </div>
    </>
  );
};

export default Header;
