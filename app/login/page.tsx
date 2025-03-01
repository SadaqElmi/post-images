"use client";

import { signIn, getSession } from "next-auth/react";
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
import { Eye, EyeOff } from "lucide-react";

const Login = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

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
      setLoading(false);
      return;
    }

    const session = await getSession();

    if (session?.user.role === "admin") {
      router.push("/dashboard/admin");
    } else {
      router.push("/dashboard/user");
    }

    setLoading(false);
    toast.success("Soo gal si guul leh!");
  };

  //const handleGoogleLogin = async () => {
  //  await signIn("google", { callbackUrl: "/dashboard/user" });
  //};

  return (
    <div className="flex justify-center items-center min-h-screen p-4">
      <Card className="w-full max-w-md sm:w-96">
        <CardHeader className="text-center space-y-2">
          <CardTitle className="text-2xl sm:text-3xl">Sogal</CardTitle>
          <CardDescription className="text-sm sm:text-base">
            Gal akoonkaaga si aad u sii wadato!
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="grid w-full gap-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm sm:text-base">
                  iimaylka
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-10 sm:h-11 text-sm sm:text-base"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm sm:text-base">
                  erayga sirta ah
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="h-10 sm:h-11 text-sm sm:text-base pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-3 flex items-center text-gray-500"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              <CardFooter className="flex flex-col px-0 pb-0 gap-4">
                <Button
                  className="w-full h-10 sm:h-11 text-sm sm:text-base"
                  type="submit"
                  disabled={loading}
                >
                  {loading ? "Logging in..." : "Login"}
                </Button>

                <div className="text-center text-sm sm:text-base">
                  akoonka ma lihid ?
                  <Link
                    href="/create"
                    className="text-red-500 hover:text-red-600 font-medium"
                  >
                    Abuur Akoon
                  </Link>
                </div>
              </CardFooter>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
