"use client";

import { Button, Card, Form, Link, Spinner } from "@heroui/react";
import { IconBrandGoogle } from "@tabler/icons-react";
import { type FormEvent, useState } from "react";
import { useSignIn } from "@/lib/use-auth";
import { ROUTES } from "@/utils/constants";
import { PasswordField, TextInputField } from "./fields";
import { type Banner, FormBanner } from "./form-banner";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function LoginForm() {
  const signIn = useSignIn();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<{ email?: string; password?: string }>(
    {},
  );
  const [banner, setBanner] = useState<Banner>(null);

  function validate() {
    const next: typeof errors = {};
    if (!email.trim()) next.email = "Email is required.";
    else if (!EMAIL_RE.test(email.trim()))
      next.email = "Enter a valid email address.";
    if (!password) next.password = "Password is required.";
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setBanner(null);
    if (!validate()) return;
    signIn.mutate(
      { email, password },
      { onError: (err) => setBanner({ type: "error", message: err.message }) },
    );
  }

  const pending = signIn.isPending;

  return (
    <Card>
      <Card.Header className="items-center gap-1.5 text-center">
        <Card.Title className="text-xl">Login to your account</Card.Title>
        <Card.Description>
          Enter your email below to sign in to your account
        </Card.Description>
      </Card.Header>

      <Card.Content>
        <Form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <FormBanner banner={banner} />

          <TextInputField
            name="email"
            label="Email"
            type="email"
            placeholder="m@example.com"
            value={email}
            onChange={(v) => {
              setEmail(v);
              if (errors.email) setErrors((e) => ({ ...e, email: undefined }));
            }}
            error={errors.email}
            autoComplete="email"
            autoFocus
          />

          <PasswordField
            name="password"
            label="Password"
            placeholder="••••••••"
            value={password}
            onChange={(v) => {
              setPassword(v);
              if (errors.password)
                setErrors((e) => ({ ...e, password: undefined }));
            }}
            error={errors.password}
            autoComplete="current-password"
            labelAction={
              <button
                type="button"
                onClick={() =>
                  setBanner({
                    type: "info",
                    message:
                      "Password recovery isn’t available in the demo yet.",
                  })
                }
                className="text-sm font-medium text-muted underline-offset-4 hover:text-foreground hover:underline"
              >
                Forgot your password?
              </button>
            }
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
                  Signing in…
                </>
              ) : (
                "Login"
              )}
            </Button>

            <Button
              type="button"
              variant="outline"
              fullWidth
              onPress={() =>
                setBanner({
                  type: "info",
                  message: "Social sign-in isn’t wired up in the demo.",
                })
              }
            >
              <IconBrandGoogle className="size-4.5" />
              Login with Google
            </Button>
          </div>
        </Form>
      </Card.Content>

      <Card.Footer className="justify-center">
        <p className="text-center text-sm text-muted">
          Don&apos;t have an account?{" "}
          <Link href={ROUTES.signup} className="font-medium">
            Sign up
          </Link>
        </p>
      </Card.Footer>
    </Card>
  );
}
