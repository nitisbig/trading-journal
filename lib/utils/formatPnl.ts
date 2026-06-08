/** Format a number as USD, e.g. 107183.75 → "$107,183.75". */
export function formatCurrency(value: number, fractionDigits = 2): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits,
  }).format(value);
}

/** Format a P&L with an explicit sign, e.g. 3450 → "+$3,450.00", -1430 → "-$1,430.00". */
export function formatSignedCurrency(value: number, fractionDigits = 2): string {
  const sign = value > 0 ? "+" : value < 0 ? "-" : "";
  return `${sign}${formatCurrency(Math.abs(value), fractionDigits)}`;
}

/** Format a percentage with an explicit sign, e.g. 6.4 → "+6.4%". */
export function formatSignedPercent(value: number, fractionDigits = 1): string {
  const sign = value > 0 ? "+" : value < 0 ? "-" : "";
  return `${sign}${Math.abs(value).toFixed(fractionDigits)}%`;
}

/** Plain percentage, e.g. 68.2 → "68.2%". */
export function formatPercent(value: number, fractionDigits = 1): string {
  return `${value.toFixed(fractionDigits)}%`;
}

/** Tailwind text-color class for a value's sign (profit/loss/neutral). */
export function pnlColorClass(value: number): string {
  if (value > 0) return "text-profit";
  if (value < 0) return "text-loss";
  return "text-ink-muted";
}
