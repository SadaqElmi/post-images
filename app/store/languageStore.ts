import { create } from "zustand";

type LanguageState = {
  language: "en" | "so";
  setLanguage: (lang: "en" | "so") => void;
  toggleLanguage: () => void;
};

const useLanguageStore = create<LanguageState>((set) => ({
  language: "en",
  setLanguage: (lang) => set({ language: lang }),
  toggleLanguage: () =>
    set((state) => ({
      language: state.language === "en" ? "so" : "en",
    })),
}));

export default useLanguageStore;
