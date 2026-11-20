-- Blog engine tables. Postgres. Adapt names to the project's conventions rather
-- than importing verbatim.
--
-- SQLite / libSQL / D1: replace `bigserial primary key` with
-- `integer primary key autoincrement`, `timestamptz` with `integer` (unix
-- seconds), `jsonb` with `text`, and `now()` with `unixepoch()`.

-- One row per audit run: the window it scored and the blog-wide numbers for it.
create table blog_audit_runs (
  id               bigserial primary key,
  run_at           timestamptz not null default now(),
  window_start     date not null,
  window_end       date not null,        -- end where search data is complete, not today
  blog_clicks      integer not null,
  blog_impressions integer not null,
  posts_scored     integer not null,
  posts_in_cooldown integer not null default 0
);

-- One row per post per run. Keeping every run lets "last week's scores" be a
-- query, and shows a post climbing or falling in the queue over time.
create table blog_post_scores (
  run_id         bigint not null references blog_audit_runs (id),
  slug           text not null,
  clicks         integer not null,
  impressions    integer not null,
  position       real,
  prev_clicks    integer not null,
  lever          text check (lever in ('recover', 'ctr', 'rank')),  -- null = unranked
  est_clicks     integer not null default 0,   -- an ordering estimate, never a forecast
  low_visibility boolean not null default false,
  real_loss      boolean not null default false,
  hygiene        jsonb not null default '[]',  -- dead links, empty SEO fields, old names
  primary key (run_id, slug)
);

-- One row per suggested edit, from suggestion to the 56-day reading.
create table blog_edits (
  id              bigserial primary key,
  run_id          bigint references blog_audit_runs (id),
  slug            text not null,
  kind            text not null check (kind in ('seo_title', 'seo_description', 'swap')),
  before_text     text not null,           -- also what a revert restores
  after_text      text not null,
  source_url      text,                    -- the line that justifies a factual fix
  -- 'applying' is the lock: move suggested -> applying with a conditional
  -- update and act only if a row changed.
  status          text not null default 'suggested' check (status in
                    ('suggested', 'applying', 'applied', 'auto_applied',
                     'skipped', 'refused', 'reverted')),
  refused_reason  text,
  decided_by      text,
  decided_at      timestamptz,
  applied_at      timestamptz,
  cooldown_until  date,                    -- no further edits to this post before then

  -- the 28 days before the edit went live: the post, and the blog as control.
  -- The window dates are written by the approve handler and never recomputed;
  -- the numbers may be filled in later, for exactly these dates.
  base_window_start date,
  base_window_end   date,                  -- last complete day of search data
  base_clicks       integer,               -- null = baseline pending
  base_impressions  integer,
  base_position     real,
  base_blog_clicks  integer,
  base_blog_impressions integer,

  -- re-read at +28 and +56 days over a window of the same length
  d28_clicks integer, d28_impressions integer, d28_position real, d28_blog_clicks integer,
  d56_clicks integer, d56_impressions integer, d56_position real, d56_blog_clicks integer
);

create index blog_edits_slug_idx on blog_edits (slug);
create index blog_edits_pending_idx on blog_edits (applied_at)
  where d56_clicks is null and status in ('applied', 'auto_applied');

-- One row per generated draft, kept even when discarded, so a topic that was
-- rejected is not proposed again next week.
create table blog_generated_posts (
  id             bigserial primary key,
  slug           text not null unique,
  target_queries jsonb not null,           -- the near-miss group it was written for
  topic_source   text not null check (topic_source in ('near_miss', 'requested')),
  gate_report    jsonb not null,           -- failures and advisories from the four gates
  attempts       smallint not null default 1,
  status         text not null default 'draft' check (status in
                   ('draft', 'publishing', 'published', 'discarded')),
  decided_by     text,
  published_at   timestamptz,

  -- no "before": a growth curve, with the blog alongside
  d28_clicks integer, d28_impressions integer, d28_position real, d28_blog_clicks integer,
  d56_clicks integer, d56_impressions integer, d56_position real, d56_blog_clicks integer
);

-- AI answer signals. One row per post, engine, segment and date. A null slug is
-- a domain-wide reading. The three segments are different questions with
-- different sources: never sum across `segment`.
create table blog_aeo_signals (
  id          bigserial primary key,
  captured_on date not null,
  slug        text,
  engine      text not null,               -- 'chatgpt', 'claude', 'perplexity', 'ai_overviews'
  segment     text not null check (segment in ('crawl', 'cite', 'click')),
  count       integer not null,
  source      text not null,               -- 'server_logs', 'probe', 'export:<tool>', 'referrer'
  unique (captured_on, slug, engine, segment, source)
);
