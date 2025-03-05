import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { EllipsisVertical, Pencil, Trash2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useRouter } from "next/navigation";
import { ReportDialog } from "./ReportDialog";
import { formatPostTime } from "@/lib/formatTime";

interface AuthorProps {
  _id: string; // Now required
  name?: string;
  avatar?: string;
}

interface PostHeaderProps {
  createdAt: string;
  author: AuthorProps;
  postId: string;
  isAdmin: boolean;
  isAuthor: boolean;
  onDelete: (postId: string) => void;
  onReport: (postId: string, reason: string) => void;
  description: string;
  onEdit: (postId: string, description: string) => void;
}

const PostHeader = ({
  createdAt,
  author,
  postId,
  isAdmin,
  isAuthor,
  onDelete,
  onReport,
  onEdit,
  description,
}: PostHeaderProps) => {
  const router = useRouter();

  const navigateToProfile = (id: string) => {
    router.push(`/dashboard/profile/${id}`);
  };

  return (
    <div className="flex items-center gap-2 sm:gap-3 justify-between">
      <div className="flex items-center gap-3 cursor-pointer">
        <Avatar onClick={() => navigateToProfile(author?._id)}>
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
            onClick={() => navigateToProfile(author?._id)}
            className="text-lg font-semibold"
          >
            {author?.name || "..."}
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {formatPostTime(createdAt)}
          </p>
        </div>
      </div>

      {isAdmin && (
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <button className="text-red-600 hover:text-red-800">
              <Trash2 size={20} />
            </button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete the
                post.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={() => onDelete(postId)}>
                Continue
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}

      {!isAdmin && (
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
                    //onClick={() => onEdit(postId, author.description)}
                    onClick={() => onEdit(postId, description)}
                  >
                    <Pencil size={16} /> Edit Post
                  </button>
                </DropdownMenuItem>

                <DropdownMenuItem asChild>
                  <AlertDialog>
                    <AlertDialogTrigger className="w-full flex items-center gap-2 text-red-600 hover:bg-gray-100 p-2 rounded">
                      <Trash2 size={16} /> Delete Post
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This action cannot be undone. The post will be
                          permanently deleted.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={() => onDelete(postId)}>
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </DropdownMenuItem>
              </>
            ) : (
              <>
                <DropdownMenuItem
                  onSelect={(e) => e.preventDefault()}
                  className="flex items-center gap-2 text-yellow-500 hover:bg-gray-100 p-2 rounded"
                >
                  <div
                    className="flex justify-between items-center w-full"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <ReportDialog
                      postId={postId}
                      onReport={(reason) => onReport(postId, reason)}
                    />
                  </div>
                </DropdownMenuItem>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </div>
  );
};

export default PostHeader;
