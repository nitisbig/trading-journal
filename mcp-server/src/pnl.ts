import type { TradeDirection } from "./types.js";

/**
 * Realized P&L for a closed trade. Mirrors the web app's server-side rule:
 * (exit - entry) * quantity for longs, negated for shorts.
 */
export function computePnl(
  direction: TradeDirection,
  entryPrice: number,
  exitPrice: number,
  quantity: number,
): number {
  const raw = (exitPrice - entryPrice) * quantity;
  return direction === "long" ? raw : -raw;
}
