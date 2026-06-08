"use client";

import { Button, Card, Form, Link, Spinner } from "@heroui/react";
import { IconBrandGoogle } from "@tabler/icons-react";
import { type FormEvent, useState } from "react";
import { useSignUp } from "@/lib/use-auth";
import { ROUTES } from "@/utils/constants";
import { PasswordField, TextInputField } from "./fields";
import { type Banner, FormBanner } from "./form-banner";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type Errors = {
  name?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
};

export function SignupForm() {
  const signUp = useSignUp();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState<Errors>({});
  const [banner, setBanner] = useState<Banner>(null);

  function clearError(field: keyof Errors) {
    setErrors((e) => (e[field] ? { ...e, [field]: undefined } : e));
  }

  function validate() {
    const next: Errors = {};
    if (!name.trim()) next.name = "Name is required.";
    if (!email.trim()) next.email = "Email is required.";
    else if (!EMAIL_RE.test(email.trim()))
      next.email = "Enter a valid email address.";
    if (!password) next.password = "Password is required.";
    else if (password.length < 8)
      next.password = "Password must be at least 8 characters.";
    if (!confirmPassword)
      next.confirmPassword = "Please confirm your password.";
    else if (confirmPassword !== password)
      next.confirmPassword = "Passwords do not match.";
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setBanner(null);
    if (!validate()) return;
    signUp.mutate(
      { name, email, password },
      { onError: (err) => setBanner({ type: "error", message: err.message }) },
    );
  }

  const pending = signUp.isPending;

  return (
    <Card>
      <Card.Header className="items-center gap-1.5 text-center">
        <Card.Title className="text-xl">Create your account</Card.Title>
        <Card.Description>
          Enter your details below to create your account
        </Card.Description>
      </Card.Header>

      <Card.Content>
        <Form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <FormBanner banner={banner} />

          <TextInputField
            name="name"
            label="Full name"
            placeholder="Ada Lovelace"
            value={name}
            onChange={(v) => {
              setName(v);
              clearError("name");
            }}
            error={errors.name}
            autoComplete="name"
            autoFocus
          />

          <TextInputField
            name="email"
            label="Email"
            type="email"
            placeholder="m@example.com"
            value={email}
            onChange={(v) => {
              setEmail(v);
              clearError("email");
            }}
            error={errors.email}
            autoComplete="email"
          />

          <PasswordField
            name="password"
            label="Password"
            placeholder="At least 8 characters"
            value={password}
            onChange={(v) => {
              setPassword(v);
              clearError("password");
            }}
            error={errors.password}
            autoComplete="new-password"
          />

          <PasswordField
            name="confirmPassword"
            label="Confirm password"
            placeholder="Re-enter your password"
            value={confirmPassword}
            onChange={(v) => {
              setConfirmPassword(v);
              clearError("confirmPassword");
            }}
            error={errors.confirmPassword}
            autoComplete="new-password"
          />

          <div className="flex flex-col gap-3">
            <Button
              type="submit"
              variant="primary"
              fullWidth
              isPending={pending}
              isDisabled={pending}
            >
              {pending ? (
                <>
                  <Spinner size="sm" color="current" />
                  Creating account…
                </>
              ) : (
                "Create account"
              )}
            </Button>

            <Button
              type="button"
              variant="outline"
              fullWidth
              onPress={() =>
                setBanner({
                  type: "info",
                  message: "Social sign-up isn’t wired up in the demo.",
                })
              }
            >
              <IconBrandGoogle className="size-4.5" />
              Sign up with Google
            </Button>
          </div>
        </Form>
      </Card.Content>

      <Card.Footer className="justify-center">
        <p className="text-center text-sm text-muted">
          Already have an account?{" "}
          <Link href={ROUTES.login} className="font-medium">
            Login
          </Link>
        </p>
      </Card.Footer>
    </Card>
  );
}
