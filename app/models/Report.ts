import { Schema, model, models, Document, Types } from "mongoose";

export interface IReport extends Document {
  postId: Types.ObjectId;
  reportedBy: Types.ObjectId;
  reason: string;
  status: "pending" | "resolved";
  adminAction?: "deleted" | "ignored" | "userBanned" | "unbanned";
  createdAt: Date;
  updatedAt: Date;
}

const ReportSchema = new Schema<IReport>(
  {
    postId: { type: Schema.Types.ObjectId, ref: "Post", required: true },
    reportedBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
    reason: { type: String, required: true },
    status: { type: String, enum: ["pending", "resolved"], default: "pending" },
    adminAction: {
      type: String,
      enum: ["deleted", "ignored", "userBanned", , "unbanned"],
    },
  },
  { timestamps: true }
);

const Report = models.Report || model<IReport>("Report", ReportSchema);

export default Report;
