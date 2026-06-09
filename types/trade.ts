export type TradeDirection = "long" | "short";

export interface Trade {
  id: string;
  user_id: string;
  symbol: string;
  direction: TradeDirection;
  entry_price: number;
  exit_price?: number;
  quantity: number;
  entry_at: string;
  exit_at?: string;
  pnl?: number;
  strategy?: string;
  notes?: string;
  tags?: string[];
  created_at: string;
}

/** A single point on the equity curve. */
export interface EquityPoint {
  date: string;
  equity: number;
}

/** Aggregate performance for one instrument, used by Top Pairs. */
export interface PairPerformance {
  symbol: string;
  label: string;
  winRate: number;
  pnl: number;
}

/** Per-day P&L cell shown on the monthly calendar. */
export interface CalendarDay {
  day: number;
  pnl: number | null;
}

/** Headline KPIs shown on the dashboard hero + stats row. */
export interface DashboardKpis {
  netPnl: number;
  netPnlDeltaPct: number;
  profitFactor: number;
  profitFactorDeltaPct: number;
  winRate: number;
  avgR: number;
  grossProfit: number;
  grossLoss: number;
}

/** Everything the dashboard screen renders. */
export interface DashboardData {
  kpis: DashboardKpis;
  equityCurve: EquityPoint[];
  topPairs: PairPerformance[];
  calendar: {
    month: string;
    year: number;
    /** Weekday index (0=Sun) that the 1st of the month falls on. */
    startWeekday: number;
    days: CalendarDay[];
  };
  lastImportedAt: string;
}
