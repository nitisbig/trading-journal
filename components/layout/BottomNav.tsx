"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Plus } from "lucide-react";
import { NAV_ITEMS } from "@/constants/nav";
import { cn } from "@/lib/utils/cn";

/** Mobile-only bottom tab bar with a floating Add Trade button. */
export function BottomNav() {
  const pathname = usePathname();
  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(`${href}/`);

  return (
    <>
      {/* Floating Add Trade button, anchored above the tab bar. */}
      <button
        type="button"
        aria-label="Add Trade"
        className="fixed bottom-[4.5rem] right-4 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-brand text-white shadow-lg transition-opacity hover:opacity-90 lg:hidden"
      >
        <Plus className="h-6 w-6" />
      </button>

      <nav className="fixed inset-x-0 bottom-0 z-30 flex items-stretch border-t border-border bg-surface pb-[env(safe-area-inset-bottom)] lg:hidden">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-1 flex-col items-center justify-center gap-1 py-2 text-[11px] font-medium transition-colors",
                active ? "text-brand" : "text-ink-muted",
              )}
            >
              <span
                className={cn(
                  "flex h-7 w-12 items-center justify-center rounded-full transition-colors",
                  active && "bg-profit-soft",
                )}
              >
                <Icon className="h-5 w-5" />
              </span>
              {item.label}
            </Link>
          );
        })}
      </nav>
    </>
  );
}
