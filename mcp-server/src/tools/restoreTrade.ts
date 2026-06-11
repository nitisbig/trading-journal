import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { getSession } from "../supabase.js";
import { fetchTradeById } from "../trades.js";
import { ok, fail, guard } from "../result.js";

const inputSchema = {
  id: z.string().uuid().describe("Id of a soft-deleted trade to restore"),
};

export function registerRestoreTrade(server: McpServer): void {
  server.registerTool(
    "restore_trade",
    {
      title: "Restore trade",
      description:
        "Recover a soft-deleted trade by clearing its deleted_at, bringing it back " +
        "into normal reads. Fails if the trade does not exist or was not deleted.",
      inputSchema,
    },
    async ({ id }) =>
      guard(async () => {
        const { client } = await getSession();
        const { error } = await client.rpc("restore_trade", { p_id: id });
        if (error) return fail(`Failed to restore trade ${id}: ${error.message}`);

        // Now visible again — return the restored trade.
        const trade = await fetchTradeById(id);
        return ok({ restored: trade });
      }),
  );
}
