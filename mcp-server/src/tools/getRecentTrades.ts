import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { fetchTrades } from "../trades.js";
import { ok, guard } from "../result.js";

const inputSchema = {
  symbol: z.string().optional().describe("Filter by ticker (case-insensitive, exact match)"),
  from: z.string().optional().describe("ISO date/datetime lower bound on entry time"),
  to: z.string().optional().describe("ISO date/datetime upper bound on entry time"),
  status: z
    .enum(["open", "closed", "all"])
    .optional()
    .describe("open = no exit yet, closed = has exit. Default all."),
  limit: z.number().int().positive().max(100).optional().describe("Max rows (default 20, max 100)"),
};

export function registerGetRecentTrades(server: McpServer): void {
  server.registerTool(
    "get_recent_trades",
    {
      title: "Get recent trades",
      description:
        "Fetch the user's recent trades, newest first, with optional symbol, date " +
        "range, and open/closed status filters.",
      inputSchema,
    },
    async ({ symbol, from, to, status, limit }) =>
      guard(async () => {
        const trades = await fetchTrades({
          symbol,
          from,
          to,
          status: status ?? "all",
          limit: limit ?? 20,
        });
        return ok({ count: trades.length, trades });
      }),
  );
}
