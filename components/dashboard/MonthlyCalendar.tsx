"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { Card } from "@/components/ui/Card";
import type { CalendarDay } from "@/types/trade";
import { cn } from "@/lib/utils/cn";

interface MonthlyCalendarProps {
  month: string;
  year: number;
  days: CalendarDay[];
  /** Weekday index (0=Sun) the 1st falls on; controls leading offset. */
  startWeekday?: number;
}

const WEEKDAYS = ["S", "M", "T", "W", "T", "F", "S"];

function dayTone(pnl: number | null): string {
  if (pnl == null) return "text-ink hover:bg-surface-muted";
  if (pnl > 0) return "bg-profit-soft text-profit";
  if (pnl < 0) return "bg-loss-soft text-loss";
  return "bg-surface-muted text-ink-muted";
}

/** Month grid with prev/next chevrons and per-day P&L tinting. */
export function MonthlyCalendar({
  month,
  year,
  days,
  startWeekday = 6,
}: MonthlyCalendarProps) {
  return (
    <Card>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-sm font-semibold text-ink">Monthly Calendar</h2>
        <div className="flex items-center gap-1">
          <button
            type="button"
            aria-label="Previous month"
            className="rounded-md p-1 text-ink-muted hover:bg-surface-muted"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <span className="text-xs font-medium text-ink-muted">
            {month} {year}
          </span>
          <button
            type="button"
            aria-label="Next month"
            className="rounded-md p-1 text-ink-muted hover:bg-surface-muted"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-1.5 text-center">
        {WEEKDAYS.map((d, i) => (
          <span key={i} className="py-1 text-xs font-medium text-ink-subtle">
            {d}
          </span>
        ))}
        {Array.from({ length: startWeekday }).map((_, i) => (
          <span key={`pad-${i}`} />
        ))}
        {days.map((day) => (
          <div
            key={day.day}
            className={cn(
              "flex aspect-square items-center justify-center rounded-md text-xs font-medium transition-colors",
              dayTone(day.pnl),
            )}
          >
            {day.day}
          </div>
        ))}
      </div>
    </Card>
  );
}
