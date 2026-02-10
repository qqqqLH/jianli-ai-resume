create extension if not exists pgcrypto;

create table if not exists public.resumes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users (id) on delete set null,
  full_name text not null,
  email text not null,
  phone text,
  summary text,
  experience jsonb not null default '[]'::jsonb,
  education jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default timezone('utc', now())
);

create index if not exists resumes_user_id_idx on public.resumes (user_id);
create index if not exists resumes_created_at_idx on public.resumes (created_at desc);

alter table public.resumes enable row level security;

drop policy if exists "debug_select_resumes" on public.resumes;
create policy "debug_select_resumes"
  on public.resumes
  for select
  using (true);

drop policy if exists "debug_insert_resumes" on public.resumes;
create policy "debug_insert_resumes"
  on public.resumes
  for insert
  with check (true);
