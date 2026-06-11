import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { getSession } from "../supabase.js";
import { fetchTradeById, mapRow } from "../trades.js";
import { computePnl } from "../pnl.js";
import { ok, fail, guard } from "../result.js";
import type { TradeUpdate } from "../types.js";

const dateString = z
  .string()
  .refine((s) => !Number.isNaN(Date.parse(s)), "must be a valid ISO date/datetime");

const inputSchema = {
  id: z.string().uuid().describe("Trade id to update"),
  symbol: z.string().min(1).optional(),
  direction: z.enum(["long", "short"]).optional(),
  entry_price: z.number().positive().optional(),
  quantity: z.number().positive().optional(),
  entry_date: dateString.optional(),
  exit_price: z.number().positive().nullable().optional().describe("Set null to reopen the trade"),
  exit_date: dateString.nullable().optional(),
  notes: z.string().nullable().optional(),
  tags: z.array(z.string()).nullable().optional(),
  strategy: z.string().nullable().optional(),
  setup_type: z.string().nullable().optional(),
};

export function registerEditTrade(server: McpServer): void {
  server.registerTool(
    "edit_trade",
    {
      title: "Edit trade",
      description:
        "Update any fields on an existing trade. P&L is recomputed when direction, " +
        "entry_price, exit_price, or quantity change. Set exit_price to null to reopen.",
      inputSchema,
    },
    async (input) =>
      guard(async () => {
        const existing = await fetchTradeById(input.id);
        if (!existing) return fail(`No trade found with id ${input.id}.`);

        const update: TradeUpdate = {};
        if (input.symbol !== undefined) update.symbol = input.symbol.toUpperCase();
        if (input.direction !== undefined) update.direction = input.direction;
        if (input.entry_price !== undefined) update.entry_price = input.entry_price;
        if (input.quantity !== undefined) update.quantity = input.quantity;
        if (input.entry_date !== undefined) update.entry_at = input.entry_date;
        if (input.exit_price !== undefined) update.exit_price = input.exit_price;
        if (input.exit_date !== undefined) update.exit_at = input.exit_date;
        if (input.notes !== undefined) update.notes = input.notes;
        if (input.tags !== undefined) update.tags = input.tags;
        if (input.strategy !== undefined) update.strategy = input.strategy;
        if (input.setup_type !== undefined) update.setup_type = input.setup_type;

        if (Object.keys(update).length === 0) {
          return fail("No fields provided to update.");
        }

        // Resolve effective values to validate dates and recompute P&L.
        const direction = input.direction ?? existing.direction;
        const entryPrice = input.entry_price ?? existing.entry_price;
        const quantity = input.quantity ?? existing.quantity;
        const exitPrice =
          input.exit_price !== undefined ? input.exit_price : existing.exit_price ?? null;
        const entryAt = input.entry_date ?? existing.entry_at;
        const exitAt =
          input.exit_date !== undefined ? input.exit_date : existing.exit_at ?? null;

        if (exitAt && Date.parse(exitAt) < Date.parse(entryAt)) {
          return fail("exit_date cannot be earlier than entry_date.");
        }

        const affectsPnl =
          input.direction !== undefined ||
          input.entry_price !== undefined ||
          input.exit_price !== undefined ||
          input.quantity !== undefined;

        if (affectsPnl) {
          update.pnl =
            exitPrice != null
              ? computePnl(direction, entryPrice, exitPrice, quantity)
              : null;
        }

        const { client } = await getSession();
        const { data, error } = await client
          .from("trades")
          .update(update)
          .eq("id", input.id)
          .select("*")
          .single();

        if (error) throw new Error(`Failed to update trade: ${error.message}`);
        return ok({ updated: mapRow(data) });
      }),
  );
}
