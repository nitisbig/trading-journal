import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { InMemoryTransport } from "@modelcontextprotocol/sdk/inMemory.js";
import { createServer } from "../src/server.js";

async function main() {
  const server = createServer();
  const [clientT, serverT] = InMemoryTransport.createLinkedPair();
  await server.connect(serverT);
  const client = new Client({ name: "write-test", version: "0" });
  await client.connect(clientT);

  const call = async (name: string, args: Record<string, unknown> = {}) => {
    const res = await client.callTool({ name, arguments: args });
    const text = (res.content as { type: string; text: string }[]).map((c) => c.text).join("\n");
    const data = (() => { try { return JSON.parse(text); } catch { return text; } })();
    const tag = res.isError ? " [isError]" : "";
    console.log(`\n=== ${name}${tag} ===`);
    console.log(typeof data === "string" ? data : JSON.stringify(data, null, 2));
    return { data, isError: res.isError === true };
  };

  // 1. add a closed short: pnl = (90-100)*5 negated = +50
  const added = await call("add_trade", {
    symbol: "test", direction: "short", entry_price: 100, exit_price: 90,
    quantity: 5, entry_date: "2026-06-01T10:00:00Z", exit_date: "2026-06-01T12:00:00Z",
    strategy: "mcp-smoke", setup_type: "reversal", tags: ["delete-me"],
  });
  const id = added.data.created.id as string;
  console.log(`\n>> add pnl expect 50, got ${added.data.created.pnl}`);

  // 2. edit exit -> 80: pnl = (80-100)*5 negated = +100
  const edited = await call("edit_trade", { id, exit_price: 80 });
  console.log(`>> edit pnl expect 100, got ${edited.data.updated.pnl}`);

  // 3. soft-delete -> hidden
  await call("delete_trade", { id });
  const hidden = await call("get_trade_by_id", { id });
  console.log(`>> after soft-delete, get_trade_by_id isError(not found) = ${hidden.isError}`);

  // 4. restore -> visible again
  const restored = await call("restore_trade", { id });
  console.log(`>> restored visible = ${restored.data.restored?.id === id}`);

  // 5. soft-delete again, then hard-purge the soft-deleted row
  await call("delete_trade", { id });
  const purged = await call("delete_trade", { id, hard: true });
  console.log(`>> hard purge of soft-deleted row mode = ${purged.data.deleted?.mode}, isError = ${purged.isError}`);

  // 6. confirm truly gone
  const gone = await call("get_trade_by_id", { id });
  console.log(`>> after purge, get_trade_by_id isError(not found) = ${gone.isError}`);

  await client.close();
  await server.close();
}

main().catch((e) => { console.error(e); process.exit(1); });
