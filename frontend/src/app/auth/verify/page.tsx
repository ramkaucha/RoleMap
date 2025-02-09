"use client";

import { BACKEND_URL } from "@/app/config/pages";
import ErrorAlert from "@/components/error-alert";
import PageWrapper from "@/components/PageWrapper";
import axios from "axios";
import { Loader2 } from "lucide-react";
import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function VerifyPage() {
  const searchParam = useSearchParams();
  const router = useRouter();

  const [error, setError] = useState<string | null>(null);
  const [resendCooldown, setResendCooldown] = useState(0);
  const [isAuthorised, setIsAuthorised] = useState(false);

  const email = searchParam.get("email");

  useEffect(() => {
    setResendCooldown(60);
  }, []);

  useEffect(() => {
    const storedEmail = sessionStorage.getItem("registration_email");
    const timestamp = sessionStorage.getItem("registration_timestamp");

    const isRecent = timestamp && Date.now() - parseInt(timestamp) < 24 * 60 * 60 * 1000;

    if (!storedEmail || storedEmail !== email || !isRecent) {
      router.replace("/");
    } else {
      setIsAuthorised(true);
    }
  }, [router]);

  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => {
        setResendCooldown((p) => p - 1);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCooldown]);

  const handleResendVerification = async () => {
    if (resendCooldown > 0) {
      setError("Must wait for the cooldown!!");
      return;
    }

    if (!email) return;
    try {
      await axios.post(
        `${BACKEND_URL}/auth/resend-verification`,
        { email },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    } catch (error: any) {
      setError(error.response.message || "Failed to resend verification email");
    }
  };

  return (
    <PageWrapper>
      <div className="flex-grow flex justify-center items-center flex-col gap-3">
        {error && <ErrorAlert message={error} onClose={() => setError(null)} />}
        {/* Email Icon */}
        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
          <svg
            className="w-8 h-8 text-blue-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
            />
          </svg>
        </div>

        <h1 className="text-2xl font-semibold text-gray-900 text-center">
          Verify your email address
        </h1>

        <div className="flex items-center space-x-3">
          <Loader2 className="animate-spin w-5 h-5 text-blue-600" />
          <p className="text-gray-600">Waiting for verification...</p>
        </div>

        <div className="text-center max-w-md space-y-2">
          <p className="text-gray-600">We've sent a verification link to your email address.</p>
          <p className="text-sm text-gray-500">
            Please check your inbox and click the link to verify your account. The link will expire
            in 24 hours.
          </p>
        </div>

        <div className="flex flex-col items-center space-y-4 mt-4">
          <div>
            You can resend the verification email in <b>{resendCooldown} seconds</b>
          </div>
          <button
            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
            onClick={handleResendVerification}
          >
            Resend verification email
          </button>
          <button className="text-gray-500 hover:text-gray-700 text-sm">
            Change email address
          </button>
        </div>
      </div>
    </PageWrapper>
  );
}
