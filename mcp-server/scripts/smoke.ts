import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { InMemoryTransport } from "@modelcontextprotocol/sdk/inMemory.js";
import { createServer } from "../src/server.js";

async function main() {
  const server = createServer();
  const [clientT, serverT] = InMemoryTransport.createLinkedPair();
  await server.connect(serverT);

  const client = new Client({ name: "smoke", version: "0" });
  await client.connect(clientT);

  const { tools } = await client.listTools();
  console.log(`tools (${tools.length}):`);
  for (const t of tools) {
    const keys = Object.keys(t.inputSchema?.properties ?? {});
    console.log(`  - ${t.name}(${keys.join(", ")})`);
  }

  await client.close();
  await server.close();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
