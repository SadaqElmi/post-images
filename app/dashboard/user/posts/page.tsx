"use client";

import Image from "next/image";
import { useEffect, useState, useRef } from "react";
import usePostStore, { User, Post, Comment } from "@/app/store/postStore";
import axios from "axios";
import { formatPostTime } from "@/lib/formatTime";
import { formatRelativeTime } from "@/lib/formatRelativeTime";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useSession } from "next-auth/react";
import {
  HandThumbUpIcon,
  ChatBubbleLeftIcon,
} from "@heroicons/react/24/outline";

const Posts = () => {
  const { posts, setPosts } = usePostStore();
  const { data: session } = useSession();

  // State for comment texts (keyed by post ID)
  const [commentTexts, setCommentTexts] = useState<Record<string, string>>({});
  const [commentLoading, setCommentLoading] = useState<string | null>(null);
  // State for tracking which post is currently being liked
  const [likingPostId, setLikingPostId] = useState<string | null>(null);
  // State to track whether comments are expanded for each post
  const [expandedComments, setExpandedComments] = useState<
    Record<string, boolean>
  >({});

  // Create a ref object to hold references to each comment input
  const commentInputRefs = useRef<Record<string, HTMLInputElement | null>>({});

  const [editingComment, setEditingComment] = useState<Record<string, string>>(
    {}
  );
  const [commentBeingEdited, setCommentBeingEdited] = useState<string | null>(
    null
  );

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
      const updatedPosts = posts.map((p) =>
        p._id === postId
          ? {
              ...p,
              comments: p.comments.map((c) =>
                c._id === tempId
                  ? {
                      ...c,
                      _id: data.comments[data.comments.length - 1]._id, // Use actual ID from backend
                    }
                  : c
              ),
            }
          : p
      ) as Post[];
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
  return (
    <div className="flex flex-col items-center w-full">
      {posts.map((post) => {
        // Determine the post's author; if authorId is a string, data is not populated.
        const author = typeof post.authorId === "string" ? null : post.authorId;
        // Determine which comments to display: if expanded, show all; otherwise, only first 2.
        const displayedComments = expandedComments[post._id]
          ? post.comments
          : post.comments.slice(0, 2);

        return (
          <div
            key={post._id}
            className="w-[500px] bg-white p-4 rounded-lg shadow-md my-4"
          >
            {/* Post Header */}
            <div className="flex items-center gap-3">
              <Avatar>
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
                <h2 className="text-lg font-semibold">
                  {author?.name || "Unknown User"}
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

            {/* Reaction/Like Count Section */}
            <div className="mt-4 border-t border-gray-200 pt-2">
              <div className="flex items-center justify-between text-gray-600 text-sm px-2">
                <div className="flex items-center space-x-1">
                  <HandThumbUpIcon className="w-4 h-4 text-blue-500" />
                  <span className="ml-1">{post.likes.length}</span>
                </div>
                <div className="flex items-center space-x-4">
                  <span>{post.comments.length} Comments</span>
                </div>
              </div>
              <div className="flex justify-around border-t border-gray-200 mt-2 pt-2 text-gray-600 text-sm">
                <button
                  onClick={() => handleLike(post._id)}
                  disabled={likingPostId === post._id}
                  className={`flex items-center space-x-1 px-10 py-2 rounded ${
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
                  className="flex items-center space-x-1 hover:text-blue-500"
                >
                  <ChatBubbleLeftIcon className="w-5 h-5" />
                  <span>Comment</span>
                </button>
              </div>
            </div>

            {/* Comment Section */}
            <div className="mt-3">
              <div className="flex gap-2 items-center">
                <Avatar>
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
                  placeholder="Write a comment..."
                  className="border p-1 rounded w-full outline-none"
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
                console.log("Comment ID:", comment._id); // Debugging
                const commentUser =
                  typeof comment.userId === "object"
                    ? comment.userId
                    : { name: "Unknown", avatar: "" };
                return (
                  <div
                    key={comment._id}
                    className="flex items-start gap-3 mt-3"
                  >
                    <Avatar>
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
                        <div className="bg-gray-100 p-2 rounded-md">
                          <p className="font-semibold">
                            {commentUser?.name || "Unknown User"}
                          </p>
                          <p>{comment.text}</p>
                        </div>
                      )}
                      <span className="text-gray-500 text-[10px]">
                        {formatRelativeTime(comment.createdAt)}
                      </span>
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
                  className="text-blue-500 text-sm mt-1"
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
