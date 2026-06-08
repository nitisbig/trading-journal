@AGENTS.md


# CLAUDE.md — Trading Journal Web App

## Stack
- **Framework:** Next.js (App Router)
- **Database:** Supabase (Postgres + Auth + Storage)
- **Language:** TypeScript
- **Styling:** Tailwind CSS

---

## Project Structure

```
src/
├── app/                  # Next.js App Router pages & layouts
│   ├── (auth)/           # Auth group: login, register
│   ├── (dashboard)/      # Protected group: journal, analytics
│   └── api/              # API route handlers
├── components/
│   ├── ui/               # Primitive UI components (Button, Input, Modal)
│   ├── journal/          # Trade entry, trade list, trade card
│   └── analytics/        # Charts, stats, performance widgets
├── lib/
│   ├── supabase/         # Client, server, middleware helpers
│   ├── hooks/            # Custom React hooks
│   └── utils/            # Pure utility functions
├── types/                # Shared TypeScript types/interfaces
└── constants/            # App-wide constants (instrument types, strategies)
```

---

## Coding Rules

### General
- One responsibility per file — no fat components or god modules
- Export one primary thing per module; co-locate related helpers
- No `any` types — define interfaces in `types/`
- Use named exports everywhere except page/layout files

### Next.js
- Use Server Components by default; add `"use client"` only when needed
- Data fetching lives in Server Components or Route Handlers — not client hooks
- Route Handlers in `app/api/` — keep them thin, delegate logic to `lib/`

### Supabase
- All Supabase calls go through `lib/supabase/` helpers — never import the client directly in components
- Server-side: use `createServerClient` (cookies); client-side: use `createBrowserClient`
- RLS (Row Level Security) must be enabled on all tables — never bypass with service role on the client

### State & Data
- Server state → Supabase + React Server Components
- Local UI state → `useState` / `useReducer`
- No global client state library unless complexity demands it

---

## Key Types

```ts
// types/trade.ts
export interface Trade {
  id: string
  user_id: string
  symbol: string
  direction: "long" | "short"
  entry_price: number
  exit_price?: number
  quantity: number
  entry_at: string
  exit_at?: string
  pnl?: number
  strategy?: string
  notes?: string
  tags?: string[]
  created_at: string
}
```

---

## Supabase Conventions

- Table names: `snake_case`, plural (`trades`, `trade_tags`)
- Always filter by `user_id` — rely on RLS as a second layer, not first
- Use Supabase Storage for trade screenshots: bucket `trade-attachments`
- Migrations live in `supabase/migrations/` — never edit the DB manually

---

## Naming Conventions

| Thing | Convention | Example |
|---|---|---|
| Components | PascalCase | `TradeCard.tsx` |
| Hooks | camelCase + `use` prefix | `useTrades.ts` |
| Utilities | camelCase | `formatPnl.ts` |
| DB tables | snake_case plural | `trades` |
| Env vars | `NEXT_PUBLIC_` prefix (public) | `NEXT_PUBLIC_SUPABASE_URL` |

---

## Environment Variables

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=   # server-only, never expose to client
```

---

## Do Not
- Call Supabase directly from UI components
- Skip TypeScript types for DB responses — use generated types (`supabase gen types`)
- Mix data-fetching logic into presentational components
- Store sensitive keys in client-accessible env vars