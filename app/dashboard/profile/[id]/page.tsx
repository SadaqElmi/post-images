"use client";

import { useParams, useRouter } from "next/navigation";

import Loading from "@/app/loading";
import ProfileComponent from "./ProfileComponent";
import PostsComponent from "./PostsComponent";

const ProfilePage = () => {
  const params = useParams();
  const { id } = params as { id: string };
  const router = useRouter();

  if (status === "loading") return <Loading />;
  if (status === "unauthenticated") router.push("/login");

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div>
        <ProfileComponent userId={id} />
        <PostsComponent userId={id} />
      </div>
    </div>
  );
};

export default ProfilePage;
