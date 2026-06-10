-- Run this in your Supabase SQL editor

create extension if not exists "uuid-ossp";

create table if not exists submissions (
  id               uuid primary key default uuid_generate_v4(),
  full_name        text not null,
  email            text not null,
  highest_qualification text not null,
  work_experience  integer not null,
  current_profession text not null,
  career_goal      text not null,
  recommendation   text not null,
  confidence       integer not null,
  reasoning        text not null,
  created_at       timestamptz not null default now()
);

-- Enable Row Level Security (open read for admin dashboard, insert for public)
alter table submissions enable row level security;

-- Allow anonymous inserts (form submissions)
create policy "Allow public inserts"
  on submissions for insert
  with check (true);

-- Allow anonymous reads (admin dashboard — tighten in production with auth)
create policy "Allow public reads"
  on submissions for select
  using (true);
