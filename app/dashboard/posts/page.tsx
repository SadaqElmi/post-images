"use client";

import Image from "next/image";
import { useEffect, useState, useRef } from "react";
import usePostStore, { Post, Comment } from "@/app/store/postStore";
import axios from "axios";
import { formatPostTime } from "@/lib/formatTime";
import { formatRelativeTime } from "@/lib/formatRelativeTime";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useSession } from "next-auth/react";
import {
  HandThumbUpIcon,
  ChatBubbleLeftIcon,
} from "@heroicons/react/24/outline";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
  Pencil,
  Trash2,
  EyeOff,
  UserX,
  EllipsisVertical,
  ShieldAlertIcon,
} from "lucide-react";
//import { useRouter } from "next/navigation";

const Posts = () => {
  const { posts, setPosts } = usePostStore();
  const { data: session } = useSession();
  const isAdmin = session?.user?.role === "admin";
  const isUser = session?.user?.role === "user";
  //const router = useRouter();

  // State for comment texts (keyed by post ID)
  const [commentTexts, setCommentTexts] = useState<Record<string, string>>({});
  const [commentLoading, setCommentLoading] = useState<string | null>(null);
  // State for tracking which post is currently being liked
  const [likingPostId, setLikingPostId] = useState<string | null>(null);
  // State to track whether comments are expanded for each post
  const [expandedComments, setExpandedComments] = useState<
    Record<string, boolean>
  >({});
  const commentInputRefs = useRef<Record<string, HTMLInputElement | null>>({});

  const [editingComment, setEditingComment] = useState<Record<string, string>>(
    {}
  );

  const [commentBeingEdited, setCommentBeingEdited] = useState<string | null>(
    null
  );

  // post._id -> comment text mapping for editing comments
  const [editingPostId, setEditingPostId] = useState<string | null>(null);
  const [editedDescription, setEditedDescription] = useState("");

  //const navigateToCase = (id: string) => {
  //  router.push(`/dashboard/profile/${id}`);
  //};
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

  const handleEditComment = async (postId: string, commentId: string) => {
    if (!commentId || !editingComment[commentId]?.trim()) {
      console.error("Missing commentId or empty text", {
        postId,
        commentId,
        text: editingComment[commentId],
      });
      alert("Comment ID is missing or text is empty.");
      return;
    }

    console.log("Sending request to edit:", {
      postId,
      commentId,
      newText: editingComment[commentId],
    });

    try {
      const { data } = await axios.put("/api/posts/comment", {
        postId,
        commentId,
        newText: editingComment[commentId],
      });

      const updatedPosts = posts.map((post) => {
        if (post._id === postId) {
          return {
            ...post,
            comments: post.comments.map((comment) =>
              comment._id === commentId
                ? { ...comment, text: data.updatedComment.text }
                : comment
            ),
          };
        }
        return post;
      });

      setPosts(updatedPosts);
      setEditingComment({});
      setCommentBeingEdited(null);
    } catch (error) {
      console.error("Failed to edit comment", error);
      alert("Failed to edit comment");
    }
  };

  const handleDeleteComment = async (postId: string, commentId: string) => {
    console.log("Deleting comment with ID:", commentId); // Debugging
    if (!window.confirm("Are you sure you want to delete this comment?"))
      return;

    try {
      await axios.delete("/api/posts/comment", {
        data: { postId, commentId },
      });

      const updatedPosts = posts.map((post) => {
        if (post._id === postId) {
          return {
            ...post,
            comments: post.comments.filter(
              (comment) => comment._id !== commentId
            ),
          };
        }
        return post;
      });

      setPosts(updatedPosts);
    } catch (error) {
      console.error("Failed to delete comment", error);
      alert("Failed to delete comment");
    }
  };

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

  const handleCommentSubmit = async (postId: string) => {
    const text = commentTexts[postId]?.trim();
    if (!text) return;
    if (!session?.user) {
      alert("You need to log in");
      return;
    }

    setCommentLoading(postId);

    // Generate a temporary ID for optimistic update
    const tempId = `temp-${Math.random()}`;
    const newComment: Comment = {
      _id: tempId, // Temporary ID for UI updates
      userId: {
        _id: session.user.id,
        name: session.user.name,
        avatar: session.user.avatar,
      },
      text,
      createdAt: new Date().toISOString(),
    };

    // Optimistically update UI
    const updatedPosts = posts.map((p: Post) =>
      p._id === postId
        ? {
            ...p,
            comments: [...p.comments, newComment],
          }
        : p
    );
    setPosts(updatedPosts);

    try {
      // Send request to backend
      const { data } = await axios.post("/api/posts/comment", { postId, text });

      // Replace temp ID with actual ID from backend response
      const updatedPosts = posts.map((post) =>
        post._id === postId ? data : post
      );
      setPosts(updatedPosts);
    } catch (error) {
      console.error("Failed to add comment", error);
      alert("Failed to add comment");

      // Revert optimistic update on error
      const revertedPosts = posts.map((p) =>
        p._id === postId
          ? {
              ...p,
              comments: p.comments.filter((c) => c._id == tempId),
            }
          : p
      );
      setPosts(revertedPosts);
    } finally {
      setCommentTexts((prev) => ({ ...prev, [postId]: "" }));
      setCommentLoading(null);
    }
  };

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

  return (
    <div className="flex flex-col items-center w-full px-2 sm:px-4">
      {posts.map((post) => {
        const author = typeof post.authorId === "string" ? null : post.authorId;
        const displayedComments = expandedComments[post._id]
          ? post.comments
          : post.comments.slice(0, 2);
        // Determine if current user is the post author
        const authorId =
          typeof post.authorId === "string"
            ? post.authorId
            : post.authorId?._id;
        const isAuthor = session?.user?.id === authorId;

        return (
          <div
            key={post._id}
            className="w-full max-w-[600px] bg-white p-3 sm:p-4 rounded-lg shadow-md my-3 sm:my-4 mx-auto"
          >
            {/* Post Header */}
            <div className="flex items-center gap-2 sm:gap-3 justify-between">
              <div className="flex items-center gap-3">
                <Avatar
                // onClick={() => navigateToCase(authorId)}
                >
                  <AvatarImage
                    src={author?.avatar || undefined}
                    alt="Profile"
                    className="object-cover"
                  />
                  <AvatarFallback>
                    {author?.name?.charAt(0).toUpperCase() || "U"}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h2
                    //onClick={() => navigateToCase(authorId)}
                    className="text-lg font-semibold"
                  >
                    {author?.name || "..."}
                  </h2>
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

            {post.mediaType === "video" ? (
              <video controls className="w-full rounded-lg">
                <source src={post.imageUrl} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            ) : (
              <Image
                src={post.imageUrl || ""}
                alt="Post media"
                height={1536}
                width={2048}
                className="rounded-lg w-full h-auto object-contain"
                priority
              />
            )}

            {/* Reaction/Like Section (Ensure Always Visible) */}
            <div className="mt-3 sm:mt-4 border-t border-gray-200 pt-2">
              <div className="flex items-center justify-between text-gray-600 text-xs sm:text-sm px-2">
                <div className="flex items-center gap-1">
                  <HandThumbUpIcon className="w-4 h-4 text-blue-500" />
                  <span>{post.likes.length}</span>
                </div>
                <span>{post.comments.length} Comments</span>
              </div>
              <div className="flex justify-around border-t border-gray-200 mt-2 pt-2">
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
                <button
                  onClick={() => commentInputRefs.current[post._id]?.focus()}
                  className="flex items-center gap-1 px-4 py-2 hover:text-blue-500"
                >
                  <ChatBubbleLeftIcon className="w-5 h-5" />
                  <span>Comment</span>
                </button>
              </div>
            </div>

            {/* Comment Section */}
            <div className="mt-2 sm:mt-3">
              <div className="flex gap-2 items-center">
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
                <input
                  type="text"
                  ref={(el) => {
                    commentInputRefs.current[post._id] = el;
                  }}
                  value={commentTexts[post._id] || ""}
                  onChange={(e) =>
                    setCommentTexts((prev) => ({
                      ...prev,
                      [post._id]: e.target.value,
                    }))
                  }
                  className="border p-2 rounded w-full outline-none text-sm sm:text-base"
                  placeholder="Write a comment..."
                />
                <button
                  onClick={() => handleCommentSubmit(post._id)}
                  disabled={commentLoading === post._id}
                  className="bg-blue-500 text-white px-3 py-1 rounded"
                >
                  {commentLoading === post._id ? "..." : "Post"}
                </button>
              </div>

              {displayedComments.map((comment) => {
                const commentUser =
                  typeof comment.userId === "object"
                    ? comment.userId
                    : { name: "Unknown", avatar: "" };
                return (
                  <div
                    key={comment._id}
                    className="flex items-start gap-2 sm:gap-3 mt-2 sm:mt-3"
                  >
                    <Avatar className="h-6 w-6 sm:h-8 sm:w-8">
                      <AvatarImage
                        src={commentUser?.avatar || undefined}
                        alt="Profile"
                        className="object-cover"
                      />
                      <AvatarFallback>
                        {commentUser?.name?.charAt(0).toUpperCase() || "U"}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      {commentBeingEdited === comment._id ? (
                        <input
                          type="text"
                          value={editingComment[comment._id] || comment.text}
                          onChange={(e) =>
                            setEditingComment({
                              ...editingComment,
                              [comment._id]: e.target.value,
                            })
                          }
                          className="border p-1 rounded w-full outline-none"
                        />
                      ) : (
                        <>
                          <div className="bg-gray-100 p-2 rounded-md text-sm sm:text-base">
                            <p className="font-semibold">
                              {commentUser?.name || "Unknown User"}
                            </p>
                            <p>{comment.text}</p>
                          </div>
                          <span className="text-gray-500 text-[10px]">
                            {formatRelativeTime(comment.createdAt)}
                          </span>
                        </>
                      )}
                      {typeof comment.userId !== "string" &&
                        session?.user?.id === comment.userId._id && (
                          <div className="flex space-x-2 mt-1">
                            {commentBeingEdited === comment._id ? (
                              <>
                                <button
                                  onClick={() =>
                                    handleEditComment(post._id, comment._id)
                                  }
                                  className="text-blue-500 text-xs"
                                >
                                  Save
                                </button>
                                <button
                                  onClick={() => setCommentBeingEdited(null)}
                                  className="text-gray-500 text-xs"
                                >
                                  Cancel
                                </button>
                              </>
                            ) : (
                              <>
                                <button
                                  onClick={() => {
                                    console.log(
                                      "Editing comment ID:",
                                      comment._id
                                    ); // Debugging
                                    if (!comment._id) {
                                      console.error(
                                        "Comment ID is missing!",
                                        comment
                                      );
                                      alert(
                                        "Something went wrong! Comment ID is missing."
                                      );
                                      return;
                                    }
                                    setCommentBeingEdited(comment._id);
                                    setEditingComment({
                                      [comment._id]: comment.text,
                                    });
                                  }}
                                  className="text-blue-500 text-xs"
                                >
                                  Edit
                                </button>
                                <button
                                  onClick={() =>
                                    handleDeleteComment(post._id, comment._id)
                                  }
                                  className="text-red-500 text-xs"
                                >
                                  Delete
                                </button>
                              </>
                            )}
                          </div>
                        )}
                    </div>
                  </div>
                );
              })}

              {/* See all / Hide comments button */}
              {post.comments.length > 2 && (
                <button
                  onClick={() =>
                    setExpandedComments((prev) => ({
                      ...prev,
                      [post._id]: !prev[post._id],
                    }))
                  }
                  className="text-blue-500 text-xs sm:text-sm mt-1"
                >
                  {expandedComments[post._id]
                    ? "Hide comments"
                    : `See all ${post.comments.length} comments`}
                </button>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Posts;
