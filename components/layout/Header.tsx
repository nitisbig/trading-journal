import { ChevronLeft, ChevronRight } from "lucide-react";

interface HeaderProps {
  title: string;
  subtitle?: string;
  /** Current period label shown in the month picker, e.g. "June 2024". */
  period?: string;
}

/** Top bar: page title + import note on the left, month picker on the right. */
export function Header({ title, subtitle, period }: HeaderProps) {
  return (
    <header className="flex items-start justify-between gap-4 border-b border-border bg-app px-8 py-5">
      <div>
        <h1 className="text-2xl font-bold text-ink">{title}</h1>
        {subtitle && (
          <p className="mt-1 text-xs text-ink-subtle">{subtitle}</p>
        )}
      </div>

      {period && (
        <div className="flex items-center gap-1 rounded-lg border border-border bg-surface px-2 py-1.5">
          <button
            type="button"
            aria-label="Previous month"
            className="rounded-md p-1 text-ink-muted hover:bg-surface-muted"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <span className="px-2 text-sm font-medium text-ink">{period}</span>
          <button
            type="button"
            aria-label="Next month"
            className="rounded-md p-1 text-ink-muted hover:bg-surface-muted"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      )}
    </header>
  );
}
