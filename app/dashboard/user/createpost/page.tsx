"use client";

import { useState } from "react";
import axios from "axios";
import Image from "next/image";
import usePostStore from "@/app/store/postStore";
import { toast } from "react-hot-toast";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Loader2, Image as ImageIcon, Video as VideoIcon } from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

const CreatePost = () => {
  const { addPost } = usePostStore();
  const { data: session } = useSession();
  const router = useRouter();
  const [mediaPreview, setMediaPreview] = useState<string | null>(null);
  const [mediaFile, setMediaFile] = useState<File | null>(null);
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [isVideo, setIsVideo] = useState(false);

  const handleMediaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const fileType = file.type.startsWith("video") ? "video" : "image";
      setIsVideo(fileType === "video");
      setMediaFile(file);
      setMediaPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async () => {
    if (!description.trim() && !mediaFile) {
      toast.error("Post cannot be empty!");
      return;
    }

    try {
      setLoading(true);
      let imageUrl: string | null = null;

      if (mediaFile) {
        const formData = new FormData();
        formData.append("file", mediaFile);
        const { data } = await axios.post("/api/posts/upload", formData);
        imageUrl = data.imageUrl; // Now using 'imageUrl' from the response
      }

      const { data: newPost } = await axios.post("/api/posts/create", {
        description,
        imageUrl,
        mediaType: isVideo ? "video" : "image", // Send mediaType
      });
      toast.success("Post Created Successfully!");
      addPost(newPost);
      setDescription("");
      setMediaFile(null);
      setMediaPreview(null);
      router.push("/dashboard/user");
    } catch (error) {
      console.error(error);
      toast.error("Failed To Create Post!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center py-4">
      <div className="bg-white p-4 rounded-lg shadow-md w-full max-w-md">
        {/* Post Header */}
        <div className="flex items-center gap-3">
          <Avatar className="h-8 w-8 sm:h-10 sm:w-10">
            <AvatarImage
              src={session?.user?.avatar || undefined}
              alt="Profile"
              className="object-cover"
            />
            <AvatarFallback>
              {session?.user?.name?.charAt(0).toUpperCase() || "U"}
            </AvatarFallback>
          </Avatar>
          <textarea
            className="w-full border-none focus:ring-0 text-sm bg-gray-100 rounded-xl p-3 resize-none"
            placeholder="What's on your mind?"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={2}
          />
        </div>

        {/* Media Preview (Image or Video) */}
        {mediaPreview && (
          <div className="relative w-full mt-3 rounded-lg overflow-hidden">
            {isVideo ? (
              <video controls className="w-full rounded-lg">
                <source src={mediaPreview} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            ) : (
              <Image
                src={mediaPreview}
                alt="Post Preview"
                width={500}
                height={300}
                className="object-cover w-full rounded-lg"
              />
            )}
            <button
              onClick={() => {
                setMediaPreview(null);
                setMediaFile(null);
              }}
              className="absolute top-2 right-2 bg-black bg-opacity-50 text-white text-sm px-2 py-1 rounded"
            >
              ✕
            </button>
          </div>
        )}

        {/* Upload and Post Button */}
        <div className="flex justify-between items-center mt-3 border-t pt-3">
          {/* Image Upload */}
          <label className="flex items-center gap-2 cursor-pointer text-blue-500 hover:bg-gray-100 px-3 py-2 rounded-md">
            <ImageIcon className="h-5 w-5" />
            <span>Photo</span>
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleMediaChange}
            />
          </label>

          {/* Video Upload */}
          <label className="flex items-center gap-2 cursor-pointer text-red-500 hover:bg-gray-100 px-3 py-2 rounded-md">
            <VideoIcon className="h-5 w-5" />
            <span>Video</span>
            <input
              type="file"
              accept="video/*"
              className="hidden"
              onChange={handleMediaChange}
            />
          </label>

          {/* Post Button */}
          <Button
            onClick={handleSubmit}
            disabled={loading}
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
          >
            {loading ? <Loader2 className="animate-spin w-5 h-5" /> : "Post"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CreatePost;
