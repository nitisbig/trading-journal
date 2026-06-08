import { Bell, TrendingUp } from "lucide-react";

/** Mobile-only top bar: brand on the left, notifications + avatar on the right. */
export function MobileTopBar() {
  return (
    <header className="sticky top-0 z-30 flex items-center justify-between border-b border-border bg-app px-4 py-3 lg:hidden">
      <div className="flex items-center gap-2">
        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand text-white">
          <TrendingUp className="h-4 w-4" />
        </span>
        <span className="text-base font-semibold text-ink">Journal</span>
      </div>

      <div className="flex items-center gap-3">
        <button
          type="button"
          aria-label="Notifications"
          className="flex h-9 w-9 items-center justify-center rounded-full text-ink-muted transition-colors hover:bg-surface-muted hover:text-ink"
        >
          <Bell className="h-5 w-5" />
        </button>
        <span
          aria-hidden
          className="h-9 w-9 rounded-full bg-surface-muted ring-1 ring-border"
        />
      </div>
    </header>
  );
}
