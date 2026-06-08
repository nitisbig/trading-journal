import { Card, CardHeader } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import type { PairPerformance } from "@/types/trade";
import { formatSignedCurrency } from "@/lib/utils/formatPnl";

/** Ranked list of best-performing instruments with win-rate + P&L. */
export function TopPairsCard({ pairs }: { pairs: PairPerformance[] }) {
  return (
    <Card>
      <CardHeader title="Top Pairs Performance" />
      <ul className="flex flex-col gap-3">
        {pairs.map((pair) => (
          <li key={pair.symbol} className="flex items-center gap-3">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-surface-muted text-xs font-semibold text-ink">
              {pair.symbol}
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-ink">
                {pair.label}
              </p>
              <p className="text-xs text-ink-muted">{pair.winRate}% win</p>
            </div>
            <Badge tone={pair.pnl >= 0 ? "profit" : "loss"}>
              {formatSignedCurrency(pair.pnl, 0)}
            </Badge>
          </li>
        ))}
      </ul>
    </Card>
  );
}
