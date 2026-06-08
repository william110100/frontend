import { Spinner } from "@heroui/react";

export function FullscreenLoader({ label }: { label?: string }) {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-3 bg-background">
      <Spinner size="lg" />
      {label ? <p className="text-sm text-muted">{label}</p> : null}
    </div>
  );
}
