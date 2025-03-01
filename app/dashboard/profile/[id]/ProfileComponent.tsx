"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Image from "next/image";
import Loading from "@/app/loading";

const ProfileComponent = ({ userId }: { userId: string }) => {
  const [user, setUser] = useState<{ avatar: string; name: string } | null>(
    null
  );
  const [coverImage, setCoverImage] = useState("");

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get(`/api/users/${userId}`);
        setUser(res.data);
        setCoverImage(res.data.coverImage);
      } catch (error) {
        console.error("Failed to fetch user", error);
      }
    };
    fetchUser();
  }, [userId]);

  if (!user)
    return (
      <div>
        <Loading />
      </div>
    );

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Cover Photo */}
      <div className="relative w-full h-[312px] sm:h-[360px] bg-gray-200 rounded-lg overflow-hidden">
        <Image
          src={coverImage}
          alt="Cover"
          fill
          priority
          className="object-cover"
        />
      </div>

      {/* Profile Info */}
      <div className="flex flex-col items-center mt-[-80px]">
        <Avatar className="w-32 h-32 border-4 border-white ">
          <AvatarImage src={user.avatar} className="object-cover" />
          <AvatarFallback>{user.name[0]}</AvatarFallback>
        </Avatar>
        <h1 className="text-2xl font-bold mt-4">{user.name}</h1>
      </div>
    </div>
  );
};

export default ProfileComponent;
