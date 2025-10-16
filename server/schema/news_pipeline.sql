-- registry of RSS sources we manage
create table if not exists public.rss_sources (
  id bigserial primary key,
  url text not null unique,
  label text,
  lang text,
  country text,
  priority int default 50,
  healthy boolean default true,
  paywalled boolean default false,
  last_ok timestamptz,
  last_error text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- ensure ingest_items exists; if yours is elsewhere, keep both
create table if not exists public.ingest_items (
  id text primary key,                   -- e.g., rss:<sha1>, yt:<id>
  kind text not null,                    -- 'rss' | 'youtube' | …
  title text,
  url text,
  published_at timestamptz,
  updated_at timestamptz default now(),
  source_meta jsonb,                     -- {source, site, feed, tags:[…], ...}
  text_body text
);

create index if not exists ingest_items_updated_at_idx on public.ingest_items(updated_at);
create index if not exists ingest_items_kind_idx on public.ingest_items(kind);
create index if not exists ingest_items_src_idx on public.ingest_items((source_meta->>'source'));
