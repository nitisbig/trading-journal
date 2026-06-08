import type { ReactNode } from "react";
import { cn } from "@/lib/utils/cn";

interface StatTileProps {
  label: string;
  value: string;
  /** Optional secondary line under the value (e.g. a signed delta). */
  delta?: ReactNode;
  /** Optional progress bar fill, 0–100. */
  progress?: number;
  progressTone?: "profit" | "loss" | "brand";
  className?: string;
}

const PROGRESS_TONE: Record<NonNullable<StatTileProps["progressTone"]>, string> = {
  profit: "bg-profit",
  loss: "bg-loss",
  brand: "bg-brand",
};

/** A labelled metric: small label, prominent value, optional delta + progress. */
export function StatTile({
  label,
  value,
  delta,
  progress,
  progressTone = "brand",
  className,
}: StatTileProps) {
  return (
    <div className={cn("flex flex-col gap-1", className)}>
      <span className="text-xs font-medium text-ink-muted">{label}</span>
      <span className="text-xl font-semibold text-ink">{value}</span>
      {delta != null && <span className="text-xs font-medium">{delta}</span>}
      {progress != null && (
        <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-surface-muted">
          <div
            className={cn("h-full rounded-full", PROGRESS_TONE[progressTone])}
            style={{ width: `${Math.min(Math.max(progress, 0), 100)}%` }}
          />
        </div>
      )}
    </div>
  );
}
