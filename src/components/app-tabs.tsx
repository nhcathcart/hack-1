"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";

/**
 * Top-level app navigation. The interviewer feedback board and the Kindling
 * recruiting dashboard are two views of the same app: "Interviewer" is the
 * blinded-feedback board (colleague's main page), "Admin" opens the dashboard.
 * Styled entirely in UDS tokens so it inherits the Kaizen brand override.
 */
const TABS = [
  { href: "/", label: "Interviewer" },
  { href: "/dashboard", label: "Admin" },
] as const;

export function AppTabs({ current }: { current: "/" | "/dashboard" }) {
  return (
    <nav aria-label="Primary" className="inline-flex items-center gap-1 rounded-full bg-surface-tertiary p-1">
      {TABS.map((t) => {
        const active = t.href === current;
        return (
          <Link
            key={t.href}
            href={t.href}
            aria-current={active ? "page" : undefined}
            className={cn(
              "text-style-body-sm-semibold rounded-full px-4 py-1.5 transition-colors",
              active
                ? "bg-surface-inverse text-on-surface-inverse-default shadow-elevation"
                : "text-on-surface-primary-subtle hover:text-on-surface-primary-default"
            )}
          >
            {t.label}
          </Link>
        );
      })}
    </nav>
  );
}
