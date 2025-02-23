import { create } from "zustand";

export interface User {
  _id: string;
  name: string;
  avatar: string;
}

export interface Comment {
  _id: string; // Add this line
  userId: string | User;
  text: string;
  createdAt: string;
}

export interface Post {
  _id: string;
  authorId: string | User;
  description: string;
  imageUrl?: string;
  likes: string[];
  comments: Comment[];
  createdAt: string;
  updatedAt: string;
}

interface PostState {
  posts: Post[];
  addPost: (post: Post) => void;
  setPosts: (posts: Post[]) => void;
}

const usePostStore = create<PostState>((set) => ({
  posts: [],
  addPost: (post) => set((state) => ({ posts: [post, ...state.posts] })),
  setPosts: (posts) => set({ posts: posts ?? [] }),
}));

export default usePostStore;
