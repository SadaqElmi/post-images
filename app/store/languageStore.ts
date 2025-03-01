// store/languageStore.ts
import { create } from "zustand";

interface LanguageState {
  language: "en" | "so";
  toggleLanguage: () => void;
}

const useLanguageStore = create<LanguageState>((set) => ({
  language:
    ((typeof window !== "undefined"
      ? localStorage.getItem("language")
      : "en") as "en" | "so") || "en",
  toggleLanguage: () =>
    set((state) => {
      const newLang = state.language === "en" ? "so" : "en";
      if (typeof window !== "undefined") {
        localStorage.setItem("language", newLang);
      }
      return { language: newLang };
    }),
}));

export default useLanguageStore;
