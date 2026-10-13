create table if not exists public.site_content (
  id text primary key check (id = 'main'),
  content jsonb not null,
  updated_at timestamptz not null default now()
);

create table if not exists public.contact_submissions (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  message text not null,
  created_at timestamptz not null default now()
);

create index if not exists contact_submissions_created_at_idx
  on public.contact_submissions (created_at desc);

alter table public.site_content enable row level security;
alter table public.contact_submissions enable row level security;

revoke all on table public.site_content from anon, authenticated;
revoke all on table public.contact_submissions from anon, authenticated;
grant all on table public.site_content to service_role;
grant all on table public.contact_submissions to service_role;