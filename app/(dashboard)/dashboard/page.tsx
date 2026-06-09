import { Header } from "@/components/layout/Header";
import { NetPnlCard } from "@/components/dashboard/NetPnlCard";
import { EquityCurveCard } from "@/components/dashboard/EquityCurveCard";
import { MonthlyCalendar } from "@/components/dashboard/MonthlyCalendar";
import { TopPairsCard } from "@/components/dashboard/TopPairsCard";
import { Card } from "@/components/ui/Card";
import { requireUser } from "@/lib/supabase/auth";
import { getTrades } from "@/lib/supabase/trades";
import { computeDashboard } from "@/lib/analytics/dashboard";

export default async function DashboardPage() {
  await requireUser();
  const trades = await getTrades();
  const { kpis, equityCurve, topPairs, calendar, lastImportedAt } =
    computeDashboard(trades, new Date());

  return (
    <>
      <div className="hidden lg:block">
        <Header
          title="Trading Journal Dashboard"
          subtitle={`Last updated: ${lastImportedAt}`}
          period={`${calendar.month} ${calendar.year}`}
        />
      </div>

      <div className="grid grid-cols-1 gap-4 p-4 sm:gap-6 sm:p-8 lg:grid-cols-3">
        {/* Main column */}
        <div className="flex min-w-0 flex-col gap-4 sm:gap-6 lg:col-span-2">
          <NetPnlCard kpis={kpis} />
          <EquityCurveCard data={equityCurve} deltaPct={kpis.netPnlDeltaPct} />
        </div>

        {/* Right rail */}
        <div className="flex flex-col gap-4 sm:gap-6">
          <MonthlyCalendar
            month={calendar.month}
            year={calendar.year}
            days={calendar.days}
            startWeekday={calendar.startWeekday}
          />
          {topPairs.length > 0 ? (
            <TopPairsCard pairs={topPairs} />
          ) : (
            <Card className="flex min-h-32 flex-col items-center justify-center gap-1 text-center">
              <h2 className="text-sm font-semibold text-ink">No closed trades yet</h2>
              <p className="text-xs text-ink-muted">
                Add trades with an exit price to see performance by instrument.
              </p>
            </Card>
          )}
        </div>
      </div>
    </>
  );
}
