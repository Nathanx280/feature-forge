alter table public.notes replica identity full;
alter table public.command_log replica identity full;
alter publication supabase_realtime add table public.notes;
alter publication supabase_realtime add table public.command_log;