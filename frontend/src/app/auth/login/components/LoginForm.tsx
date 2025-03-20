"use client";

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import EnhancedInput from "@/components/enhanced-input";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { useRouter } from "next/navigation";
import { LoginFormData } from "@/components/interfaces";
import ErrorAlert from "@/components/error-alert";
import Link from "next/link";
import { BACKEND_URL } from "@/app/config/pages";
import { useAuth } from "@/app/context/AuthContext";

const URL = process.env.PROD_FRONTEND_URL;

export default function LoginForm() {
  const router = useRouter();
  const { login } = useAuth();
  const [formData, setFormData] = useState<LoginFormData>({
    username: "",
    password: "",
  });

  const [error, setError] = useState<string | null>(null);

  const registerMutation = useMutation({
    mutationFn: async (data: LoginFormData) => {
      const formData = new URLSearchParams({
        username: data.username,
        password: data.password,
      });

      const response = await axios.post(`${BACKEND_URL}/auth/token`, formData, {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Accept: "application/json",
        },
        withCredentials: false,
      });
      return response.data;
    },
    onSuccess: (data) => {
      login(data.access_token);
      router.push("/track");
    },
    onError: (error: any) => {
      let errorMessage =
        error.response?.data?.detail || error.message || "An error occurred during Login.";
      console.error(errorMessage);
      if (errorMessage.length > 1) {
        errorMessage = "An error occurred during Login.";
      }

      setError(errorMessage);
      throw error;
    },
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log(process.env.NEXT_PUBLIC_API_URL);
    let { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    registerMutation.mutate(formData);
  };

  return (
    <div className="flex-grow flex flex-col w-full">
      {error && <ErrorAlert message={error} onClose={() => setError(null)} />}
      <Card className="w-full w-full ml-10">
        <CardHeader>
          <CardTitle className="text-3xl">Login</CardTitle>
          <CardDescription>Login to your account</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="username">Email</Label>
            <EnhancedInput
              id="username"
              type="email"
              name="username"
              required
              placeholder="me@example.com"
              value={formData.username}
              onChange={handleChange}
            />
          </div>
          <div className="space-y-2">
            <div className="flex justify-between">
              <Label htmlFor="password">Password</Label>
              <Link href="/auth/reset-password" className="text-sm text-blue-700 underline">
                Forgot Password?
              </Link>
            </div>
            <EnhancedInput
              id="password"
              name="password"
              type="password"
              required
              value={formData.password}
              onChange={handleChange}
            />
          </div>
          <div>
            <Link href="/auth/register" className="text-sm">
              Don't have an Account? <span className="text-blue-700 underline">Sign Up Here.</span>
            </Link>
          </div>
          <Button
            type="submit"
            variant="default"
            onClick={handleSubmit}
            className="w-full font-semibold"
            disabled={registerMutation.isPending}
          >
            {registerMutation.isPending ? "Logging In..." : "Login"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
