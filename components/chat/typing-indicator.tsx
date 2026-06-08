import { BrandMark } from "@/components/ui/brand";

export function TypingIndicator() {
  return (
    <div className="flex w-full animate-message-in gap-3">
      <BrandMark className="size-8 rounded-lg" />
      <div
        className="flex items-center gap-1 pt-3"
        role="status"
        aria-label="Assistant is typing"
      >
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="size-2 rounded-full bg-muted"
            style={{
              animation: "typing-bounce 1.2s infinite ease-in-out",
              animationDelay: `${i * 0.15}s`,
            }}
          />
        ))}
      </div>
    </div>
  );
}
