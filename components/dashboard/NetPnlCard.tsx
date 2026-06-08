import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { StatsRow } from "@/components/dashboard/StatsRow";
import type { DashboardKpis } from "@/types/trade";
import { formatSignedCurrency, formatSignedPercent } from "@/lib/utils/formatPnl";

/** Hero card: large Net P&L figure, delta badge, and the KPI stats row. */
export function NetPnlCard({ kpis }: { kpis: DashboardKpis }) {
  const positive = kpis.netPnl >= 0;
  return (
    <Card className="flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-wide text-ink-muted">
          Net P&L
        </span>
        <Badge tone={kpis.netPnlDeltaPct >= 0 ? "profit" : "loss"}>
          {formatSignedPercent(kpis.netPnlDeltaPct)} MTD
        </Badge>
      </div>

      <div
        className={`text-5xl font-bold tracking-tight ${
          positive ? "text-profit" : "text-loss"
        }`}
      >
        {formatSignedCurrency(kpis.netPnl)}
      </div>

      <StatsRow kpis={kpis} />
    </Card>
  );
}
