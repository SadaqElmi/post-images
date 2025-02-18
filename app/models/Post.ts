import { Schema, model, models, Document } from "mongoose";

// TypeScript Interface for the Post
interface IPost extends Document {
  title: string;
  description: string;
  imageUrl?: string;
  authorId: Schema.Types.ObjectId;
  likes?: number;
  comments?: number;
}

// Post Schema
const PostSchema = new Schema<IPost>(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    imageUrl: { type: String, default: "" }, // Optional image URL
    authorId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    likes: { type: Number, default: 0 },
    comments: { type: Number, default: 0 },
  },
  { timestamps: true }
);

// Prevent duplicate model creation in Next.js
const Post = models.Post || model<IPost>("Post", PostSchema);

export default Post;
