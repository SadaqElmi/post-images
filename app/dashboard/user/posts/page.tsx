"use client";
import Image from "next/image";
import { useEffect } from "react";
import usePostStore from "@/app/store/postStore";
import axios from "axios";

const Posts = () => {
  const { posts, setPosts } = usePostStore();
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const { data } = await axios.get("/api/posts/create");
        setPosts(data);
      } catch (error) {
        console.error("Failed to fetch posts", error);
      }
    };

    fetchPosts();
  }, [setPosts]);

  return (
    <>
      <div className="space-y-4">
        {posts.map((post) => (
          <div key={post._id} className="border p-4 rounded-lg">
            <p className="font-bold">{post.description}</p>
            {post.imageUrl && (
              <img
                src={post.imageUrl}
                alt="Post"
                className="mt-2 w-full h-48 object-cover rounded-lg"
              />
            )}
          </div>
        ))}
      </div>
      <div className="flex justify-center flex-col w-full items-center">
        <div className="w-[500px] bg-white p-4 rounded-lg shadow-md my-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <img
                src="https://picsum.photos/id/237/200/200"
                className="w-12 h-12 rounded-full"
                alt="profile"
              />
              <div className="ml-4">
                <h2 className="text-lg font-semibold">John Doe</h2>
                <p className="text-sm text-gray-600">2 hours ago</p>
              </div>
            </div>
          </div>
          <p className="py-4 text-lg">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptatum
            voluptatibus, quae quidem distinctio, natus, quibusdam corrupti
            voluptates tempore doloremque possimus.
          </p>
          <div className="relative w-full h-[630px]">
            <Image
              src="/post1.jpeg"
              alt="Post Image"
              fill
              className="object-cover rounded-lg"
              priority
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default Posts;
