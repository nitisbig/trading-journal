import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { fetchTradeById } from "../trades.js";
import { ok, fail, guard } from "../result.js";

const inputSchema = {
  id: z.string().uuid().describe("Trade id (uuid)"),
};

export function registerGetTradeById(server: McpServer): void {
  server.registerTool(
    "get_trade_by_id",
    {
      title: "Get trade by id",
      description: "Fetch a single trade's full details by its id.",
      inputSchema,
    },
    async ({ id }) =>
      guard(async () => {
        const trade = await fetchTradeById(id);
        if (!trade) return fail(`No trade found with id ${id}.`);
        return ok(trade);
      }),
  );
}
