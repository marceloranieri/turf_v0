-- Create follows table
create table if not exists follows (
  id uuid default gen_random_uuid() primary key,
  follower_id uuid references auth.users(id) on delete cascade not null,
  following_id uuid references auth.users(id) on delete cascade not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(follower_id, following_id)
);

-- Add RLS policies
alter table follows enable row level security;

-- Allow users to view their own follows
create policy "Users can view their own follows"
  on follows for select
  using (auth.uid() = follower_id);

-- Allow users to follow/unfollow
create policy "Users can follow/unfollow"
  on follows for all
  using (auth.uid() = follower_id);

-- Create index for faster queries
create index if not exists follows_follower_id_idx on follows(follower_id);
create index if not exists follows_following_id_idx on follows(following_id);

-- Create function to get follow status
create or replace function get_follow_status(target_user_id uuid)
returns boolean
language sql
security definer
as $$
  select exists (
    select 1 from follows
    where follower_id = auth.uid()
    and following_id = target_user_id
  );
$$; 