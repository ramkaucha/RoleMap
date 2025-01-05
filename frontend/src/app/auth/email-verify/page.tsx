"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Check } from "lucide-react";

export default function EmailVerifyPage() {
  return (
    <div className="flex-grow flex justify-center items-center flex-col gap-3">
      <div className="rounded-full mb-4">
        <Check className="w-20 h-20 animate-pulse bg-green-500 rounded-full p-3" />
      </div>
      <h1 className="font-bold text-lg">You have been verified!!</h1>
    </div>
  );
}
