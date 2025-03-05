interface PostDescriptionProps {
  postId: string;
  description: string;
  isEditing: boolean;
  editedDescription: string;
  setEditedDescription: (desc: string) => void;
  onSave: (postId: string) => void;
  onCancel: () => void;
}

const PostDescription = ({
  postId,
  description,
  isEditing,
  editedDescription,
  setEditedDescription,
  onSave,
  onCancel,
}: PostDescriptionProps) => {
  return isEditing ? (
    <div className="py-3 sm:py-4">
      <textarea
        value={editedDescription}
        onChange={(e) => setEditedDescription(e.target.value)}
        className="w-full p-2 border rounded-lg text-base sm:text-lg dark:bg-[#252728]"
        rows={3}
      />
      <div className="flex gap-2 mt-2">
        <button
          onClick={() => onSave(postId)}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
        >
          Save
        </button>
        <button
          onClick={onCancel}
          className="bg-gray-200 px-4 py-2 rounded-lg hover:bg-gray-300 dark:bg-[#3d4041]"
        >
          Cancel
        </button>
      </div>
    </div>
  ) : (
    <p className="py-3 sm:py-4 text-base sm:text-lg">{description}</p>
  );
};

export default PostDescription;
