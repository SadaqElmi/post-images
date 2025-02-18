import { Schema, model, models, Document } from "mongoose";
import bcrypt from "bcryptjs";

// User Interface for TypeScript
interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  avatar?: string;
  role: "user" | "admin";
  comparePassword: (candidatePassword: string) => Promise<boolean>;
}

// User Schema
const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    avatar: { type: String, default: "/default-avatar.png" }, // Optional profile image
    role: { type: String, enum: ["user", "admin"], default: "user" },
  },
  { timestamps: true }
);

// Hash password before saving
UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare password method for login validation
UserSchema.methods.comparePassword = async function (
  candidatePassword: string
) {
  return bcrypt.compare(candidatePassword, this.password);
};

// Prevent duplicate model creation in Next.js
const User = models.User || model<IUser>("User", UserSchema);

export default User;
