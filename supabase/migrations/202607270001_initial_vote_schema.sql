create extension if not exists pgcrypto;

create table if not exists public.options (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(name) between 1 and 40),
  description text not null default '' check (char_length(description) <= 120),
  color text not null default '#286FD8' check (color ~ '^#[0-9A-Fa-f]{6}$'),
  enabled boolean not null default true,
  sort_order integer not null default 0 check (sort_order between 0 and 999),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.votes (
  submission_id uuid primary key,
  nickname text not null check (char_length(nickname) between 2 and 20),
  option_id uuid not null references public.options(id) on delete restrict,
  option_name text not null,
  reason text not null check (char_length(reason) between 5 and 500),
  voted_at timestamptz not null default now(),
  voted_at_kst text not null,
  kst_date date not null default ((now() at time zone 'Asia/Seoul')::date)
);

create index if not exists votes_kst_date_idx
  on public.votes (kst_date desc);

create index if not exists votes_option_date_idx
  on public.votes (option_id, kst_date desc);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
security invoker
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists options_set_updated_at on public.options;
create trigger options_set_updated_at
before update on public.options
for each row execute function public.set_updated_at();

alter table public.options enable row level security;
alter table public.votes enable row level security;

revoke all on table public.options from anon, authenticated;
revoke all on table public.votes from anon, authenticated;

comment on table public.options is
  '관리자가 설정하는 AI 모델 투표 선택지';

comment on table public.votes is
  'KST 날짜별 AI 모델 설문 응답';
