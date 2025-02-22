"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import usePostStore, { User } from "@/app/store/postStore";
import axios from "axios";
import { formatPostTime } from "@/lib/formatTime";

const Posts = () => {
  const { posts, setPosts } = usePostStore();
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await axios.get("/api/posts");
        setPosts(res.data);
      } catch (error) {
        console.error("Failed to fetch posts", error);
        setPosts([]);
      }
    };

    fetchPosts();
  }, [setPosts]);

  return (
    <div className="flex justify-center flex-col w-full items-center">
      {posts.map((post) => {
        const user = typeof post.authorId === "string" ? null : post.authorId;

        return (
          <div
            key={post._id}
            className="w-[500px] bg-white p-4 rounded-lg shadow-md my-4"
          >
            {/* Post Header */}
            <div className="flex items-center gap-3">
              <img
                src={user?.avatar || "https://via.placeholder.com/50?text=User"}
                className="w-12 h-12 rounded-full object-cover"
                alt="profile"
              />
              <div>
                <h2 className="text-lg font-semibold">
                  {user?.name || "Unknown User"}
                </h2>
                <p className="text-sm text-gray-600">
                  {formatPostTime(post.createdAt)}
                </p>
              </div>
            </div>

            {/* Post Description */}
            <p className="py-4 text-lg">{post.description}</p>

            {/* Post Image */}
            {post.imageUrl && (
              <div className="relative w-full h-auto">
                <Image
                  src={post.imageUrl}
                  alt="Post Image"
                  width={500}
                  height={400}
                  className="object-cover rounded-lg w-full h-auto"
                  priority
                />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default Posts;
