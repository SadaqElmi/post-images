import { formatRelativeTime } from "@/lib/formatRelativeTime";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useSession } from "next-auth/react";
import type { Comment as IComment } from "@/app/store/postStore";
import { useRouter } from "next/navigation";

interface CommentDisplayProps {
  comment: IComment;
  postId: string;
  onEdit: (postId: string, commentId: string) => void;
  onDelete: (postId: string, commentId: string) => void;
  editingComment: Record<string, string>;
  commentBeingEdited: string | null;
  setEditingComment: React.Dispatch<
    React.SetStateAction<Record<string, string>>
  >;
  setCommentBeingEdited: React.Dispatch<React.SetStateAction<string | null>>;
}

const CommentDisplay = ({
  comment,
  postId,
  onEdit,
  onDelete,
  editingComment,
  commentBeingEdited,
  setEditingComment,
  setCommentBeingEdited,
}: CommentDisplayProps) => {
  const { data: session } = useSession();
  const router = useRouter();
  const navigateToProfile = (id: string) => {
    router.push(`/dashboard/profile/${id}`);
  };
  // Check if the current user is the comment author
  const isCommentAuthor =
    typeof comment.userId !== "string" &&
    session?.user?.id === comment.userId._id;

  return (
    <div className="flex items-start gap-2 mt-3">
      {/* Avatar */}
      <Avatar className="h-6 w-6">
        <AvatarImage
          src={comment.userId?.avatar}
          className="object-cover"
          onClick={() => {
            navigateToProfile(comment.userId._id);
          }}
        />
        <AvatarFallback>{comment.userId?.name?.[0] || "U"}</AvatarFallback>
      </Avatar>

      <div className="flex-1">
        {/* Edit Mode */}
        {commentBeingEdited === comment._id ? (
          <input
            type="text"
            value={editingComment[comment._id] || ""}
            onChange={(e) =>
              setEditingComment({
                ...editingComment,
                [comment._id]: e.target.value,
              })
            }
            className="border p-1 rounded w-full outline-none dark:bg-[#333334] dark:border-none dark:outline-none"
          />
        ) : (
          <div className="bg-gray-100 p-2 rounded-md dark:bg-[#333334]">
            <p className="font-bold text-xs">{comment?.userId?.name}</p>
            <p className="text-xs">{comment.text}</p>
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center gap-3 mt-1">
          <span className="text-gray-500 text-[10px]">
            {formatRelativeTime(comment.createdAt)}
          </span>

          {isCommentAuthor && (
            <div className="flex space-x-2">
              {commentBeingEdited === comment._id ? (
                <>
                  <button
                    onClick={() => onEdit(postId, comment._id)}
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
                      setCommentBeingEdited(comment._id);
                      setEditingComment({
                        ...editingComment,
                        [comment._id]: comment.text,
                      });
                    }}
                    className="text-blue-500 text-xs"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => onDelete(postId, comment._id)}
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
    </div>
  );
};

export default CommentDisplay;
