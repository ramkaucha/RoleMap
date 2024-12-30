"use client";

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import EnhancedInput from "@/app/components/enhanced-input";

import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { useRouter } from "next/navigation";
import { RegisterFormData } from "@/app/components/interfaces";

export default function RegisterForm() {
  const router = useRouter();
  const [formData, setFormData] = useState<RegisterFormData>({
    email: "",
    first_name: "",
    last_name: "",
    password: "",
    profile_picture: null,
    profile_picture_type: null,
  });

  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [passwordMatch, setPasswordMatch] = useState<boolean>(true);

  const registerMutation = useMutation({
    mutationFn: async (data: RegisterFormData) => {
      const response = await axios.post("http://localhost:8000/register", data, {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        withCredentials: false,
      });
      return response.data;
    },
    onSuccess: () => {
      router.push("/auth/login");
    },
    onError: (error) => {
      console.error(error);
    },
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (name === "password") {
      setPasswordMatch(value === confirmPassword);
    }
  };

  const handleConfirmPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setConfirmPassword(value);
    setPasswordMatch(value === formData.password);
  };

  const handleSubmit = async () => {
    if (!passwordMatch) {
      return;
    }

    registerMutation.mutate(formData);
  };

  return (
    <div className="flex-grow flex justify-center items-center">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-3xl">Register</CardTitle>
          <CardDescription>Create your account</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="first-name">First Name</Label>
            <EnhancedInput
              id="first-name"
              name="first_name"
              type="text"
              required
              placeholder="John"
              value={formData.first_name}
              onChange={handleChange}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="last-name">Last Name</Label>
            <EnhancedInput
              id="last-name"
              name="last_name"
              type="text"
              required
              placeholder="Doe"
              value={formData.last_name}
              onChange={handleChange}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <EnhancedInput
              id="email"
              type="email"
              name="email"
              required
              placeholder="me@example.com"
              value={formData.email}
              onChange={handleChange}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <EnhancedInput
              id="password"
              name="password"
              type="password"
              required
              value={formData.password}
              onChange={handleChange}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirm-password">Confirm Password</Label>
            <EnhancedInput
              id="confirm-password"
              type="password"
              name="confirm_password"
              required
              value={confirmPassword}
              onChange={handleConfirmPasswordChange}
            />
            {!passwordMatch && confirmPassword && (
              <p className="text-red-500 mt-1 text-sm">Passwords do not match</p>
            )}
          </div>
          <Button
            type="submit"
            variant="default"
            onClick={handleSubmit}
            className="w-full font-semibold"
            disabled={!passwordMatch || registerMutation.isPending}
          >
            {registerMutation.isPending ? "Registering..." : "Register"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
