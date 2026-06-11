import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { fetchTrades } from "../trades.js";
import {
  isClosed,
  summarize,
  computeStreaks,
  computeMaxDrawdown,
  groupBy,
} from "../analytics.js";
import { ok, guard } from "../result.js";

const inputSchema = {
  symbol: z.string().optional().describe("Restrict to a ticker (exact, case-insensitive)"),
  from: z.string().optional().describe("ISO date/datetime lower bound on entry time"),
  to: z.string().optional().describe("ISO date/datetime upper bound on entry time"),
  strategy: z.string().optional().describe("Restrict to a strategy"),
  setup_type: z.string().optional().describe("Restrict to a setup type"),
  group_by: z
    .enum(["symbol", "strategy", "setup_type"])
    .optional()
    .describe("Return a per-group performance breakdown"),
};

export function registerAnalyzeTrades(server: McpServer): void {
  server.registerTool(
    "analyze_trades",
    {
      title: "Analyze trades",
      description:
        "Compute performance metrics over a filtered set of trades: win rate, avg RR, " +
        "profit factor, best/worst trade, streaks, max drawdown, and an optional " +
        "breakdown by symbol/strategy/setup_type. Only closed trades count toward metrics.",
      inputSchema,
    },
    async ({ symbol, from, to, strategy, setup_type, group_by }) =>
      guard(async () => {
        const all = await fetchTrades({
          symbol,
          from,
          to,
          strategy,
          setupType: setup_type,
          status: "all",
        });
        const closed = all.filter(isClosed);

        return ok({
          sample: { matched: all.length, closed: closed.length, openExcluded: all.length - closed.length },
          metrics: summarize(closed),
          streaks: computeStreaks(closed),
          maxDrawdown: computeMaxDrawdown(closed),
          ...(group_by ? { breakdown: { by: group_by, groups: groupBy(closed, group_by) } } : {}),
        });
      }),
  );
}
