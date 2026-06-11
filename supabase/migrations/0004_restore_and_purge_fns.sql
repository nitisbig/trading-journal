-- Tool-level recovery for soft-deleted trades.
--
-- Once a trade is soft-deleted it is invisible under the SELECT policy, so it
-- can no longer be reached by normal client queries (to restore or purge).
-- These SECURITY DEFINER functions run with definer rights (RLS does not apply
-- to their internal statements) while still enforcing ownership via auth.uid(),
-- which reads the caller's JWT claim regardless of definer context.

-- Clear deleted_at, bringing a soft-deleted trade back into normal reads.
create or replace function public.restore_trade(p_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  update public.trades
     set deleted_at = null
   where id = p_id
     and user_id = auth.uid()
     and deleted_at is not null;

  if not found then
    raise exception 'Trade % not found, not owned, or not deleted', p_id
      using errcode = 'no_data_found';
  end if;
end;
$$;

-- Permanently delete a trade in any state (including soft-deleted).
create or replace function public.hard_delete_trade(p_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  delete from public.trades
   where id = p_id
     and user_id = auth.uid();

  if not found then
    raise exception 'Trade % not found or not owned', p_id
      using errcode = 'no_data_found';
  end if;
end;
$$;

revoke all on function public.restore_trade(uuid) from public;
revoke all on function public.hard_delete_trade(uuid) from public;
revoke execute on function public.restore_trade(uuid) from anon;
revoke execute on function public.hard_delete_trade(uuid) from anon;
grant execute on function public.restore_trade(uuid) to authenticated;
grant execute on function public.hard_delete_trade(uuid) to authenticated;
