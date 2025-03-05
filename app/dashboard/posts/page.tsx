"use client";

import Image from "next/image";
import { useEffect, useState, useRef } from "react";
import usePostStore, { Post, Comment } from "@/app/store/postStore";
import axios from "axios";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useSession } from "next-auth/react";
import {
  HandThumbUpIcon,
  ChatBubbleLeftIcon,
} from "@heroicons/react/24/outline";

import { useRouter } from "next/navigation";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import toast from "react-hot-toast";
import CommentDisplay from "./components/Comment";
import PostHeader from "./components/PostHeader";
import PostDescription from "./components/PostDescription";
import { translations } from "@/utils/translations";
import useLanguageStore from "@/app/store/languageStore";

const Posts = () => {
  const { posts, setPosts } = usePostStore();
  const { data: session } = useSession();
  const isAdmin = session?.user?.role === "admin";
  const router = useRouter();

  const { language } = useLanguageStore();
  const t = translations[language];

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

  const [likedUsers, setLikedUsers] = useState<
    Array<{ _id: string; name: string; avatar: string }>
  >([]);
  const [isLikesDialogOpen, setIsLikesDialogOpen] = useState(false);
  const [isLoadingLikes, setIsLoadingLikes] = useState(false);

  const fetchLikedUsers = async (postId: string) => {
    try {
      setIsLoadingLikes(true);
      const post = posts.find((p) => p._id === postId);
      if (!post) return;

      const { data } = await axios.post("/api/users", {
        userIds: post.likes,
      });

      console.log("Liked Users Data:", data); // Check if _id exists
      setLikedUsers(data);
      setIsLikesDialogOpen(true);
    } catch (error) {
      console.error("Failed to fetch liked users", error);
    } finally {
      setIsLoadingLikes(false);
    }
  };

  const navigateToProfile = (id: string) => {
    router.push(`/dashboard/profile/${id}`);
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
      toast.success("success to edit comment");
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

  const handleReport = async (postId: string, reason: string) => {
    try {
      await axios.post("/api/reports", { postId, reason });
      toast.success("Report submitted successfully");
    } catch (error) {
      console.error("Failed to submit report", error);
      alert("Failed to submit report");
    }
  };
  if (!session) return <div>Please log in to view posts</div>;
  return (
    <div className="flex flex-col items-center w-full px-2 sm:px-4 ">
      {posts.map((post) => {
        //const author = typeof post.authorId === "string" ? null : post.authorId;
        const author =
          typeof post.authorId === "string"
            ? { _id: post.authorId, name: "..." }
            : post.authorId;
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
            className="w-full max-w-[600px] bg-white p-3 sm:p-4 rounded-lg shadow-md my-3 sm:my-4 mx-auto dark:bg-[#252728]"
          >
            <PostHeader
              createdAt={post.createdAt}
              author={author}
              postId={post._id}
              isAdmin={isAdmin}
              isAuthor={isAuthor}
              onDelete={handleDeletePost}
              onReport={handleReport}
              description={post.description} // Add this line
              onEdit={(postId) => {
                setEditingPostId(postId);
                setEditedDescription(post.description); // Use the post's description
              }}
            />

            {/* Post Description */}
            <PostDescription
              postId={post._id}
              description={post.description}
              isEditing={editingPostId === post._id}
              editedDescription={editedDescription}
              setEditedDescription={setEditedDescription}
              onSave={handleSavePost}
              onCancel={() => {
                setEditingPostId(null);
                setEditedDescription("");
              }}
            />

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

            {/* Reaction/Like Section (Ensure Always Visible) */}
            <div className="mt-3 sm:mt-4 border-t border-gray-200 pt-2">
              <div className="flex items-center justify-between text-gray-600 text-xs sm:text-sm px-2">
                <div
                  className="flex items-center gap-1 cursor-pointer hover:underline"
                  onClick={() => fetchLikedUsers(post._id)}
                >
                  <HandThumbUpIcon className="w-4 h-4 text-blue-500" />
                  <span className="dark:text-gray-400">
                    {post.likes.length}
                  </span>
                </div>
                <span className="dark:text-gray-400">
                  {post.comments.length} {t.comments}
                </span>
              </div>
              <div className="flex justify-around border-t border-gray-200 mt-2 pt-2">
                <button
                  onClick={() => handleLike(post._id)}
                  disabled={likingPostId === post._id}
                  className={`flex items-center gap-1 px-4 py-2 rounded ${
                    session?.user && post.likes.includes(session.user.id)
                      ? "bg-blue-500 text-white dark:text-blue-500 dark:bg-gray-700"
                      : "bg-transparent hover:text-blue-500 dark:text-gray-400"
                  }`}
                >
                  <HandThumbUpIcon className="w-5 h-5" />
                  <span>{t.like}</span>
                </button>
                <button
                  onClick={() => commentInputRefs.current[post._id]?.focus()}
                  className="flex items-center gap-1 px-4 py-2 hover:text-blue-500 dark:text-gray-400"
                >
                  <ChatBubbleLeftIcon className="w-5 h-5" />
                  <span>{t.comment}</span>
                </button>
              </div>
            </div>

            {/* Comment Section */}
            <div className="mt-2 sm:mt-3">
              <div className="flex gap-2 items-center cursor-pointer">
                <Avatar className="h-8 w-8 sm:h-10 sm:w-10 ">
                  <AvatarImage
                    src={session?.user?.avatar || undefined}
                    alt="Profile"
                    className="object-cover"
                    onClick={() =>
                      session?.user?.id && navigateToProfile(session.user.id)
                    }
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
                  className="border p-2 rounded w-full outline-none text-sm sm:text-base dark:bg-[#333334] dark:outline-none dark:border-none"
                  placeholder={t.input}
                />
                <button
                  onClick={() => handleCommentSubmit(post._id)}
                  disabled={commentLoading === post._id}
                  className="bg-blue-500 text-white px-3 py-1 rounded    dark:bg-blue-500 dark:text-white"
                >
                  {commentLoading === post._id ? "..." : t.btn}
                </button>
              </div>

              {displayedComments.map((comment) => (
                <CommentDisplay
                  key={comment._id}
                  comment={comment}
                  postId={post._id}
                  onEdit={handleEditComment}
                  onDelete={handleDeleteComment}
                  editingComment={editingComment}
                  commentBeingEdited={commentBeingEdited}
                  setEditingComment={setEditingComment}
                  setCommentBeingEdited={setCommentBeingEdited}
                />
              ))}

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
                  {expandedComments[post._id] ? t.hide : t.all}
                </button>
              )}
            </div>
          </div>
        );
      })}
      {/* Likes Dialog */}
      <Dialog open={isLikesDialogOpen} onOpenChange={setIsLikesDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t.usersLikes}</DialogTitle>
          </DialogHeader>

          <div className="max-h-[400px] overflow-y-auto">
            {isLoadingLikes
              ? Array(3)
                  .fill(0)
                  .map((_, i) => (
                    <div key={i} className="flex items-center gap-3 p-2">
                      <Skeleton className="h-10 w-10 rounded-full" />
                      <Skeleton className="h-4 w-[200px]" />
                    </div>
                  ))
              : likedUsers.map((user) => (
                  <div
                    key={user._id}
                    className="flex items-center gap-3 p-2 hover:bg-gray-100 dark:hover:bg-[#252728] rounded cursor-pointer"
                  >
                    <Avatar
                      onClick={() => {
                        navigateToProfile(user._id);
                      }}
                    >
                      <AvatarImage src={user.avatar} className="object-cover" />
                      <AvatarFallback>{user.name[0]}</AvatarFallback>
                    </Avatar>
                    <span className="font-medium">{user.name}</span>
                  </div>
                ))}

            {!isLoadingLikes && likedUsers.length === 0 && (
              <p className="text-center text-gray-500">{t.nolikes}</p>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Posts;
