-- AUDIO
create table if not exists public.audio_items (
  id bigserial primary key,
  guid text unique,
  title text,
  url text,
  enclosure_url text,
  source text,
  published_at timestamptz,
  description text,
  created_at timestamptz default now()
);
alter table public.audio_items enable row level security;
do $$
begin
  if not exists (select 1 from pg_policies where policyname='audio anon insert' and tablename='audio_items') then
    create policy "audio anon insert" on public.audio_items for insert to anon with check (true);
  end if;
  if not exists (select 1 from pg_policies where policyname='audio anon select' and tablename='audio_items') then
    create policy "audio anon select" on public.audio_items for select to anon using (true);
  end if;
end$$;

-- VIDEO (ensure columns exist)
create table if not exists public.video_items (
  id bigserial primary key,
  vid text unique,
  title text,
  url text,
  channel text,
  published_at timestamptz,
  description text,
  created_at timestamptz default now()
);
alter table public.video_items enable row level security;
do $$
begin
  if not exists (select 1 from pg_policies where policyname='video anon insert' and tablename='video_items') then
    create policy "video anon insert" on public.video_items for insert to anon with check (true);
  end if;
  if not exists (select 1 from pg_policies where policyname='video anon select' and tablename='video_items') then
    create policy "video anon select" on public.video_items for select to anon using (true);
  end if;
end$$;

-- RSS (ensure columns exist)
create table if not exists public.rss_items (
  id bigserial primary key,
  guid text unique,
  title text,
  url text,
  source text,
  published_at timestamptz,
  author text,
  summary text,
  created_at timestamptz default now()
);
alter table public.rss_items enable row level security;
do $$
begin
  if not exists (select 1 from pg_policies where policyname='rss anon insert' and tablename='rss_items') then
    create policy "rss anon insert" on public.rss_items for insert to anon with check (true);
  end if;
  if not exists (select 1 from pg_policies where policyname='rss anon select' and tablename='rss_items') then
    create policy "rss anon select" on public.rss_items for select to anon using (true);
  end if;
end$$;
