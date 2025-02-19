"use client";

import { useState } from "react";
import axios from "axios";
import Image from "next/image";
import useAuthStore from "@/app/store/authStore";
import usePostStore from "@/app/store/postStore";

const CreatePost = () => {
  const { user } = useAuthStore();
  const { addPost } = usePostStore();

  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async () => {
    if (!description) return alert("Description is required");

    try {
      setLoading(true);

      let imageUrl = "";

      if (imageFile) {
        const formData = new FormData();
        formData.append("file", imageFile);

        const { data } = await axios.post("/api/posts/upload", formData);
        imageUrl = data.imageUrl;
      }

      const { data: newPost } = await axios.post("/api/posts/create", {
        description,
        imageUrl,
      });

      addPost(newPost);
      setDescription("");
      setImageFile(null);
      setImagePreview(null);
      alert("Post created successfully!");
    } catch (error) {
      console.error(error);
      alert("Failed to create post");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center ">
      <div className="bg-white p-4 rounded-lg shadow-md w-full max-w-md ">
        <h1 className="text-2xl font-bold mb-4">Create Post</h1>

        <textarea
          className="w-full border p-2 rounded mb-4"
          placeholder="Write your post description..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <input type="file" accept="image/*" onChange={handleImageChange} />

        {imagePreview && (
          <div className="my-4 relative w-full h-48">
            <Image
              src={imagePreview}
              alt="Post Preview"
              fill
              className="object-cover rounded-lg"
            />
          </div>
        )}

        <button
          onClick={handleSubmit}
          disabled={loading}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          {loading ? "Posting..." : "Post"}
        </button>
      </div>
    </div>
  );
};

export default CreatePost;
