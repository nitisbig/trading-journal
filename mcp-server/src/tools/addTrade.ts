import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { getSession } from "../supabase.js";
import { mapRow } from "../trades.js";
import { computePnl } from "../pnl.js";
import { ok, fail, guard } from "../result.js";

const dateString = z
  .string()
  .refine((s) => !Number.isNaN(Date.parse(s)), "must be a valid ISO date/datetime");

const inputSchema = {
  symbol: z.string().min(1).describe("Ticker, e.g. NVDA (stored uppercase)"),
  direction: z.enum(["long", "short"]),
  entry_price: z.number().positive(),
  quantity: z.number().positive(),
  entry_date: dateString.describe("ISO entry time"),
  exit_price: z.number().positive().optional().describe("Provide to close the trade and compute P&L"),
  exit_date: dateString.optional().describe("ISO exit time (must be >= entry_date)"),
  notes: z.string().optional(),
  tags: z.array(z.string()).optional(),
  strategy: z.string().optional(),
  setup_type: z.string().optional(),
};

export function registerAddTrade(server: McpServer): void {
  server.registerTool(
    "add_trade",
    {
      title: "Add trade",
      description:
        "Create a new trade. If exit_price is given the trade is treated as closed " +
        "and its realized P&L is computed automatically.",
      inputSchema,
    },
    async (input) =>
      guard(async () => {
        const { client, userId } = await getSession();

        if (input.exit_date && Date.parse(input.exit_date) < Date.parse(input.entry_date)) {
          return fail("exit_date cannot be earlier than entry_date.");
        }

        const pnl =
          input.exit_price != null
            ? computePnl(input.direction, input.entry_price, input.exit_price, input.quantity)
            : null;

        const { data, error } = await client
          .from("trades")
          .insert({
            user_id: userId,
            symbol: input.symbol.toUpperCase(),
            direction: input.direction,
            entry_price: input.entry_price,
            exit_price: input.exit_price ?? null,
            quantity: input.quantity,
            entry_at: input.entry_date,
            exit_at: input.exit_date ?? null,
            pnl,
            notes: input.notes ?? null,
            tags: input.tags ?? null,
            strategy: input.strategy ?? null,
            setup_type: input.setup_type ?? null,
          })
          .select("*")
          .single();

        if (error) throw new Error(`Failed to add trade: ${error.message}`);
        return ok({ created: mapRow(data) });
      }),
  );
}
