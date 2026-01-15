"use client";

import { AuthForm } from "@/components/auth/AuthForm";

export default function RegisterPage() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <AuthForm initialMode="register" />
    </div>
  );
}
