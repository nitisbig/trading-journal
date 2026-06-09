import { Header } from "@/components/layout/Header";
import { Card } from "@/components/ui/Card";
import { TradeList } from "@/components/journal/TradeList";
import { requireUser } from "@/lib/supabase/auth";
import { getTrades } from "@/lib/supabase/trades";

export default async function TradesPage() {
  await requireUser();
  const trades = await getTrades();

  return (
    <>
      <Header title="Trades" subtitle={`${trades.length} recorded`} />
      <div className="p-4 sm:p-8">
        {trades.length === 0 ? (
          <Card className="flex min-h-64 flex-col items-center justify-center gap-2 text-center">
            <h2 className="text-lg font-semibold text-ink">No trades yet</h2>
            <p className="max-w-sm text-sm text-ink-muted">
              Use the <span className="font-medium text-ink">Add Trade</span> button to log
              your first position. It’ll show up here and on your dashboard.
            </p>
          </Card>
        ) : (
          <TradeList trades={trades} />
        )}
      </div>
    </>
  );
}
