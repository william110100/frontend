"use client";

import { AuthShell } from "@/components/auth/auth-shell";
import { SignupForm } from "@/components/auth/signup-form";
import { useRedirectIfAuthed } from "@/components/auth/use-redirect-if-authed";

export default function SignupPage() {
  useRedirectIfAuthed();
  return (
    <AuthShell>
      <SignupForm />
    </AuthShell>
  );
}
