I need to build an MCP (Model Context Protocol) server for my trading journal SaaS app.
The MCP server will let users connect tools like Claude Code to interact with their
trading data through natural language.

## Tech Stack
- Backend/DB: Supabase (PostgreSQL)
- Frontend: Next.js (App Router) + TypeScript + Tailwind CSS
- Auth: Supabase Auth (users are authenticated, all data is scoped per user)

## What the MCP Server Must Support

The server should expose these tools to the AI client:

1. **get_recent_trades** — Fetch the user's recent trades (with filters: symbol,
   date range, status, limit)

2. **get_trade_by_id** — Fetch a single trade's full details by ID

3. **add_trade** — Create a new trade entry with fields: symbol, direction
   (long/short), entry_price, exit_price, quantity, entry_date, exit_date,
   notes, tags, strategy, setup_type

4. **edit_trade** — Update any fields on an existing trade by trade ID

5. **delete_trade** — Soft-delete or hard-delete a trade by ID

6. **analyze_trades** — Run analysis on a set of trades and return computed metrics:
   win rate, avg RR, profit factor, best/worst trade, streak, performance by
   symbol/strategy/setup

7. **get_account_stats** — Summary of overall account: total PnL, number of trades,
   win rate, drawdown

8. **search_trades** — Full-text or filtered search across trade notes, tags, symbol

## Planning Tasks

Please help me plan the following — do NOT write implementation code yet,
just produce a detailed architectural plan:

### 1. Project Structure
What should the MCP server project look like? Should it live inside my
existing Next.js monorepo or as a separate package? Recommend a folder structure.

### 2. Transport Layer
Which MCP transport should I use — stdio (for local Claude Code usage) or
HTTP/SSE (for remote/hosted usage)? What are the tradeoffs given that my
users are connecting from Claude Code on their own machines to my hosted Supabase?

### 3. Authentication Strategy
How should the MCP server authenticate requests to Supabase so that each
user's data stays isolated? Options to evaluate:
- User provides their Supabase JWT/API key in MCP config
- Server uses a service role key + user_id passed as a parameter
- OAuth flow through the MCP server

Recommend the safest and most practical approach for a solo SaaS.

### 4. Tool Schema Design
For each of the 8 tools listed above, outline:
- Input parameters with types
- What it returns
- Any edge cases or validation to handle

### 5. CLAUDE.md for This MCP Server
Draft a CLAUDE.md file for the MCP server sub-project so Claude Code understands
the architecture, conventions, and rules when working inside this codebase.

### 6. Rollout Plan
What is the recommended order to build these tools? Start with the simplest
and most foundational, then layer up. Give me a phased plan (Phase 1, 2, 3).

### 7. Open Questions
Flag any decisions I'll need to make before implementation begins
(schema assumptions, rate limiting, error handling conventions, etc.)

## Constraints
- Solo founder, so keep the architecture as simple as possible
- Prefer TypeScript and the official Anthropic MCP SDK (@modelcontextprotocol/sdk)
- Supabase client should use Row Level Security — do not bypass RLS unless necessary
- The MCP server should eventually be distributable (users install it via npx or
  add it to their claude_desktop_config.json)

Start with the architectural plan only. I will ask for implementation after.