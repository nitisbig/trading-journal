import type { DashboardData, EquityPoint, CalendarDay } from "@/types/trade";

/** A gently rising equity curve with realistic drawdowns. */
const equityCurve: EquityPoint[] = [
  { date: "Jan", equity: 32000 },
  { date: "Feb", equity: 38500 },
  { date: "Mar", equity: 35200 },
  { date: "Apr", equity: 46800 },
  { date: "May", equity: 52100 },
  { date: "Jun", equity: 49400 },
  { date: "Jul", equity: 61200 },
  { date: "Aug", equity: 68900 },
  { date: "Sep", equity: 64500 },
  { date: "Oct", equity: 79300 },
  { date: "Nov", equity: 92600 },
  { date: "Dec", equity: 107183.75 },
];

/** 30-day calendar grid with mock per-day P&L (null = no trades). */
const calendarDays: CalendarDay[] = Array.from({ length: 30 }, (_, i) => {
  const day = i + 1;
  // Deterministic pseudo-pattern so the layout is stable across renders.
  const seed = (day * 7) % 11;
  let pnl: number | null = null;
  if (seed > 7) pnl = (seed - 5) * 180;
  else if (seed < 3) pnl = -(3 - seed) * 140;
  else if (seed === 5) pnl = 0;
  return { day, pnl };
});

export const dashboardData: DashboardData = {
  kpis: {
    netPnl: 107183.75,
    netPnlDeltaPct: 6.4,
    profitFactor: 2.41,
    profitFactorDeltaPct: -4.2,
    winRate: 68.2,
    avgR: 1.84,
    grossProfit: 3450,
    grossLoss: -1430,
  },
  equityCurve,
  topPairs: [
    { symbol: "NVDA", label: "NVIDIA Corp", winRate: 76, pnl: 18420 },
    { symbol: "BTC", label: "BTC/USD", winRate: 69, pnl: 14960 },
    { symbol: "AAPL", label: "Apple Inc", winRate: 64, pnl: 9230 },
    { symbol: "ES", label: "S&P 500 Futures", winRate: 58, pnl: 6110 },
    { symbol: "EUR", label: "EUR/USD", winRate: 52, pnl: -2240 },
  ],
  calendar: {
    month: "June",
    year: 2024,
    days: calendarDays,
  },
  lastImportedAt: "Jun 16, 2024 at 4:32 PM",
};
