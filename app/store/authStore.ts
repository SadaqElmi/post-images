import { create } from "zustand";

interface AuthState {
  user: {
    id?: string;
    name?: string;
    email?: string;
    role?: string;
    avatar?: string;
    coverImage?: string;
    darkMode?: boolean;
    language?: string;
  } | null;
  setUser: (user: AuthState["user"]) => void;
  clearUser: () => void;
}

const useAuthStore = create<AuthState>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
  clearUser: () => set({ user: null }),
}));

export default useAuthStore;
