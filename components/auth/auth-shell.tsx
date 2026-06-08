import NextLink from "next/link";
import type { ReactNode } from "react";
import { BrandLockup } from "@/components/ui/brand";
import { ROUTES } from "@/utils/constants";

export function AuthShell({ children }: { children: ReactNode }) {
  return (
    <main className="flex min-h-svh flex-col items-center justify-center gap-6 bg-background-secondary px-4 py-10">
      <NextLink
        href={ROUTES.home}
        className="rounded-xl focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-focus"
      >
        <BrandLockup />
      </NextLink>

      <div className="w-full max-w-sm">{children}</div>

      <p className="max-w-sm text-balance text-center text-xs leading-relaxed text-muted">
        By continuing, you agree to our Terms of Service and Privacy Policy.
      </p>
    </main>
  );
}
