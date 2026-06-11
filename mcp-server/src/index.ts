#!/usr/bin/env node
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { createServer } from "./server.js";
import { getSession } from "./supabase.js";

async function main(): Promise<void> {
  // Fail fast on bad credentials before exposing the protocol stream.
  await getSession();

  const server = createServer();
  const transport = new StdioServerTransport();
  await server.connect(transport);

  // stderr only — stdout carries the MCP JSON-RPC stream.
  console.error("[trading-journal-mcp] ready on stdio");
}

main().catch((err) => {
  const message = err instanceof Error ? err.message : String(err);
  console.error(`[trading-journal-mcp] fatal: ${message}`);
  process.exit(1);
});
