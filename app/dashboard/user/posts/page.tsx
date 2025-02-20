"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import usePostStore, { User } from "@/app/store/postStore";
import axios from "axios";
import { useSession } from "next-auth/react";
import { formatPostTime } from "@/lib/formatTime";

const Posts = () => {
  const { posts, setPosts } = usePostStore();
  const { data: session } = useSession();

  // State for comments (per post)
  const [commentTexts, setCommentTexts] = useState<Record<string, string>>({});
  const [commentLoading, setCommentLoading] = useState<string | null>(null);

  // State for likes (per post)
  const [likingPostId, setLikingPostId] = useState<string | null>(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await axios.get("/api/posts");
        setPosts(res.data);
      } catch (error) {
        console.error("Failed to fetch posts", error);
        setPosts([]); // Fallback in case of failure
      }
    };

    fetchPosts();
  }, [setPosts]);

  //  const handleCommentSubmit = async (postId: string) => {
  //    const text = commentTexts[postId]?.trim();
  //    if (!text) return alert("Comment cannot be empty");
  //    if (!session?.user) return alert("You need to log in");
  //
  //    try {
  //      setCommentLoading(postId);
  //
  //      // Optimistically update state with current user's comment
  //      const newComment = {
  //        userId: {
  //          _id: session.user.id,
  //          name: session.user.name,
  //          avatar: session.user.avatar,
  //        },
  //        text,
  //        createdAt: new Date().toISOString(),
  //      };
  //
  //      setPosts((prev) =>
  //        prev.map((p) =>
  //          p._id === postId ? { ...p, comments: [...p.comments, newComment] } : p
  //        )
  //      );
  //
  //      await axios.post("/api/posts/comment", { postId, text });
  //
  //      setCommentTexts((prev) => ({ ...prev, [postId]: "" }));
  //    } catch (error) {
  //      console.error(error);
  //      alert("Failed to add comment");
  //    } finally {
  //      setCommentLoading(null);
  //    }
  //  };

  //  const handleLike = async (postId: string) => {
  //    setLikingPostId(postId);
  //
  //    try {
  //      const { data: updatedPost } = await axios.post("/api/posts/like", {
  //        postId,
  //      });
  //
  //      setPosts((prev) =>
  //        prev.map((p) => (p._id === updatedPost._id ? updatedPost : p))
  //      );
  //    } catch (error) {
  //      console.error("Failed to like post", error);
  //    } finally {
  //      setLikingPostId(null);
  //    }
  //  };

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
              <div className="relative w-full h-[400px]">
                <Image
                  src={post.imageUrl}
                  alt="Post Image"
                  fill
                  className="object-cover rounded-lg"
                  priority
                />
              </div>
            )}

            {/* Like Section */}
            <button
              //onClick={() => handleLike(post._id)}
              disabled={likingPostId === post._id}
              className="mt-2 text-red-500"
            >
              ❤️ {post.likes.length}
            </button>

            {/* Comment Section */}
            <div className="mt-3">
              <input
                type="text"
                value={commentTexts[post._id] || ""}
                onChange={(e) =>
                  setCommentTexts((prev) => ({
                    ...prev,
                    [post._id]: e.target.value,
                  }))
                }
                placeholder="Write a comment..."
                className="border p-1 rounded w-full"
              />
              <button
                //onClick={() => handleCommentSubmit(post._id)}
                disabled={commentLoading === post._id}
                className="mt-2 bg-blue-500 text-white px-3 py-1 rounded"
              >
                {commentLoading === post._id ? "Commenting..." : "Comment"}
              </button>

              {/* Display Comments */}
              {post.comments.map((comment) => {
                const commentUser =
                  typeof comment.userId === "string"
                    ? null
                    : (comment.userId as User);

                return (
                  <div
                    key={comment.createdAt}
                    className="flex items-start gap-3 mt-3"
                  >
                    <img
                      src={
                        commentUser?.avatar ||
                        "https://via.placeholder.com/30?text=User"
                      }
                      className="w-8 h-8 rounded-full object-cover"
                      alt="comment-user"
                    />
                    <div>
                      <p className="font-semibold">
                        {commentUser?.name || "Unknown User"}
                      </p>
                      <p>{comment.text}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Posts;
