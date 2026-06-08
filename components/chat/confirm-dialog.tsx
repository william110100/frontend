"use client";

import { Button } from "@heroui/react";
import { useEffect, useRef } from "react";

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  tone?: "danger" | "primary";
  isPending?: boolean;
  onConfirm: () => void;
  onClose: () => void;
}

export function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  tone = "danger",
  isPending = false,
  onConfirm,
  onClose,
}: ConfirmDialogProps) {
  const cancelRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    cancelRef.current?.focus();

    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape" && !isPending) onClose();
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open, isPending, onClose]);

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={title}
      className="fixed inset-0 z-[60] flex items-center justify-center p-4"
    >
      <button
        type="button"
        aria-hidden="true"
        tabIndex={-1}
        onClick={() => !isPending && onClose()}
        className="absolute inset-0 cursor-default bg-black/40 backdrop-blur-[1px]"
      />
      <div className="relative w-full max-w-sm rounded-2xl border border-border bg-surface p-5 shadow-overlay">
        <h2 className="text-base font-semibold text-foreground">{title}</h2>
        {description ? (
          <p className="mt-1.5 text-sm leading-relaxed text-muted">
            {description}
          </p>
        ) : null}
        <div className="mt-5 flex justify-end gap-2">
          <Button
            ref={cancelRef}
            variant="outline"
            size="sm"
            onPress={onClose}
            isDisabled={isPending}
          >
            {cancelLabel}
          </Button>
          <Button
            variant={tone}
            size="sm"
            onPress={onConfirm}
            isPending={isPending}
            isDisabled={isPending}
          >
            {confirmLabel}
          </Button>
        </div>
      </div>
    </div>
  );
}
