"use client";

import { Button } from "@/components/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/card";
import { Input } from "@/components/input";
import { Label } from "@/components/label";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { LogIn } from "lucide-react";
import { FormEvent, useState } from "react";
import { AxiosError } from "axios";
import { login } from "@/services/auth";

export default function LoginPage() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const username = formData.get("username") as string;
    const password = formData.get("password") as string;

    try {
      setLoading(true);
      if (!username || !password) {
        throw new Error("Please enter a valid username and password");
      }
      await login(username, password);

      router.push("/dashboard");
    } catch (error: AxiosError<{ message: string}> | any) {
      toast({
        title: "Error",
        description: error?.message || "Failed to login",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-white to-blue-50">
      <div className="absolute inset-0 bg-grid-black/[0.02] -z-10" />
      <Card className="w-[400px] border-0 shadow-2xl bg-white/70 backdrop-blur-xl">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold bg-gradient-to-br from-purple-600 to-blue-600 bg-clip-text text-transparent">
            Welcome back
          </CardTitle>
          <CardDescription>
            Enter your credentials to access your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                name="username"
                type="username"
                required
                className="border-neutral-200 bg-white/50 backdrop-blur-xl transition-colors focus:border-purple-600"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                required
                className="border-neutral-200 bg-white/50 backdrop-blur-xl transition-colors focus:border-purple-600"
              />
            </div>
            <Button
              type="submit"
              loading={loading}
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 transition-all duration-300"
            >
              <LogIn className="w-4 h-4 mr-2" />
              Login
            </Button>
          </form>
          {/* <div className="mt-4 text-center space-y-2">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-neutral-200"></div>
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white/70 px-2 text-neutral-500">Or</span>
              </div>
            </div>
            <p className="text-sm text-neutral-600">
              Don't have an account?{" "}
              <Link
                href="/signup"
                className="font-medium text-purple-600 hover:text-purple-700 hover:underline transition-colors"
              >
                Sign up
              </Link>
            </p>
          </div> */}
        </CardContent>
      </Card>
    </div>
  );
}
