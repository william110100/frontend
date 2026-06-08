import { BrandMark } from "@/components/ui/brand";
import type { Message } from "@/lib/types";

export function MessageBubble({ message }: { message: Message }) {
  const isUser = message.role === "user";

  if (isUser) {
    return (
      <div className="flex w-full animate-message-in justify-end">
        <div className="message-prose max-w-[85%] rounded-2xl rounded-br-md bg-surface-secondary px-4 py-2.5 text-[0.95rem] leading-relaxed text-foreground">
          {message.content}
        </div>
      </div>
    );
  }

  return (
    <div className="flex w-full animate-message-in gap-3">
      <BrandMark className="size-8 rounded-lg" />
      <div className="message-prose min-w-0 flex-1 pt-1 text-[0.95rem] leading-relaxed text-foreground">
        {message.content}
      </div>
    </div>
  );
}
