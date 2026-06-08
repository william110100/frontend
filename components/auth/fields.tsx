"use client";

import { FieldError, Input, Label, TextField, cn } from "@heroui/react";
import { IconEye, IconEyeOff } from "@tabler/icons-react";
import { type ReactNode, useState } from "react";

interface TextInputFieldProps {
  name: string;
  label: string;
  type?: "text" | "email";
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  autoComplete?: string;
  autoFocus?: boolean;
}

export function TextInputField({
  name,
  label,
  type = "text",
  placeholder,
  value,
  onChange,
  error,
  autoComplete,
  autoFocus,
}: TextInputFieldProps) {
  return (
    <TextField
      name={name}
      type={type}
      value={value}
      onChange={onChange}
      isInvalid={Boolean(error)}
      validationBehavior="aria"
      fullWidth
      className="flex flex-col gap-2"
    >
      <Label>{label}</Label>
      <Input
        placeholder={placeholder}
        autoComplete={autoComplete}
        autoFocus={autoFocus}
      />
      {error ? <FieldError>{error}</FieldError> : null}
    </TextField>
  );
}

interface PasswordFieldProps {
  name: string;
  label: string;
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  autoComplete?: string;
  labelAction?: ReactNode;
}

export function PasswordField({
  name,
  label,
  placeholder,
  value,
  onChange,
  error,
  autoComplete,
  labelAction,
}: PasswordFieldProps) {
  const [visible, setVisible] = useState(false);

  return (
    <TextField
      name={name}
      value={value}
      onChange={onChange}
      isInvalid={Boolean(error)}
      validationBehavior="aria"
      fullWidth
      className="flex flex-col gap-2"
    >
      <div className="flex items-center justify-between gap-2">
        <Label>{label}</Label>
        {labelAction}
      </div>
      <div className="relative">
        <Input
          type={visible ? "text" : "password"}
          placeholder={placeholder}
          autoComplete={autoComplete}
          className="pr-10"
        />
        <button
          type="button"
          onClick={() => setVisible((v) => !v)}
          aria-label={visible ? "Hide password" : "Show password"}
          className={cn(
            "absolute inset-y-0 right-0 flex items-center px-3 text-muted",
            "transition-colors hover:text-foreground focus-visible:text-foreground focus-visible:outline-none",
          )}
          tabIndex={-1}
        >
          {visible ? (
            <IconEyeOff className="size-4.5" />
          ) : (
            <IconEye className="size-4.5" />
          )}
        </button>
      </div>
      {error ? <FieldError>{error}</FieldError> : null}
    </TextField>
  );
}
