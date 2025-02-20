import { Schema, model, models, Document, Types } from "mongoose";

interface IComment {
  userId: Types.ObjectId;
  text: string;
  createdAt: Date;
}

interface IPost extends Document {
  authorId: Types.ObjectId;
  description: string;
  imageUrl?: string;
  likes: Types.ObjectId[];
  comments: IComment[];
  createdAt: Date;
  updatedAt: Date;
}

const CommentSchema = new Schema<IComment>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    text: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
  },
  { _id: false }
);

const PostSchema = new Schema<IPost>(
  {
    authorId: { type: Schema.Types.ObjectId, ref: "User", required: false },
    description: { type: String, required: true },
    imageUrl: { type: String },
    likes: [{ type: Schema.Types.ObjectId, ref: "User" }], // Array of users who liked the post
    comments: [CommentSchema], // Array of comments (userId, text, createdAt)
  },
  { timestamps: true }
);

const Post = models.Post || model<IPost>("Post", PostSchema);

export default Post;
