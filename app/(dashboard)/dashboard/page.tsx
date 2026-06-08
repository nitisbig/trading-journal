import { Header } from "@/components/layout/Header";
import { NetPnlCard } from "@/components/dashboard/NetPnlCard";
import { EquityCurveCard } from "@/components/dashboard/EquityCurveCard";
import { MonthlyCalendar } from "@/components/dashboard/MonthlyCalendar";
import { TopPairsCard } from "@/components/dashboard/TopPairsCard";
import { dashboardData } from "@/lib/mock/dashboard";

export default function DashboardPage() {
  const { kpis, equityCurve, topPairs, calendar, lastImportedAt } =
    dashboardData;

  return (
    <>
      <div className="hidden lg:block">
        <Header
          title="Trading Journal Dashboard"
          subtitle={`Last import: ${lastImportedAt}`}
          period={`${calendar.month} ${calendar.year}`}
        />
      </div>

      <div className="grid grid-cols-1 gap-4 p-4 sm:gap-6 sm:p-8 lg:grid-cols-3">
        {/* Main column */}
        <div className="flex min-w-0 flex-col gap-4 sm:gap-6 lg:col-span-2">
          <NetPnlCard kpis={kpis} />
          <EquityCurveCard
            data={equityCurve}
            deltaPct={kpis.netPnlDeltaPct}
          />
        </div>

        {/* Right rail */}
        <div className="flex flex-col gap-4 sm:gap-6">
          <MonthlyCalendar
            month={calendar.month}
            year={calendar.year}
            days={calendar.days}
          />
          <TopPairsCard pairs={topPairs} />
        </div>
      </div>
    </>
  );
}
