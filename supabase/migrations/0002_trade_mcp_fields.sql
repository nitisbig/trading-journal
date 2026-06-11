-- Adds fields used by the MCP server:
--   setup_type  — categorises the trade setup (free text, like strategy)
--   deleted_at  — soft-delete marker; non-null rows are hidden from reads
alter table public.trades
  add column if not exists setup_type text,
  add column if not exists deleted_at timestamptz;

-- Hide soft-deleted trades everywhere (dashboard reads included) by folding the
-- guard into the SELECT policy rather than relying on per-query filters.
drop policy if exists "Users can view their own trades" on public.trades;

create policy "Users can view their own trades"
  on public.trades for select
  using (auth.uid() = user_id and deleted_at is null);

create index if not exists trades_user_id_deleted_at_idx
  on public.trades (user_id, deleted_at);
