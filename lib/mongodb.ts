import mongoose from "mongoose";

export const connectDB = async () => {
  if (mongoose.connection.readyState === 1) {
    console.log("Already connected to DB");
    return;
  }

  try {
    await mongoose.connect(process.env.MONGO_URI!);
    console.log("MongoDB Connected Successfully...");
  } catch (error) {
    console.error("DB Connection Error:", error);
    throw new Error("Database connection failed");
  }
};
