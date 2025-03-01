"use client";
import { useEffect, useState } from "react";
import usePostStore, { Post } from "@/app/store/postStore";
import axios from "axios";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  HandThumbUpIcon,
  ChatBubbleLeftIcon,
} from "@heroicons/react/24/outline";
import Image from "next/image";
import { formatPostTime } from "@/lib/formatTime";
import { useSession } from "next-auth/react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  EllipsisVertical,
  EyeOff,
  Pencil,
  ShieldAlertIcon,
  Trash2,
  UserX,
} from "lucide-react";

const PostsComponent = ({ userId }: { userId: string }) => {
  const { data: session } = useSession();
  const { posts, setPosts } = usePostStore();
  const isAdmin = session?.user?.role === "admin";
  const isUser = session?.user?.role === "user";

  const [likingPostId, setLikingPostId] = useState<string | null>(null);

  // post._id -> comment text mapping for editing comments
  const [editingPostId, setEditingPostId] = useState<string | null>(null);
  const [editedDescription, setEditedDescription] = useState("");

  const handleDeletePost = async (postId: string) => {
    try {
      await axios.delete("/api/posts", { data: { postId } });

      const updatedPosts = posts.filter((post) => post._id !== postId);
      setPosts(updatedPosts);
    } catch (error) {
      console.error("Failed to delete post", error);
      alert("Failed to delete post");
    }
  };

  const handleSavePost = async (postId: string) => {
    if (!editedDescription.trim()) {
      alert("Post description cannot be empty");
      return;
    }

    try {
      const { data: updatedPost } = await axios.put("/api/posts", {
        postId,
        description: editedDescription,
      });

      const updatedPosts = posts.map((p) =>
        p._id === updatedPost._id ? updatedPost : p
      );
      setPosts(updatedPosts);
      setEditingPostId(null);
      setEditedDescription("");
    } catch (error) {
      console.error("Failed to update post", error);
      alert("Failed to update post");
    }
  };

  const handleLike = async (postId: string) => {
    setLikingPostId(postId);

    try {
      const { data: updatedPost } = await axios.post("/api/posts/like", {
        postId,
      });

      const updatedPosts: Post[] = posts.map((p) =>
        p._id === updatedPost._id ? updatedPost : p
      );
      setPosts(updatedPosts);
    } catch (error) {
      console.error("Failed to like post", error);
      alert("Failed to like post");
    } finally {
      setLikingPostId(null);
    }
  };
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await axios.get(`/api/posts/profilePosts?userId=${userId}`);
        setPosts(res.data);
      } catch (error) {
        console.error("Failed to fetch posts", error);
      }
    };
    fetchPosts();
  }, [userId, setPosts]);

  // Filter posts by profile user ID
  const profilePosts = posts.filter((post) => {
    const authorId =
      typeof post.authorId === "object" ? post.authorId._id : post.authorId;
    return authorId === userId;
  });

  return (
    <div className="max-w-2xl mx-auto">
      {profilePosts.map((post) => {
        const author = typeof post.authorId === "object" ? post.authorId : null;
        const isAuthor = session?.user?.id === userId;

        return (
          <div
            key={post._id}
            className="bg-white p-4 rounded-lg shadow-md my-4"
          >
            {/* Post Header */}
            <div className="flex items-center gap-3 justify-between">
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarImage
                    src={author?.avatar}
                    alt="Profile"
                    className="object-cover"
                  />
                  <AvatarFallback>
                    {author?.name?.charAt(0).toUpperCase() || "U"}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h2 className="text-lg font-semibold">{author?.name}</h2>
                  <p className="text-sm text-gray-600">
                    {formatPostTime(post.createdAt)}
                  </p>
                </div>
              </div>
              {isAdmin && (
                <button
                  onClick={() => handleDeletePost(post._id)}
                  className="text-red-600 hover:text-red-800"
                >
                  <Trash2 size={20} />
                </button>
              )}
              {isUser && (
                <div className="flex gap-2 ">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <EllipsisVertical />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      {isAuthor ? (
                        <>
                          <DropdownMenuItem asChild>
                            <button
                              className="flex items-center gap-2 text-blue-600 hover:bg-gray-100 p-2 rounded w-full"
                              onClick={() => {
                                setEditingPostId(post._id);
                                setEditedDescription(post.description);
                              }}
                            >
                              <Pencil size={16} /> Edit Post
                            </button>
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleDeletePost(post._id)}
                            className="flex items-center gap-2 text-red-600 hover:bg-gray-100 p-2 rounded"
                          >
                            <Trash2 size={16} /> Delete Post
                          </DropdownMenuItem>
                        </>
                      ) : (
                        <>
                          <DropdownMenuItem className="flex items-center gap-2 text-red-500 hover:bg-gray-100 p-2 rounded">
                            <UserX size={16} /> Block User
                          </DropdownMenuItem>
                          <DropdownMenuItem className="flex items-center gap-2 text-yellow-500 hover:bg-gray-100 p-2 rounded">
                            <ShieldAlertIcon size={16} /> Report User
                          </DropdownMenuItem>
                          <DropdownMenuItem className="flex items-center gap-2 text-gray-500 hover:bg-gray-100 p-2 rounded">
                            <EyeOff size={16} /> Hide Post
                          </DropdownMenuItem>
                        </>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              )}
            </div>

            {/* Post Description */}
            {editingPostId === post._id ? (
              <div className="py-3 sm:py-4">
                <textarea
                  value={editedDescription}
                  onChange={(e) => setEditedDescription(e.target.value)}
                  className="w-full p-2 border rounded-lg text-base sm:text-lg"
                  rows={3}
                />
                <div className="flex gap-2 mt-2">
                  <button
                    onClick={() => handleSavePost(post._id)}
                    className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => {
                      setEditingPostId(null);
                      setEditedDescription("");
                    }}
                    className="bg-gray-200 px-4 py-2 rounded-lg hover:bg-gray-300"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <p className="py-3 sm:py-4 text-base sm:text-lg">
                {post.description}
              </p>
            )}

            {/*Post Image */}

            {post.imageUrl &&
              (post.mediaType === "video" ? (
                <video controls className="w-full rounded-lg">
                  <source src={post.imageUrl} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              ) : (
                <Image
                  src={post.imageUrl}
                  alt="Post media"
                  height={1536}
                  width={2048}
                  className="rounded-lg w-full h-auto object-contain"
                  priority
                />
              ))}

            {/* Interaction buttons */}
            <div className="mt-3 border-t border-gray-200 pt-2">
              <div className="flex justify-between text-gray-600 text-sm">
                <div className="flex items-center gap-1">
                  <HandThumbUpIcon className="w-4 h-4 text-blue-500" />
                  <span>{post.likes.length}</span>
                </div>
                <span>{post.comments.length} Comments</span>
              </div>

              <div className="flex justify-around mt-2 pt-2">
                <button
                  onClick={() => handleLike(post._id)}
                  disabled={likingPostId === post._id}
                  className={`flex items-center gap-1 px-4 py-2 rounded ${
                    session?.user && post.likes.includes(session.user.id)
                      ? "bg-blue-500 text-white"
                      : "bg-transparent hover:text-blue-500"
                  }`}
                >
                  <HandThumbUpIcon className="w-5 h-5" />
                  <span>Like</span>
                </button>
                <button className="flex items-center gap-1">
                  <ChatBubbleLeftIcon className="w-5 h-5" />
                  <span>Comment</span>
                </button>
              </div>
            </div>

            {/* Comments section */}
            <div className="mt-3">
              {post.comments.map((comment) => (
                <div key={comment._id} className="flex items-start gap-3 mt-2">
                  <Avatar className="h-6 w-6">
                    <AvatarImage
                      src={
                        typeof comment.userId === "object"
                          ? comment.userId.avatar
                          : ""
                      }
                    />
                  </Avatar>
                  <div>
                    <p className="font-medium">
                      {typeof comment.userId === "object"
                        ? comment.userId.name
                        : "Unknown"}
                    </p>
                    <p>{comment.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default PostsComponent;
