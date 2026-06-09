"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type { TradeDirection } from "@/types/trade";

export interface CreateTradeState {
  error?: string;
  success?: boolean;
}

function parseNumber(value: FormDataEntryValue | null): number | null {
  if (value == null || value === "") return null;
  const n = Number(value);
  return Number.isFinite(n) ? n : null;
}

/** Computes realized P&L for a closed trade. */
function computePnl(
  direction: TradeDirection,
  entry: number,
  exit: number,
  quantity: number,
): number {
  const raw = (exit - entry) * quantity;
  return direction === "long" ? raw : -raw;
}

export async function createTrade(
  _prev: CreateTradeState,
  formData: FormData,
): Promise<CreateTradeState> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "You must be signed in to add a trade." };
  }

  const symbol = String(formData.get("symbol") ?? "").trim().toUpperCase();
  const direction = String(formData.get("direction") ?? "") as TradeDirection;
  const entry_price = parseNumber(formData.get("entry_price"));
  const exit_price = parseNumber(formData.get("exit_price"));
  const quantity = parseNumber(formData.get("quantity"));
  const entryRaw = String(formData.get("entry_at") ?? "");
  const exitRaw = String(formData.get("exit_at") ?? "");
  const strategy = String(formData.get("strategy") ?? "").trim();
  const notes = String(formData.get("notes") ?? "").trim();
  const tagsRaw = String(formData.get("tags") ?? "").trim();

  if (!symbol) return { error: "Symbol is required." };
  if (direction !== "long" && direction !== "short") {
    return { error: "Direction must be long or short." };
  }
  if (entry_price == null) return { error: "A valid entry price is required." };
  if (quantity == null || quantity <= 0) {
    return { error: "Quantity must be greater than zero." };
  }
  if (!entryRaw) return { error: "Entry date/time is required." };

  const entry_at = new Date(entryRaw).toISOString();
  const exit_at = exitRaw ? new Date(exitRaw).toISOString() : null;

  const pnl =
    exit_price != null
      ? computePnl(direction, entry_price, exit_price, quantity)
      : null;

  const tags = tagsRaw
    ? tagsRaw
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean)
    : null;

  const { error } = await supabase.from("trades").insert({
    user_id: user.id,
    symbol,
    direction,
    entry_price,
    exit_price,
    quantity,
    entry_at,
    exit_at,
    pnl,
    strategy: strategy || null,
    notes: notes || null,
    tags,
  });

  if (error) {
    return { error: `Could not save trade: ${error.message}` };
  }

  revalidatePath("/trades");
  revalidatePath("/dashboard");
  return { success: true };
}
