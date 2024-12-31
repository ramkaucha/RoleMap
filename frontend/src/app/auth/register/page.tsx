"use client";

import PageWrapper from "@/components/PageWrapper";
import RegisterForm from "./components/RegisterForm";
import ErrorAlert from "@/components/error-alert";
import { useState } from "react";

export default function RegisterPage() {
  return (
    <PageWrapper>
      <RegisterForm />
    </PageWrapper>
  );
}
