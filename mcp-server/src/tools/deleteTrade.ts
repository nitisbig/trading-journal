import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { getSession } from "../supabase.js";
import { fetchTradeById } from "../trades.js";
import { ok, fail, guard } from "../result.js";

const inputSchema = {
  id: z.string().uuid().describe("Trade id to delete"),
  hard: z
    .boolean()
    .optional()
    .describe(
      "true = permanent delete (works even on already soft-deleted trades). " +
        "Default false = soft-delete (recoverable via restore_trade).",
    ),
};

export function registerDeleteTrade(server: McpServer): void {
  server.registerTool(
    "delete_trade",
    {
      title: "Delete trade",
      description:
        "Delete a trade. By default this is a soft-delete (sets deleted_at; the row " +
        "is hidden from reads but recoverable with restore_trade). Pass hard=true to " +
        "remove it permanently, including trades that were already soft-deleted.",
      inputSchema,
    },
    async ({ id, hard }) =>
      guard(async () => {
        const { client } = await getSession();
        // Snapshot for the response; null when the trade is already soft-deleted
        // (hidden from reads) — the RPC below still enforces existence/ownership.
        const snapshot = await fetchTradeById(id);

        if (hard) {
          const { error } = await client.rpc("hard_delete_trade", { p_id: id });
          if (error) return fail(`Failed to delete trade ${id}: ${error.message}`);
          return ok({ deleted: { id, mode: "hard" }, trade: snapshot });
        }

        const { error } = await client.rpc("soft_delete_trade", { p_id: id });
        if (error) return fail(`Failed to soft-delete trade ${id}: ${error.message}`);
        return ok({ deleted: { id, mode: "soft" }, trade: snapshot });
      }),
  );
}
