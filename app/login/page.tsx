"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";

const Login = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });
    if (result?.error) {
      toast.error(result.error);
    } else {
      toast.success("Login successful!");
      router.push("/dashboard/user");
    }

    setLoading(false);
  };

  const handleGoogleLogin = async () => {
    await signIn("google", { callbackUrl: "/dashboard/user" });
  };
  return (
    <div className="flex justify-center items-center mt-20">
      <Card className="w-[350px]">
        <CardHeader>
          <CardTitle>Login</CardTitle>
          <CardDescription>
            Sign in to your account to continue.
          </CardDescription>
          <Button
            variant="outline"
            className="w-full mt-10 "
            onClick={handleGoogleLogin}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 48 48"
              width="24px"
              height="24px"
            >
              <path
                fill="#4285F4"
                d="M24 9.5c3.54 0 6.56 1.22 9.01 3.62l6.64-6.64C34.61 2.13 29.66 0 24 0 14.95 0 7.13 5.66 3.28 13.86l7.89 6.13C13.13 13.44 18.13 9.5 24 9.5z"
              />
              <path
                fill="#34A853"
                d="M46.4 24.48c0-1.58-.14-3.12-.4-4.62H24v9.05h12.76c-.59 2.99-2.23 5.51-4.76 7.17l7.73 5.98c4.53-4.17 7.67-10.32 7.67-17.58z"
              />
              <path
                fill="#FBBC05"
                d="M11.17 28.31c-.82-2.42-1.29-4.98-1.29-7.62s.47-5.2 1.29-7.62L3.28 7.86C1.2 12.1 0 17.02 0 22c0 4.98 1.2 9.9 3.28 14.14l7.89-6.13z"
              />
              <path
                fill="#EA4335"
                d="M24 48c5.66 0 10.61-1.87 14.65-5.05l-7.73-5.98c-2.13 1.44-4.84 2.3-6.92 2.3-5.87 0-10.87-3.94-12.83-9.5l-7.89 6.13C7.13 42.34 14.95 48 24 48z"
              />
            </svg>
            Login with Google
          </Button>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="grid w-full items-center gap-4">
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>
            <CardFooter className="flex flex-col justify-between mt-4 w-full gap-4">
              <Button className="w-full" type="submit" disabled={loading}>
                {loading ? "Logging in..." : "Login"}
              </Button>
              <p>
                Don't Have Account ?
                <Link href="/create" className="text-red-500">
                  Sign up
                </Link>{" "}
              </p>
            </CardFooter>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
