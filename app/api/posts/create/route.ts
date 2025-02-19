import { NextApiRequest } from "next";
import Post from "@/app/models/Post";
import { connectDB } from "@/lib/mongodb";
import cloudinary from "@/lib/cloudinary";
