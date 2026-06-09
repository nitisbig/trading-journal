create table if not exists public.trades (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  symbol text not null,
  direction text not null check (direction in ('long','short')),
  entry_price numeric not null,
  exit_price numeric,
  quantity numeric not null,
  entry_at timestamptz not null,
  exit_at timestamptz,
  pnl numeric,
  strategy text,
  notes text,
  tags text[],
  created_at timestamptz not null default now()
);

alter table public.trades enable row level security;

create index if not exists trades_user_id_entry_at_idx
  on public.trades (user_id, entry_at desc);

create policy "Users can view their own trades"
  on public.trades for select
  using (auth.uid() = user_id);

create policy "Users can insert their own trades"
  on public.trades for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own trades"
  on public.trades for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Users can delete their own trades"
  on public.trades for delete
  using (auth.uid() = user_id);
