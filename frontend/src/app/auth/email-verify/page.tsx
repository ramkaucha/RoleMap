"use client";

import { BACKEND_URL } from "@/app/config/pages";
import ErrorAlert from "@/components/error-alert";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import axios from "axios";
import { Check, Loader2 } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function EmailVerifyPage() {
  const searchParams = useSearchParams();

  const router = useRouter();

  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const token = searchParams.get("token");

  const handleUserVerification = async () => {
    try {
      const response = await axios.get(`${BACKEND_URL}/verify-email?token=${token}`);
      setIsLoading(false);
    } catch (err: any) {
      if (err.response) {
        if (err.response.data?.detail && Array.isArray(err.response.data.detail)) {
          setError(err.response.data.detail[0]?.msg || "Error during validation");
        } else {
          setError(err.response.data?.detail || "Error during verification");
        }
      } else {
        setError("Error coinnecting to server");
      }
    }
  };

  useEffect(() => {
    handleUserVerification();
  }, []);

  return (
    <div className="flex-grow flex justify-center items-center flex-col gap-3">
      {error && <ErrorAlert message={error} onClose={() => setError(null)} />}
      {isLoading ? (
        <Loader2 className="h-20 w-20 animate-spin" />
      ) : (
        <div className="flex flex-col items-center justify-center text-center">
          <div className="mb-4 flex flex-col items-center gap-4">
            <Check className="w-20 h-20 animate-pulse bg-green-500 rounded-full p-3" />
            <h1 className="font-bold text-lg">You have been verified!!</h1>
          </div>
        </div>
      )}
    </div>
  );
}
