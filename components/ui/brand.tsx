import { cn } from "@heroui/react";
import { IconBolt } from "@tabler/icons-react";
import { APP_NAME } from "@/utils/constants";

export function BrandMark({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex size-9 shrink-0 items-center justify-center rounded-xl bg-foreground text-background shadow-surface",
        className,
      )}
      aria-hidden="true"
    >
      <IconBolt className="size-5" stroke={2.5} />
    </span>
  );
}

export function BrandLockup({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center gap-2.5", className)}>
      <BrandMark />
      <span className="text-lg font-semibold tracking-tight">{APP_NAME}</span>
    </div>
  );
}
