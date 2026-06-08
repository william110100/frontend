import { cn } from "@heroui/react";
import { IconAlertCircle, IconInfoCircle } from "@tabler/icons-react";

export type Banner = { type: "error" | "info"; message: string } | null;

export function FormBanner({ banner }: { banner: Banner }) {
  if (!banner) return null;

  const isError = banner.type === "error";
  const Icon = isError ? IconAlertCircle : IconInfoCircle;

  return (
    <div
      role={isError ? "alert" : "status"}
      className={cn(
        "flex items-start gap-2 rounded-lg px-3 py-2.5 text-sm",
        isError
          ? "bg-danger-soft text-danger-soft-foreground"
          : "bg-default text-muted",
      )}
    >
      <Icon className="mt-0.5 size-4 shrink-0" />
      <span>{banner.message}</span>
    </div>
  );
}
