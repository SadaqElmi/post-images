import { Schema, model, models } from "mongoose";
import bcrypt from "bcryptjs";

const UserSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, unique: true, required: true },
    password: { type: String, required: false },
    avatar: {
      type: String,
      default: "https://github.com/shadcn.png",
    },
    role: { type: String, enum: ["user", "admin"], default: "user" },
  },
  { timestamps: true }
);

UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  if (typeof this.password === "string") {
    this.password = await bcrypt.hash(this.password, salt);
  }
  next();
});

const User = models.User || model("User", UserSchema);

export default User;
