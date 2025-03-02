"use client";
import { useEffect } from "react";
import { useSession, signOut } from "next-auth/react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import useAuthStore from "@/app/store/authStore";
import { HomeIcon, Info, PlusCircle } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import useLanguageStore from "@/app/store/languageStore";
import { translations } from "@/utils/translations";
import { useThemeStore } from "@/app/store/themeStore";

const Header = () => {
  const { data: session } = useSession();
  const { user, setUser, clearUser } = useAuthStore();
  const isAdmin = user?.role === "admin";

  const { language, toggleLanguage } = useLanguageStore();
  const t = translations[language];
  const { darkMode, toggleDarkMode } = useThemeStore();

  useEffect(() => {
    const html = document.documentElement;
    if (darkMode) {
      html.classList.add("dark");
    } else {
      html.classList.remove("dark");
    }
  }, [darkMode]);

  useEffect(() => {
    if (session && session.user) {
      console.log("Session user:", session.user);
      setUser({
        ...session.user,
        coverImage: session.user.coverImage || "",
      });
    }
  }, [session, setUser]);

  const handleLogout = async () => {
    await signOut({ callbackUrl: "/" });
    clearUser();
  };

  return (
    <header className="flex justify-between items-center px-4 sm:px-6 py-4 bg-white dark:bg-[#252728] shadow-sm">
      {/* Mobile Menu */}
      <div className="md:hidden flex  items-center w-full">
        {/* Logo (Separate from Icons) */}
        <Link href={isAdmin ? "/dashboard/admin" : "/dashboard/user"}>
          <div className="bg-white text-[#1877f2] rounded-full h-8 w-8 flex items-center justify-center font-bold text-xl">
            F
          </div>
        </Link>

        {/* Mobile Navigation (Icons) */}
        <div className="flex gap-5 items-center justify-center w-full">
          <Link
            href="/dashboard/user"
            className="p-2 hover:bg-gray-100 rounded-md flex items-center justify-center"
          >
            <HomeIcon className="h-6 w-6 text-[#1877f2]" />
          </Link>
          <Link
            href="/dashboard/user/createpost"
            className="p-2 hover:bg-gray-100 rounded-md flex items-center justify-center"
          >
            <PlusCircle className="h-6 w-6 text-[#1877f2]" />
          </Link>
          <Link
            href="/dashboard/user/about"
            className="p-2 hover:bg-gray-100 rounded-md flex items-center justify-center"
          >
            <Info className="h-6 w-6 text-[#1877f2]" />
          </Link>
        </div>
      </div>

      {/* Desktop Logo */}
      <Link
        href={isAdmin ? "/dashboard/admin" : "/dashboard/user"}
        className="hidden md:block"
      >
        <h1 className="text-lg font-semibold">
          {isAdmin ? t.adminPanel : t.home}
        </h1>
      </Link>

      {/* Desktop Navigation */}
      <div className="hidden md:flex gap-4">
        {isAdmin ? (
          <Link href="/dashboard/posts">
            <Button variant="ghost" className="dark:text-white">
              Maamul Qoraalada
            </Button>
          </Link>
        ) : (
          <>
            <Link href="/dashboard/user/createpost">
              <Button variant="ghost">{t.createPost}</Button>
            </Link>
            <Link
              href={
                isAdmin ? "/dashboard/admin/about" : "/dashboard/user/about"
              }
            >
              <Button variant="ghost">{t.aboutUs}</Button>
            </Link>
          </>
        )}
      </div>

      {/* User Section */}
      <div className="flex items-center gap-2 sm:gap-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Avatar className="h-8 w-8 sm:h-10 sm:w-10 cursor-pointer object-cover">
              <AvatarImage
                src={user?.avatar}
                alt="astaanta guud"
                className="object-cover"
              />
              <AvatarFallback className="dark:text-white">
                {user?.name?.charAt(0).toUpperCase() || (isAdmin ? "A" : "U")}
              </AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56">
            <DropdownMenuLabel>{t.account}</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <Link href="/dashboard/profile">
                <DropdownMenuItem>
                  {t.profile}
                  <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
                </DropdownMenuItem>
              </Link>
              <Link href="/dashboard/Settings">
                <DropdownMenuItem>
                  {t.settings}
                  <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
                </DropdownMenuItem>
              </Link>
            </DropdownMenuGroup>

            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                <div
                  className="flex justify-between items-center w-full"
                  onClick={(e) => e.stopPropagation()}
                >
                  Dark Mode
                  <DropdownMenuShortcut>
                    <label className="inline-flex items-center relative">
                      <input
                        className="peer hidden"
                        id="toggle"
                        type="checkbox"
                        checked={darkMode}
                        onChange={() => toggleDarkMode()}
                      />
                      <div className="relative w-[80px] h-[35px] bg-white peer-checked:bg-zinc-500 rounded-full after:absolute after:content-[''] after:w-[20px] after:h-[20px] after:bg-gradient-to-r from-orange-500 to-yellow-400 peer-checked:after:from-zinc-900 peer-checked:after:to-zinc-900 after:rounded-full after:top-[7px] after:left-[11px] active:after:w-[50px] peer-checked:after:left-[68px] peer-checked:after:translate-x-[-100%] shadow-sm duration-300 after:duration-300 after:shadow-md" />
                      <svg
                        height={0}
                        width={50}
                        viewBox="0 0 24 24"
                        data-name="Layer 1"
                        id="Layer_1"
                        xmlns="http://www.w3.org/2000/svg"
                        className="fill-white peer-checked:opacity-60 absolute w-[10px] h-[10px] left-[16px]"
                      >
                        <path d="M12,17c-2.76,0-5-2.24-5-5s2.24-5,5-5,5,2.24,5,5-2.24,5-5,5ZM13,0h-2V5h2V0Zm0,19h-2v5h2v-5ZM5,11H0v2H5v-2Zm19,0h-5v2h5v-2Zm-2.81-6.78l-1.41-1.41-3.54,3.54,1.41,1.41,3.54-3.54ZM7.76,17.66l-1.41-1.41-3.54,3.54,1.41,1.41,3.54-3.54Zm0-11.31l-3.54-3.54-1.41,1.41,3.54,3.54,1.41-1.41Zm13.44,13.44l-3.54-3.54-1.41,1.41,3.54,3.54,1.41-1.41Z" />
                      </svg>
                      <svg
                        height={50}
                        width={50}
                        viewBox="0 0 24 24"
                        data-name="Layer 1"
                        id="Layer_1"
                        xmlns="http://www.w3.org/2000/svg"
                        className="fill-black opacity-60 peer-checked:opacity-70 peer-checked:fill-white absolute w-[10px] h-[10px] right-[16px]"
                      >
                        <path d="M12.009,24A12.067,12.067,0,0,1,.075,10.725,12.121,12.121,0,0,1,10.1.152a13,13,0,0,1,5.03.206,2.5,2.5,0,0,1,1.8,1.8,2.47,2.47,0,0,1-.7,2.425c-4.559,4.168-4.165,10.645.807,14.412h0a2.5,2.5,0,0,1-.7,4.319A13.875,13.875,0,0,1,12.009,24Zm.074-22a10.776,10.776,0,0,0-1.675.127,10.1,10.1,0,0,0-8.344,8.8A9.928,9.928,0,0,0,4.581,18.7a10.473,10.473,0,0,0,11.093,2.734.5.5,0,0,0,.138-.856h0C9.883,16.1,9.417,8.087,14.865,3.124a.459.459,0,0,0,.127-.465.491.491,0,0,0-.356-.362A10.68,10.68,0,0,0,12.083,2ZM20.5,12a1,1,0,0,1-.97-.757l-.358-1.43L17.74,9.428a1,1,0,0,1,.035-1.94l1.4-.325.351-1.406a1,1,0,0,1,1.94,0l.355,1.418,1.418.355a1,1,0,0,1,0,1.94l-1.418.355-.355,1.418A1,1,0,0,1,20.5,12ZM16,14a1,1,0,0,0,2,0A1,1,0,0,0,16,14Zm6,4a1,1,0,0,0,2,0A1,1,0,0,0,22,18Z" />
                      </svg>
                    </label>
                  </DropdownMenuShortcut>
                </div>
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                <div
                  className="flex justify-between items-center w-full"
                  onClick={(e) => e.stopPropagation()}
                >
                  Languages
                  <DropdownMenuShortcut>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">SO</span>
                      <Switch
                        checked={language === "en"}
                        onCheckedChange={toggleLanguage}
                        aria-label="Toggle language"
                      />
                      <span className="text-sm font-medium">EN</span>
                    </div>
                  </DropdownMenuShortcut>
                </div>
              </DropdownMenuItem>
            </DropdownMenuGroup>

            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout}>
              {t.logout}
              <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};

export default Header;
