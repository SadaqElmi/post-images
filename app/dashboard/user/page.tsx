"use client";
import React from "react";
import Posts from "./posts/page";
import { useSession } from "next-auth/react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import useAuthStore from "@/app/store/authStore";
const Users = () => {
  const { data: session, status } = useSession();
  const { setUser, user } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (status === "authenticated" && session?.user) {
      setUser({
        id: session.user.id,
        name: session.user.name,
        email: session.user.email,
        role: session.user.role,
      });
    }
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, session, setUser, router]);

  if (status === "loading") return <p>Loading...</p>;
  return (
    <div className="flex justify-center flex-col w-full items-center">
      <Posts />
    </div>
  );
};

export default Users;
