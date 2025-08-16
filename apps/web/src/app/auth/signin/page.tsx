"use client";

import { useState } from "react";
import { signIn, getSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function SignInPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const result = await signIn("credentials", {
        username,
        password,
        redirect: false,
      });

      if (result?.ok) {
        router.push("/");
      } else {
        alert("Login failed. Please try again.");
      }
    } catch (error) {
      console.error("Login error:", error);
      alert("Login failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoLogin = async () => {
    setIsLoading(true);
    try {
      const result = await signIn("credentials", {
        username: "demo",
        password: "demo123",
        redirect: false,
      });

      if (result?.ok) {
        router.push("/");
      }
    } catch (error) {
      console.error("Demo login error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background-primary flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-background-card border border-border-primary rounded-lg p-8">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-text-primary mb-2">
              Welcome to ChatDO
            </h1>
            <p className="text-text-secondary">Sign in to start chatting</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="username"
                className="block text-sm font-medium text-text-primary mb-2"
              >
                Username
              </label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-background-card border border-border-primary rounded-md px-3 py-2 text-text-primary placeholder-text-tertiary focus:outline-none focus:ring-2 focus:ring-accent-blue focus:border-transparent"
                placeholder="Enter your username"
                required
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-text-primary mb-2"
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-background-card border border-border-primary rounded-md px-3 py-2 text-text-primary placeholder-text-tertiary focus:outline-none focus:ring-2 focus:ring-accent-blue focus:border-transparent"
                placeholder="Enter your password"
                required
              />
            </div>

            <Button type="submit" className="w-full" loading={isLoading}>
              Sign In
            </Button>
          </form>

          <div className="mt-6">
            <Button
              variant="secondary"
              className="w-full"
              onClick={handleDemoLogin}
              loading={isLoading}
            >
              Try Demo (demo/demo123)
            </Button>
          </div>

          <div className="mt-4 text-center">
            <p className="text-xs text-text-tertiary">
              For demo purposes, any username/password combination will work
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}


