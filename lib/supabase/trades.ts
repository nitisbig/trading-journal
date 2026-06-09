import { createClient } from "@/lib/supabase/server";
import type { Database } from "@/types/database";
import type { Trade, TradeDirection } from "@/types/trade";

type TradeRow = Database["public"]["Tables"]["trades"]["Row"];

/** Maps a raw DB row to the app's Trade type. */
function mapRow(row: TradeRow): Trade {
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
    notes: row.notes ?? undefined,
    tags: row.tags ?? undefined,
    created_at: row.created_at,
  };
}

/** Fetches the current user's trades, newest entry first. */
export async function getTrades(): Promise<Trade[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("trades")
    .select("*")
    .order("entry_at", { ascending: false });

  if (error) {
    throw new Error(`Failed to load trades: ${error.message}`);
  }

  return (data ?? []).map(mapRow);
}
