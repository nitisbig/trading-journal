import type {
  CalendarDay,
  DashboardData,
  EquityPoint,
  PairPerformance,
  Trade,
} from "@/types/trade";

/** A trade that has a realized P&L (i.e. it's closed). */
type ClosedTrade = Trade & { pnl: number };

const MONTHS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

function isClosed(t: Trade): t is ClosedTrade {
  return typeof t.pnl === "number";
}

/** When a trade contributes to performance: exit time if present, else entry time. */
function effectiveDate(t: Trade): Date {
  return new Date(t.exit_at ?? t.entry_at);
}

function pctChange(current: number, previous: number): number {
  if (previous === 0) return current === 0 ? 0 : 100;
  return ((current - previous) / Math.abs(previous)) * 100;
}

function computeKpis(closed: ClosedTrade[], now: Date): DashboardData["kpis"] {
  const netPnl = closed.reduce((sum, t) => sum + t.pnl, 0);
  const wins = closed.filter((t) => t.pnl > 0);
  const losses = closed.filter((t) => t.pnl < 0);
  const grossProfit = wins.reduce((sum, t) => sum + t.pnl, 0);
  const grossLoss = losses.reduce((sum, t) => sum + t.pnl, 0); // negative
  const winRate = closed.length ? (wins.length / closed.length) * 100 : 0;
  const profitFactor = grossLoss !== 0 ? grossProfit / Math.abs(grossLoss) : grossProfit > 0 ? grossProfit : 0;

  // avgR: approximate reward/risk as avg win divided by avg loss size (no stop data in schema).
  const avgWin = wins.length ? grossProfit / wins.length : 0;
  const avgLoss = losses.length ? Math.abs(grossLoss) / losses.length : 0;
  const avgR = avgLoss !== 0 ? avgWin / avgLoss : avgWin > 0 ? avgWin : 0;

  // Month-over-month deltas.
  const thisMonth = now.getMonth();
  const thisYear = now.getFullYear();
  const prevMonthDate = new Date(thisYear, thisMonth - 1, 1);
  const prevMonth = prevMonthDate.getMonth();
  const prevYear = prevMonthDate.getFullYear();

  const inMonth = (t: ClosedTrade, m: number, y: number) => {
    const d = effectiveDate(t);
    return d.getMonth() === m && d.getFullYear() === y;
  };

  const curMonthTrades = closed.filter((t) => inMonth(t, thisMonth, thisYear));
  const prevMonthTrades = closed.filter((t) => inMonth(t, prevMonth, prevYear));

  const curNet = curMonthTrades.reduce((s, t) => s + t.pnl, 0);
  const prevNet = prevMonthTrades.reduce((s, t) => s + t.pnl, 0);

  const pf = (arr: ClosedTrade[]) => {
    const gp = arr.filter((t) => t.pnl > 0).reduce((s, t) => s + t.pnl, 0);
    const gl = arr.filter((t) => t.pnl < 0).reduce((s, t) => s + t.pnl, 0);
    return gl !== 0 ? gp / Math.abs(gl) : gp > 0 ? gp : 0;
  };

  return {
    netPnl,
    netPnlDeltaPct: pctChange(curNet, prevNet),
    profitFactor,
    profitFactorDeltaPct: pctChange(pf(curMonthTrades), pf(prevMonthTrades)),
    winRate,
    avgR,
    grossProfit,
    grossLoss,
  };
}

/** Cumulative equity by month for the trailing 12 months. */
function computeEquityCurve(closed: ClosedTrade[], now: Date): EquityPoint[] {
  const points: EquityPoint[] = [];
  let running = 0;

  // Sum P&L per (year, month).
  const monthly = new Map<string, number>();
  for (const t of closed) {
    const d = effectiveDate(t);
    const key = `${d.getFullYear()}-${d.getMonth()}`;
    monthly.set(key, (monthly.get(key) ?? 0) + t.pnl);
  }

  // Seed running total with everything older than the 12-month window.
  const windowStart = new Date(now.getFullYear(), now.getMonth() - 11, 1);
  for (const t of closed) {
    if (effectiveDate(t) < windowStart) running += t.pnl;
  }

  for (let i = 11; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const key = `${d.getFullYear()}-${d.getMonth()}`;
    running += monthly.get(key) ?? 0;
    points.push({ date: MONTHS[d.getMonth()], equity: running });
  }

  return points;
}

/** Per-day P&L for the current month (null = no closed trades that day). */
function computeCalendar(closed: ClosedTrade[], now: Date): DashboardData["calendar"] {
  const month = now.getMonth();
  const year = now.getFullYear();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const byDay = new Map<number, number>();
  for (const t of closed) {
    const d = effectiveDate(t);
    if (d.getMonth() === month && d.getFullYear() === year) {
      byDay.set(d.getDate(), (byDay.get(d.getDate()) ?? 0) + t.pnl);
    }
  }

  const days: CalendarDay[] = Array.from({ length: daysInMonth }, (_, i) => {
    const day = i + 1;
    return { day, pnl: byDay.has(day) ? byDay.get(day)! : null };
  });

  return {
    month: now.toLocaleDateString("en-US", { month: "long" }),
    year,
    startWeekday: new Date(year, month, 1).getDay(),
    days,
  };
}

/** Top instruments by total P&L, with per-symbol win rate. */
function computeTopPairs(closed: ClosedTrade[]): PairPerformance[] {
  const groups = new Map<string, { pnl: number; wins: number; total: number }>();
  for (const t of closed) {
    const g = groups.get(t.symbol) ?? { pnl: 0, wins: 0, total: 0 };
    g.pnl += t.pnl;
    g.total += 1;
    if (t.pnl > 0) g.wins += 1;
    groups.set(t.symbol, g);
  }

  return Array.from(groups.entries())
    .map(([symbol, g]) => ({
      symbol,
      label: symbol,
      winRate: g.total ? Math.round((g.wins / g.total) * 100) : 0,
      pnl: g.pnl,
    }))
    .sort((a, b) => b.pnl - a.pnl)
    .slice(0, 5);
}

/**
 * Derives the full dashboard payload from raw trades.
 * `now` is injected so callers can pass a stable server timestamp.
 */
export function computeDashboard(trades: Trade[], now: Date): DashboardData {
  const closed = trades.filter(isClosed);

  return {
    kpis: computeKpis(closed, now),
    equityCurve: computeEquityCurve(closed, now),
    topPairs: computeTopPairs(closed),
    calendar: computeCalendar(closed, now),
    lastImportedAt: now.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }),
  };
}
