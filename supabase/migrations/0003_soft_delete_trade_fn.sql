-- Soft-delete via a SECURITY DEFINER function.
--
-- A plain UPDATE that sets deleted_at makes the row invisible under the SELECT
-- policy (deleted_at IS NULL), and PostgREST enforces SELECT-visibility on the
-- affected row of a write — so the update is rejected with
-- "new row violates row-level security policy". This function performs the
-- update with definer rights (bypassing that check) while still enforcing
-- ownership via auth.uid(), so users can only soft-delete their own trades.
create or replace function public.soft_delete_trade(p_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  update public.trades
     set deleted_at = now()
   where id = p_id
     and user_id = auth.uid()
     and deleted_at is null;

  if not found then
    raise exception 'Trade % not found, not owned, or already deleted', p_id
      using errcode = 'no_data_found';
  end if;
end;
$$;

revoke all on function public.soft_delete_trade(uuid) from public;
revoke execute on function public.soft_delete_trade(uuid) from anon;
grant execute on function public.soft_delete_trade(uuid) to authenticated;
