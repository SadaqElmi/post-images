"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";
import useAuthStore from "@/app/store/authStore";
import ProfilePage from "./posts";
import Loading from "@/app/loading";
import Image from "next/image";

const Profile = () => {
  const { data: session, status, update } = useSession();
  const router = useRouter();
  const { user, setUser } = useAuthStore();
  const [image, setImage] = useState<string>(user?.avatar || "");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [coverImage, setCoverImage] = useState<string>(user?.coverImage || "");
  const [selectedCoverFile, setSelectedCoverFile] = useState<File | null>(null);

  useEffect(() => {
    if (user) {
      setImage(user?.avatar || "");
      setCoverImage(user?.coverImage || "");
    }
  }, [user]);

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
      await update(); // Next-auth session update
      setUser({ ...response.data }); // Force Zustand update
      const uploadedImageUrl = response.data.avatar;
      setImage(`${uploadedImageUrl}?t=${Date.now()}`);
      if (user) setUser({ ...user, avatar: uploadedImageUrl });
      setSelectedFile(null);
    } catch (error) {
      console.error("Failed to upload image", error);
    }
  };

  const handleCancelImage = () => {
    setImage(user?.avatar || "");
    setSelectedFile(null);
  };

  const handleCoverImageChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      const localCoverUrl = URL.createObjectURL(file);
      setCoverImage(localCoverUrl);
      setSelectedCoverFile(file);
      event.target.value = "";
    }
  };

  const handleSaveCoverImage = async () => {
    if (!selectedCoverFile) return;
    const formData = new FormData();
    formData.append("file", selectedCoverFile);

    try {
      const response = await axios.post("/api/users/uploadCover", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setUser(response.data);
      const uploadedImageUrl = response.data.coverImage;
      setCoverImage(`${uploadedImageUrl}?t=${Date.now()}`);

      if (user) {
        setUser({ ...user, coverImage: uploadedImageUrl });
      }
      setSelectedCoverFile(null);
    } catch (error) {
      console.error("Failed to upload cover image", error);
    }
  };

  const handleCancelCoverImage = () => {
    setCoverImage(user?.coverImage || "");
    setSelectedCoverFile(null);
  };

  if (status === "loading")
    return (
      <div>
        <Loading />
      </div>
    );
  if (status === "unauthenticated") router.push("/login");

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Cover Photo */}
      <div className="relative w-full h-[312px] sm:h-[360px] md:h-80 bg-gray-300 rounded-lg overflow-hidden">
        <Image
          src={coverImage}
          alt="Cover"
          className="w-full h-full object-cover"
          priority
          fill
        />
        <div className="absolute top-2 right-2">
          <Button>
            <label className="cursor-pointer flex items-center gap-2">
              <Pencil className="mr-2 h-4 w-4" />
              <span>Badal Dadool ka </span>
              <input
                type="file"
                accept="image/*"
                onChange={handleCoverImageChange}
                className="hidden"
              />
            </label>
          </Button>
          {selectedCoverFile && (
            <div className="mt-4 flex gap-2">
              <Button onClick={handleSaveCoverImage}>kaydin Dabool</Button>
              <Button onClick={handleCancelCoverImage}>Joojin Dabool</Button>
            </div>
          )}
        </div>
      </div>

      {/* Profile Header */}
      <div className="relative flex flex-col items-center mt-[-80px] md:mt-[-100px] pb-4">
        {/* Avatar */}
        <Avatar className="w-32 h-32 border-4 border-white rounded-full shadow-lg">
          <AvatarImage src={image} alt="Profile" className="object-cover" />
          <AvatarFallback>
            {session?.user?.name?.charAt(0).toUpperCase() || "U"}
          </AvatarFallback>
        </Avatar>

        {/* Name */}
        <h1 className="text-xl md:text-2xl font-bold mt-2">
          {session?.user?.name}
        </h1>

        {/* Edit Profile Button */}
        <div className="mt-2">
          <Button>
            <label className="cursor-pointer flex items-center gap-2">
              <Pencil className="mr-2 h-4 w-4" />
              <span>Badal Dadool ka</span>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
            </label>
          </Button>
          {selectedFile && (
            <div className="mt-4 flex gap-2">
              <Button onClick={handleSaveImage}>Kaydin</Button>
              <Button onClick={handleCancelImage}>Joojin</Button>
            </div>
          )}
        </div>
      </div>

      {/* User's Posts */}
      <div>
        <ProfilePage />
      </div>
    </div>
  );
};

export default Profile;
