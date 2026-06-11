import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { fetchTrades } from "../trades.js";
import { isClosed, summarize, computeMaxDrawdown, computeStreaks } from "../analytics.js";
import { ok, guard } from "../result.js";

const inputSchema = {
  from: z.string().optional().describe("ISO date/datetime lower bound on entry time"),
  to: z.string().optional().describe("ISO date/datetime upper bound on entry time"),
};

export function registerGetAccountStats(server: McpServer): void {
  server.registerTool(
    "get_account_stats",
    {
      title: "Get account stats",
      description:
        "Overall account summary: net P&L, trade counts (open/closed), win rate, " +
        "gross profit/loss, profit factor, max drawdown, and current/longest streaks. " +
        "Optionally bounded by an entry-time date range.",
      inputSchema,
    },
    async ({ from, to }) =>
      guard(async () => {
        const all = await fetchTrades({ from, to, status: "all" });
        const closed = all.filter(isClosed);
        const open = all.length - closed.length;
        const core = summarize(closed);

        return ok({
          totalTrades: all.length,
          openTrades: open,
          closedTrades: closed.length,
          netPnl: core.netPnl,
          grossProfit: core.grossProfit,
          grossLoss: core.grossLoss,
          winRate: core.winRate,
          profitFactor: core.profitFactor,
          avgRR: core.avgRR,
          expectancy: core.expectancy,
          maxDrawdown: computeMaxDrawdown(closed),
          ...computeStreaks(closed),
        });
      }),
  );
}
