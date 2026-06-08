import { StatTile } from "@/components/ui/StatTile";
import type { DashboardKpis } from "@/types/trade";
import {
  formatSignedPercent,
  formatSignedCurrency,
  formatPercent,
  pnlColorClass,
} from "@/lib/utils/formatPnl";

/** Row of headline KPIs: profit factor, win rate, avg R, and gross +/-. */
export function StatsRow({ kpis }: { kpis: DashboardKpis }) {
  return (
    <div className="grid grid-cols-2 gap-6 border-t border-border pt-5 sm:grid-cols-4">
      <StatTile
        label="PROFIT FACTOR"
        value={kpis.profitFactor.toFixed(2)}
        delta={
          <span className={pnlColorClass(kpis.profitFactorDeltaPct)}>
            {formatSignedPercent(kpis.profitFactorDeltaPct)}
          </span>
        }
      />
      <StatTile
        label="WIN RATE"
        value={formatPercent(kpis.winRate)}
        progress={kpis.winRate}
        progressTone="brand"
      />
      <StatTile
        label="GROSS P/L"
        value={formatSignedCurrency(kpis.grossProfit, 0)}
        delta={
          <span className={pnlColorClass(kpis.grossLoss)}>
            {formatSignedCurrency(kpis.grossLoss, 0)}
          </span>
        }
      />
      <StatTile label="AVG R" value={`${kpis.avgR.toFixed(2)}R`} />
    </div>
  );
}
