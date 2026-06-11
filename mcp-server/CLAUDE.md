# CLAUDE.md — Trading Journal MCP Server

A standalone MCP (Model Context Protocol) server that exposes the user's trading
journal to MCP clients (Claude Code, Claude Desktop, etc.). It lives inside the
journal monorepo but builds and ships independently.

## Stack
- **Runtime:** Node ≥18, TypeScript, ESM (`"type": "module"`, NodeNext resolution)
- **Protocol:** `@modelcontextprotocol/sdk` over **stdio**
- **Data:** Supabase (`@supabase/supabase-js`), same project as the web app
- **Validation:** `zod`

## How it runs
A local process started by the MCP client. It reads credentials from env, signs
in to Supabase once, and serves tool calls over stdio. Distributed via `npx`
(see README) — `bin` → `dist/index.js`.

## Project structure
```
src/
├── index.ts        # entry: signs in (fail-fast), connects StdioServerTransport
├── server.ts       # builds McpServer, registers all 8 tools
├── config.ts       # validates env at import (zod); exits with a clear message
├── supabase.ts     # cached authenticated client (getSession)
├── trades.ts       # mapRow + fetchTrades(filters) + fetchTradeById
├── pnl.ts          # computePnl — mirrors the web app's rule
├── analytics.ts    # summarize / streaks / drawdown / groupBy (pure functions)
├── result.ts       # ok() / fail() / guard() tool-result helpers
├── types.ts        # generated Database types + app Trade type
└── tools/          # one file per tool, each exports register<Tool>(server)
```

## Authentication & isolation
- The server signs in with `signInWithPassword` using `TRADING_JOURNAL_EMAIL` /
  `TRADING_JOURNAL_PASSWORD`. Every query runs as that user.
- **RLS is the only isolation boundary. Never add the service-role key, and never
  pass `user_id` as a manual filter to bypass RLS.**
- Soft-deleted rows (`deleted_at is not null`) are hidden by the RLS SELECT
  policy — no per-query `deleted_at` filter is needed for reads.

## Conventions
- **One tool per file** in `src/tools/`, exporting `register<Name>(server)`.
  Register it in `server.ts`.
- Tool input schemas are zod **raw shapes** (an object of zod fields), passed as
  `inputSchema`. Describe each field with `.describe()`.
- Tool handlers return via `ok(data)` / `fail(message)` and are wrapped in
  `guard()` so unexpected throws become clean `isError` results — never crash the
  process on a bad tool call.
- All DB access goes through `getSession()` → the cached client. Don't create ad
  hoc Supabase clients.
- Keep analytics pure (`analytics.ts`) and reuse `computePnl` — do not duplicate
  the P&L formula.
- **stdout is the JSON-RPC channel.** Log only to `stderr` (`console.error`).
- No `any`. Mirror DB column names (snake_case) at the boundary; the `Trade`
  type maps nullable columns to optional.

## P&L rule (must stay in sync with the web app)
`(exit_price - entry_price) * quantity`, negated for shorts. A trade is "closed"
once it has a numeric `pnl`. Only closed trades count toward analytics.

## Schema notes
The `trades` table gained `setup_type text` and `deleted_at timestamptz` in
`supabase/migrations/0002_trade_mcp_fields.sql`. Regenerate `src/types.ts` (and
the app's `types/database.ts`) after any further schema change.

## The 9 tools
`get_recent_trades`, `get_trade_by_id`, `search_trades`, `add_trade`,
`edit_trade`, `delete_trade`, `restore_trade`, `analyze_trades`,
`get_account_stats`.

## Soft-delete & RPCs
The SELECT policy hides `deleted_at is not null` rows. A plain UPDATE that sets
`deleted_at` is rejected ("new row violates row-level security policy") because
PostgREST enforces SELECT-visibility on a write's affected row, and a soft-deleted
row is no longer visible. So soft-delete, restore, and purging a soft-deleted row
go through `SECURITY DEFINER` RPCs that enforce ownership via `auth.uid()`:
`soft_delete_trade`, `restore_trade`, `hard_delete_trade`
(migrations `0003`/`0004`). Grant `execute` to `authenticated` only — revoke from
`public` and `anon`.

## Commands
- `npm run dev` — run from source with tsx
- `npm run build` — emit to `dist/`
- `npm run typecheck` — `tsc --noEmit`
- `npx tsx scripts/smoke.ts` — list tools over an in-memory transport (needs
  format-valid dummy env; does not hit the network)

## Do not
- Bypass RLS or introduce a service-role key.
- Write to stdout.
- Put data-fetching logic inside tool files beyond thin orchestration — share it
  via `trades.ts` / `analytics.ts`.
- Duplicate the P&L formula.
