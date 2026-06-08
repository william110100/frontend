"use client";

import { AuthShell } from "@/components/auth/auth-shell";
import { LoginForm } from "@/components/auth/login-form";
import { useRedirectIfAuthed } from "@/components/auth/use-redirect-if-authed";

export default function LoginPage() {
  useRedirectIfAuthed();
  return (
    <AuthShell>
      <LoginForm />
    </AuthShell>
  );
}
