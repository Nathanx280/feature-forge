-- Make command_log work without auth
alter table public.command_log alter column user_id drop not null;
alter table public.command_log add column if not exists client_id text;

drop policy if exists "Users insert own commands" on public.command_log;
drop policy if exists "Users view own commands" on public.command_log;

create policy "Anyone can insert commands"
  on public.command_log for insert to anon, authenticated with check (true);
create policy "Anyone can view commands"
  on public.command_log for select to anon, authenticated using (true);

-- Notes (public, scoped by client_id stored in browser)
create table public.notes (
  id uuid primary key default gen_random_uuid(),
  client_id text not null,
  title text not null default 'Untitled',
  content text not null default '',
  color text not null default 'cyan',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.notes enable row level security;

create policy "Notes are public read"
  on public.notes for select to anon, authenticated using (true);
create policy "Anyone can create notes"
  on public.notes for insert to anon, authenticated with check (true);
create policy "Anyone can update notes"
  on public.notes for update to anon, authenticated using (true);
create policy "Anyone can delete notes"
  on public.notes for delete to anon, authenticated using (true);

create trigger notes_updated_at
  before update on public.notes
  for each row execute function public.set_updated_at();