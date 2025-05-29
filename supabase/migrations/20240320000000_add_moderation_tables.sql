-- Create reports table
create table reports (
  id uuid primary key default gen_random_uuid(),
  message_id uuid references messages(id) on delete cascade,
  reported_by uuid references users(id),
  reported_user_id uuid references users(id),
  reason text not null,
  notes text,
  created_at timestamptz default now()
);

-- Create index for faster queries
create index reports_reported_user_id_idx on reports(reported_user_id);
create index reports_created_at_idx on reports(created_at);

-- Create banned_users table
create table banned_users (
  user_id uuid primary key references users(id) on delete cascade,
  reason text not null,
  banned_at timestamptz default now()
);

-- Add RLS policies
alter table reports enable row level security;
alter table banned_users enable row level security;

-- Reports policies
create policy "Users can create reports"
  on reports for insert
  to authenticated
  with check (auth.uid() = reported_by);

create policy "Users can view their own reports"
  on reports for select
  to authenticated
  using (auth.uid() = reported_by);

-- Banned users policies
create policy "Only admins can manage banned users"
  on banned_users for all
  to authenticated
  using (auth.uid() in (
    select user_id from user_roles where role = 'admin'
  ));

-- Function to check if a user is banned
create or replace function is_user_banned(user_id uuid)
returns boolean as $$
begin
  return exists (
    select 1 from banned_users where banned_users.user_id = $1
  );
end;
$$ language plpgsql security definer;
