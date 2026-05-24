
-- Graph nodes
create table public.nodes (
  id uuid primary key default gen_random_uuid(),
  type text not null check (type in ('user','ip','device','location')),
  value text not null,
  flagged boolean not null default false,
  created_at timestamptz not null default now(),
  unique (type, value)
);

-- Graph edges
create table public.edges (
  id uuid primary key default gen_random_uuid(),
  source_id uuid not null references public.nodes(id) on delete cascade,
  target_id uuid not null references public.nodes(id) on delete cascade,
  kind text not null,
  created_at timestamptz not null default now(),
  unique (source_id, target_id, kind)
);

-- Trust evaluations / audit trail (blockchain-style hash chain)
create table public.evaluations (
  id uuid primary key default gen_random_uuid(),
  block_index bigserial,
  username text not null,
  ip text not null,
  device_fingerprint text not null,
  location text not null,
  typing_speed integer not null,
  score integer not null,
  risk integer not null,
  factors jsonb not null default '[]'::jsonb,
  recommendation text not null check (recommendation in ('granted','step_up','blocked')),
  prev_hash text not null,
  hash text not null,
  created_at timestamptz not null default now()
);

create index evaluations_created_at_idx on public.evaluations(created_at desc);
create index nodes_type_idx on public.nodes(type);

-- RLS: public read, no public write
alter table public.nodes enable row level security;
alter table public.edges enable row level security;
alter table public.evaluations enable row level security;

create policy "Public can read nodes" on public.nodes for select using (true);
create policy "Public can read edges" on public.edges for select using (true);
create policy "Public can read evaluations" on public.evaluations for select using (true);

-- Seed a few flagged IPs / devices to show the fraud-network logic
insert into public.nodes (type, value, flagged) values
  ('ip', '185.220.101.45', true),
  ('ip', '198.144.121.93', true),
  ('device', 'tor-browser-abc123', true)
on conflict do nothing;
