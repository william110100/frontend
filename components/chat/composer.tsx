"use client";

import { Button, cn } from "@heroui/react";
import { IconArrowUp } from "@tabler/icons-react";
import { type KeyboardEvent, useEffect, useRef, useState } from "react";

interface ComposerProps {
  onSend: (text: string) => void;
  disabled?: boolean;
  autoFocus?: boolean;
  placeholder?: string;
}

export function Composer({
  onSend,
  disabled = false,
  autoFocus = false,
  placeholder = "Send a message…",
}: ComposerProps) {
  const [value, setValue] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 200)}px`;
  }, [value]);

  function submit() {
    const text = value.trim();
    if (!text || disabled) return;
    onSend(text);
    setValue("");
  }

  function handleKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      submit();
    }
  }

  const canSend = value.trim().length > 0 && !disabled;

  return (
    <div className="mx-auto w-full max-w-3xl shrink-0 px-4 pb-4 md:px-6">
      <div
        className={cn(
          "flex items-end gap-2 rounded-2xl border border-border bg-surface p-2 shadow-surface",
          "transition-colors focus-within:border-border-secondary",
        )}
      >
        <textarea
          ref={textareaRef}
          rows={1}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          autoFocus={autoFocus}
          aria-label="Message"
          className="no-scrollbar max-h-[200px] flex-1 resize-none bg-transparent px-2 py-1.5 text-[0.95rem] leading-relaxed text-foreground outline-none placeholder:text-field-placeholder"
        />
        <Button
          isIconOnly
          variant="primary"
          aria-label="Send message"
          onPress={submit}
          isDisabled={!canSend}
          className="size-9 shrink-0 rounded-xl"
        >
          <IconArrowUp className="size-5" />
        </Button>
      </div>
      <p className="mt-2 text-center text-xs text-muted">
        AI can make mistakes. Check important info.
      </p>
    </div>
  );
}
