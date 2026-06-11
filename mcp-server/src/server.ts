import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { registerGetRecentTrades } from "./tools/getRecentTrades.js";
import { registerGetTradeById } from "./tools/getTradeById.js";
import { registerSearchTrades } from "./tools/searchTrades.js";
import { registerAddTrade } from "./tools/addTrade.js";
import { registerEditTrade } from "./tools/editTrade.js";
import { registerDeleteTrade } from "./tools/deleteTrade.js";
import { registerRestoreTrade } from "./tools/restoreTrade.js";
import { registerAnalyzeTrades } from "./tools/analyzeTrades.js";
import { registerGetAccountStats } from "./tools/getAccountStats.js";

export function createServer(): McpServer {
  const server = new McpServer({
    name: "trading-journal-mcp",
    version: "0.1.0",
  });

  registerGetRecentTrades(server);
  registerGetTradeById(server);
  registerSearchTrades(server);
  registerAddTrade(server);
  registerEditTrade(server);
  registerDeleteTrade(server);
  registerRestoreTrade(server);
  registerAnalyzeTrades(server);
  registerGetAccountStats(server);

  return server;
}
