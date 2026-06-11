import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { getSession } from "../supabase.js";
import { mapRow } from "../trades.js";
import { ok, guard } from "../result.js";

const inputSchema = {
  query: z.string().min(1).describe("Text to search across notes, symbol, strategy, setup_type, and tags"),
  limit: z.number().int().positive().max(100).optional().describe("Max rows (default 50, max 100)"),
};

export function registerSearchTrades(server: McpServer): void {
  server.registerTool(
    "search_trades",
    {
      title: "Search trades",
      description:
        "Case-insensitive search across trade notes, symbol, strategy, setup_type, " +
        "and tags. Returns matching trades, newest first.",
      inputSchema,
    },
    async ({ query, limit }) =>
      guard(async () => {
        const { client } = await getSession();
        const term = query.trim();
        // Double-quote ilike values so reserved chars (, . ( )) in the term don't
        // break PostgREST's or() parser; drop embedded quotes to keep it well-formed.
        const safe = term.replace(/"/g, "");
        const like = `"%${safe}%"`;
        const tagTerm = safe.replace(/[{},]/g, "");

        // Match any text column via ilike, or the tags array via `contains`.
        const { data, error } = await client
          .from("trades")
          .select("*")
          .or(
            [
              `symbol.ilike.${like}`,
              `notes.ilike.${like}`,
              `strategy.ilike.${like}`,
              `setup_type.ilike.${like}`,
              `tags.cs.{"${tagTerm}"}`,
            ].join(","),
          )
          .order("entry_at", { ascending: false })
          .limit(limit ?? 50);

        if (error) throw new Error(`Search failed: ${error.message}`);

        const trades = (data ?? []).map(mapRow);
        return ok({ count: trades.length, query: term, trades });
      }),
  );
}
