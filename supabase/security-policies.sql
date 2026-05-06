-- Execute este arquivo no SQL Editor do Supabase depois de conferir os nomes
-- e tipos das colunas no banco de producao.

alter table public.usuarios enable row level security;
alter table public.progresso_leitura enable row level security;
alter table public.plano_leitura_dias enable row level security;

revoke all on public.usuarios from anon;
revoke all on public.progresso_leitura from anon;
revoke all on public.plano_leitura_dias from anon;

grant usage on schema public to authenticated;
grant select, insert on public.usuarios to authenticated;
grant select, insert, update, delete on public.progresso_leitura to authenticated;
grant select on public.plano_leitura_dias to authenticated;
grant usage, select on all sequences in schema public to authenticated;

revoke update on public.usuarios from authenticated;
grant update (nome, email) on public.usuarios to authenticated;

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.usuarios
    where id = auth.uid()
      and role = 'admin'
  );
$$;

revoke all on function public.is_admin() from public;
grant execute on function public.is_admin() to authenticated;

drop policy if exists usuarios_select_own_or_admin on public.usuarios;
create policy usuarios_select_own_or_admin
on public.usuarios
for select
to authenticated
using (
  id = auth.uid()
  or public.is_admin()
);

drop policy if exists usuarios_insert_own_user_profile on public.usuarios;
create policy usuarios_insert_own_user_profile
on public.usuarios
for insert
to authenticated
with check (
  id = auth.uid()
  and coalesce(role, 'user') = 'user'
);

drop policy if exists usuarios_update_own_basic_fields on public.usuarios;
create policy usuarios_update_own_basic_fields
on public.usuarios
for update
to authenticated
using (id = auth.uid())
with check (id = auth.uid());

drop policy if exists plano_leitura_select_authenticated on public.plano_leitura_dias;
create policy plano_leitura_select_authenticated
on public.plano_leitura_dias
for select
to authenticated
using (true);

drop policy if exists progresso_select_own_or_admin on public.progresso_leitura;
create policy progresso_select_own_or_admin
on public.progresso_leitura
for select
to authenticated
using (
  usuario_id = auth.uid()
  or public.is_admin()
);

drop policy if exists progresso_insert_own on public.progresso_leitura;
create policy progresso_insert_own
on public.progresso_leitura
for insert
to authenticated
with check (usuario_id = auth.uid());

drop policy if exists progresso_update_own on public.progresso_leitura;
create policy progresso_update_own
on public.progresso_leitura
for update
to authenticated
using (usuario_id = auth.uid())
with check (usuario_id = auth.uid());

drop policy if exists progresso_delete_own on public.progresso_leitura;
create policy progresso_delete_own
on public.progresso_leitura
for delete
to authenticated
using (usuario_id = auth.uid());

create or replace function public.atualizar_sequencia_usuario(
  p_usuario_id uuid,
  p_sequencia integer,
  p_ultimo_dia date
)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if auth.uid() is null then
    raise exception 'Usuario nao autenticado';
  end if;

  if p_usuario_id <> auth.uid() then
    raise exception 'Nao e permitido atualizar sequencia de outro usuario';
  end if;

  update public.usuarios
  set
    sequencia_atual = p_sequencia,
    ultimo_dia_lido = p_ultimo_dia
  where id = p_usuario_id;
end;
$$;

revoke all on function public.atualizar_sequencia_usuario(uuid, integer, date) from public;
grant execute on function public.atualizar_sequencia_usuario(uuid, integer, date) to authenticated;
