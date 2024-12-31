"use client";

import PageWrapper from "@/components/PageWrapper";
import RegisterForm from "./components/RegisterForm";
import ErrorAlert from "@/components/error-alert";
import { useState } from "react";

export default function RegisterPage() {
  const [error, setError] = useState<string | null>(null);
  return (
    <PageWrapper>
      {error && <ErrorAlert message={error} />}
      <RegisterForm setError={setError} />
    </PageWrapper>
  );
}
