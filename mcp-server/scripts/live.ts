// Live end-to-end check: real Supabase sign-in + real tool calls through the
// actual client/server path. Requires the four env vars to be set.
//
//   SUPABASE_URL=... SUPABASE_ANON_KEY=... \
//   TRADING_JOURNAL_EMAIL=... TRADING_JOURNAL_PASSWORD=... \
//   npx tsx scripts/live.ts
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { InMemoryTransport } from "@modelcontextprotocol/sdk/inMemory.js";
import { createServer } from "../src/server.js";

async function main() {
  const server = createServer();
  const [clientT, serverT] = InMemoryTransport.createLinkedPair();
  await server.connect(serverT);
  const client = new Client({ name: "live", version: "0" });
  await client.connect(clientT);

  const call = async (name: string, args: Record<string, unknown> = {}) => {
    const res = await client.callTool({ name, arguments: args });
    const text = (res.content as { type: string; text: string }[])
      .map((c) => c.text)
      .join("\n");
    console.log(`\n=== ${name}(${JSON.stringify(args)})${res.isError ? " [isError]" : ""} ===`);
    console.log(text.slice(0, 1200));
  };

  await call("get_account_stats");
  await call("get_recent_trades", { limit: 3 });
  await call("analyze_trades", { group_by: "symbol" });

  await client.close();
  await server.close();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
