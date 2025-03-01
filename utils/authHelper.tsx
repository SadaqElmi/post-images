"use client";

import { SessionProvider } from "next-auth/react";

type NextAuthSessionProviderProps = {
  children: React.ReactNode;
};

const NextAuthSessionProvider = (props: NextAuthSessionProviderProps) => {
  return <SessionProvider>{props.children}</SessionProvider>;
};
export default NextAuthSessionProvider;
