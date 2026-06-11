# Trading Journal MCP Server

Connect your [Trading Journal](../README.md) account to any MCP client (Claude
Code, Claude Desktop, …) and query, log, and analyze your trades in natural
language.

It runs locally, signs in to Supabase as you, and is scoped to your data by Row
Level Security — no service-role key, no `user_id` juggling.

## Tools

| Tool | What it does |
|---|---|
| `get_recent_trades` | Recent trades with symbol / date-range / open-closed filters |
| `get_trade_by_id` | Full details for one trade |
| `search_trades` | Text search across notes, symbol, strategy, setup_type, tags |
| `add_trade` | Log a trade (auto-computes P&L when an exit price is given) |
| `edit_trade` | Update any fields; P&L recomputed when price/qty/direction change |
| `delete_trade` | Soft-delete (recoverable) by default; `hard: true` purges permanently (even already soft-deleted trades) |
| `restore_trade` | Recover a soft-deleted trade |
| `analyze_trades` | Win rate, avg RR, profit factor, best/worst, streaks, drawdown, breakdowns |
| `get_account_stats` | Account summary: net P&L, counts, win rate, drawdown, streaks |

## Configuration

The server needs four environment variables:

| Var | Value |
|---|---|
| `SUPABASE_URL` | Your project URL, e.g. `https://<ref>.supabase.co` |
| `SUPABASE_ANON_KEY` | The project's anon / publishable key |
| `TRADING_JOURNAL_EMAIL` | The email you log into the app with |
| `TRADING_JOURNAL_PASSWORD` | Your account password |

## Install

### Claude Code

```bash
claude mcp add trading-journal \
  -e SUPABASE_URL=https://<ref>.supabase.co \
  -e SUPABASE_ANON_KEY=sb_publishable_xxx \
  -e TRADING_JOURNAL_EMAIL=you@example.com \
  -e TRADING_JOURNAL_PASSWORD=your-password \
  -- npx -y trading-journal-mcp
```

### Claude Desktop (`claude_desktop_config.json`)

```json
{
  "mcpServers": {
    "trading-journal": {
      "command": "npx",
      "args": ["-y", "trading-journal-mcp"],
      "env": {
        "SUPABASE_URL": "https://<ref>.supabase.co",
        "SUPABASE_ANON_KEY": "sb_publishable_xxx",
        "TRADING_JOURNAL_EMAIL": "you@example.com",
        "TRADING_JOURNAL_PASSWORD": "your-password"
      }
    }
  }
}
```

> Until published to npm, point `command` at the built entry instead:
> `"command": "node", "args": ["/abs/path/to/mcp-server/dist/index.js"]`.

## Develop

```bash
npm install
npm run dev        # run from source (reads env / a local .env)
npm run build      # emit dist/
npm run typecheck
npx tsx scripts/smoke.ts   # list tools without hitting the network
```

## Notes

- **P&L:** `(exit - entry) * qty`, negated for shorts — identical to the web app.
  A trade is "closed" once it has a P&L; only closed trades feed analytics.
- **avg RR** is `avgWin / avgLoss` (there is no stored stop-loss), matching the
  app dashboard's definition.
- **Soft-delete:** hidden from all reads (including the web dashboard) via RLS.
  Recover it with `restore_trade`, or remove it for good with
  `delete_trade { hard: true }`. Because a soft-deleted row is invisible to
  normal queries, these paths go through `SECURITY DEFINER` RPCs
  (`soft_delete_trade` / `restore_trade` / `hard_delete_trade`) that enforce
  ownership via `auth.uid()`.
