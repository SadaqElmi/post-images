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
    authorId: { type: Schema.Types.ObjectId, ref: "User" },
    description: { type: String, required: true },
    imageUrl: { type: String, default: null },
    likes: [{ type: Schema.Types.ObjectId, ref: "User", default: [] }],
    comments: { type: [CommentSchema], default: [] },
  },
  { timestamps: true }
);

const Post = models.Post || model<IPost>("Post", PostSchema);

export default Post;
