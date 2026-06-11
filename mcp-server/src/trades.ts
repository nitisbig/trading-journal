import { getSession } from "./supabase.js";
import type { Trade, TradeDirection, TradeRow } from "./types.js";

/** Maps a raw DB row to the app's Trade shape (nulls → undefined). */
export function mapRow(row: TradeRow): Trade {
  return {
    id: row.id,
    user_id: row.user_id,
    symbol: row.symbol,
    direction: row.direction as TradeDirection,
    entry_price: row.entry_price,
    exit_price: row.exit_price ?? undefined,
    quantity: row.quantity,
    entry_at: row.entry_at,
    exit_at: row.exit_at ?? undefined,
    pnl: row.pnl ?? undefined,
    strategy: row.strategy ?? undefined,
    setup_type: row.setup_type ?? undefined,
    notes: row.notes ?? undefined,
    tags: row.tags ?? undefined,
    created_at: row.created_at,
  };
}

export interface TradeFilters {
  symbol?: string;
  from?: string;
  to?: string;
  status?: "open" | "closed" | "all";
  strategy?: string;
  setupType?: string;
  limit?: number;
}

/**
 * Fetches the current user's trades with optional filters, newest entry first.
 * Soft-deleted rows are already excluded by the RLS SELECT policy.
 */
export async function fetchTrades(filters: TradeFilters = {}): Promise<Trade[]> {
  const { client } = await getSession();

  let query = client.from("trades").select("*").order("entry_at", { ascending: false });

  if (filters.symbol) query = query.eq("symbol", filters.symbol.toUpperCase());
  if (filters.strategy) query = query.eq("strategy", filters.strategy);
  if (filters.setupType) query = query.eq("setup_type", filters.setupType);
  if (filters.from) query = query.gte("entry_at", filters.from);
  if (filters.to) query = query.lte("entry_at", filters.to);

  if (filters.status === "open") query = query.is("exit_at", null);
  else if (filters.status === "closed") query = query.not("exit_at", "is", null);

  if (filters.limit != null) query = query.limit(filters.limit);

  const { data, error } = await query;
  if (error) throw new Error(`Failed to load trades: ${error.message}`);

  return (data ?? []).map(mapRow);
}

/** Fetches a single trade by id, or null when not found / not owned. */
export async function fetchTradeById(id: string): Promise<Trade | null> {
  const { client } = await getSession();
  const { data, error } = await client
    .from("trades")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) throw new Error(`Failed to load trade: ${error.message}`);
  return data ? mapRow(data) : null;
}
