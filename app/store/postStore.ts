import { create } from "zustand";

interface Post {
  _id: string;
  authorId: string;
  description: string;
  imageUrl?: string;
  likes: string[];
  comments: { userId: string; text: string; createdAt: string }[];
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
  setPosts: (posts) => set({ posts }),
}));

export default usePostStore;
