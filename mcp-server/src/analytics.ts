import type { Trade } from "./types.js";

export type ClosedTrade = Trade & { pnl: number };

/** A trade counts as closed once it has a realized pnl. */
export function isClosed(t: Trade): t is ClosedTrade {
  return typeof t.pnl === "number";
}

/** Date a closed trade is attributed to: exit if present, else entry. */
function effectiveDate(t: Trade): string {
  return t.exit_at ?? t.entry_at;
}

export interface CoreMetrics {
  trades: number;
  wins: number;
  losses: number;
  breakeven: number;
  winRate: number; // percentage 0..100
  netPnl: number;
  grossProfit: number;
  grossLoss: number; // negative
  profitFactor: number | null; // null when there are no losses
  avgWin: number;
  avgLoss: number; // positive magnitude
  avgRR: number | null; // avgWin / avgLoss; null when undefined
  expectancy: number; // avg pnl per trade
  bestTrade: { id: string; symbol: string; pnl: number } | null;
  worstTrade: { id: string; symbol: string; pnl: number } | null;
}

export function summarize(closed: ClosedTrade[]): CoreMetrics {
  const trades = closed.length;
  const wins = closed.filter((t) => t.pnl > 0);
  const losses = closed.filter((t) => t.pnl < 0);
  const breakeven = closed.filter((t) => t.pnl === 0).length;

  const grossProfit = wins.reduce((s, t) => s + t.pnl, 0);
  const grossLoss = losses.reduce((s, t) => s + t.pnl, 0); // negative
  const netPnl = grossProfit + grossLoss;

  const avgWin = wins.length ? grossProfit / wins.length : 0;
  const avgLoss = losses.length ? Math.abs(grossLoss) / losses.length : 0;

  let best: ClosedTrade | null = null;
  let worst: ClosedTrade | null = null;
  for (const t of closed) {
    if (!best || t.pnl > best.pnl) best = t;
    if (!worst || t.pnl < worst.pnl) worst = t;
  }

  return {
    trades,
    wins: wins.length,
    losses: losses.length,
    breakeven,
    winRate: trades ? (wins.length / trades) * 100 : 0,
    netPnl,
    grossProfit,
    grossLoss,
    profitFactor: grossLoss !== 0 ? grossProfit / Math.abs(grossLoss) : null,
    avgWin,
    avgLoss,
    avgRR: avgLoss > 0 ? avgWin / avgLoss : null,
    expectancy: trades ? netPnl / trades : 0,
    bestTrade: best ? { id: best.id, symbol: best.symbol, pnl: best.pnl } : null,
    worstTrade: worst ? { id: worst.id, symbol: worst.symbol, pnl: worst.pnl } : null,
  };
}

export interface StreakInfo {
  /** Positive = current win streak, negative = current loss streak, 0 = none/breakeven. */
  currentStreak: number;
  longestWinStreak: number;
  longestLossStreak: number;
}

export function computeStreaks(closed: ClosedTrade[]): StreakInfo {
  const sorted = [...closed].sort((a, b) =>
    effectiveDate(a).localeCompare(effectiveDate(b)),
  );

  let run = 0;
  let runType: "win" | "loss" | null = null;
  let longestWin = 0;
  let longestLoss = 0;

  for (const t of sorted) {
    if (t.pnl > 0) {
      run = runType === "win" ? run + 1 : 1;
      runType = "win";
      longestWin = Math.max(longestWin, run);
    } else if (t.pnl < 0) {
      run = runType === "loss" ? run + 1 : 1;
      runType = "loss";
      longestLoss = Math.max(longestLoss, run);
    } else {
      run = 0;
      runType = null;
    }
  }

  const currentStreak = runType === "win" ? run : runType === "loss" ? -run : 0;
  return { currentStreak, longestWinStreak: longestWin, longestLossStreak: longestLoss };
}

/** Max peak-to-trough decline of the cumulative equity curve (positive number). */
export function computeMaxDrawdown(closed: ClosedTrade[]): number {
  const sorted = [...closed].sort((a, b) =>
    effectiveDate(a).localeCompare(effectiveDate(b)),
  );

  let equity = 0;
  let peak = 0;
  let maxDrawdown = 0;
  for (const t of sorted) {
    equity += t.pnl;
    peak = Math.max(peak, equity);
    maxDrawdown = Math.max(maxDrawdown, peak - equity);
  }
  return maxDrawdown;
}

export interface GroupPerformance {
  key: string;
  trades: number;
  netPnl: number;
  winRate: number;
}

/** Aggregates closed trades by one of the categorical fields. */
export function groupBy(
  closed: ClosedTrade[],
  field: "symbol" | "strategy" | "setup_type",
): GroupPerformance[] {
  const buckets = new Map<string, ClosedTrade[]>();
  for (const t of closed) {
    const key = (t[field] as string | undefined) ?? "(none)";
    const bucket = buckets.get(key);
    if (bucket) bucket.push(t);
    else buckets.set(key, [t]);
  }

  return [...buckets.entries()]
    .map(([key, group]) => {
      const wins = group.filter((t) => t.pnl > 0).length;
      return {
        key,
        trades: group.length,
        netPnl: group.reduce((s, t) => s + t.pnl, 0),
        winRate: group.length ? (wins / group.length) * 100 : 0,
      };
    })
    .sort((a, b) => b.netPnl - a.netPnl);
}
