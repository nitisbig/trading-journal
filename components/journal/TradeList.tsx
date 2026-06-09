import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import type { Trade } from "@/types/trade";
import { formatCurrency, formatSignedCurrency, pnlColorClass } from "@/lib/utils/formatPnl";

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

/** Row-based trade log: bold ticker, direction, prices, and colored P&L. */
export function TradeList({ trades }: { trades: Trade[] }) {
  return (
    <Card className="overflow-hidden p-0">
      {/* Desktop / tablet table */}
      <div className="hidden overflow-x-auto sm:block">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border text-left text-xs font-semibold uppercase tracking-wide text-ink-subtle">
              <th className="px-5 py-3">Symbol</th>
              <th className="px-5 py-3">Side</th>
              <th className="px-5 py-3 text-right">Entry</th>
              <th className="px-5 py-3 text-right">Exit</th>
              <th className="px-5 py-3 text-right">Qty</th>
              <th className="px-5 py-3">Entry Date</th>
              <th className="px-5 py-3 text-right">P&amp;L</th>
            </tr>
          </thead>
          <tbody>
            {trades.map((t) => (
              <tr
                key={t.id}
                className="border-b border-border last:border-0 transition-colors hover:bg-surface-muted"
              >
                <td className="px-5 py-3 font-bold text-ink">{t.symbol}</td>
                <td className="px-5 py-3">
                  <Badge tone={t.direction === "long" ? "profit" : "loss"}>
                    {t.direction.toUpperCase()}
                  </Badge>
                </td>
                <td className="px-5 py-3 text-right text-ink-muted">
                  {formatCurrency(t.entry_price)}
                </td>
                <td className="px-5 py-3 text-right text-ink-muted">
                  {t.exit_price != null ? formatCurrency(t.exit_price) : "—"}
                </td>
                <td className="px-5 py-3 text-right text-ink-muted">{t.quantity}</td>
                <td className="px-5 py-3 text-ink-muted">{formatDate(t.entry_at)}</td>
                <td className={`px-5 py-3 text-right font-semibold ${pnlColorClass(t.pnl ?? 0)}`}>
                  {t.pnl != null ? formatSignedCurrency(t.pnl) : "Open"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile stacked cards */}
      <ul className="flex flex-col sm:hidden">
        {trades.map((t) => (
          <li
            key={t.id}
            className="flex items-center justify-between gap-3 border-b border-border px-4 py-3 last:border-0"
          >
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-bold text-ink">{t.symbol}</span>
                <Badge tone={t.direction === "long" ? "profit" : "loss"}>
                  {t.direction.toUpperCase()}
                </Badge>
              </div>
              <p className="mt-0.5 truncate text-xs text-ink-muted">
                {formatDate(t.entry_at)} · {t.quantity} @ {formatCurrency(t.entry_price)}
              </p>
            </div>
            <span className={`shrink-0 text-sm font-semibold ${pnlColorClass(t.pnl ?? 0)}`}>
              {t.pnl != null ? formatSignedCurrency(t.pnl) : "Open"}
            </span>
          </li>
        ))}
      </ul>
    </Card>
  );
}
