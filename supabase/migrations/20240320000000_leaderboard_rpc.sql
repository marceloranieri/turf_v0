-- Create the leaderboard RPC function
create or replace function get_leaderboard_data()
returns table (
  id uuid,
  username text,
  avatar_url text,
  points bigint,
  circle_name text
)
language sql
security definer
as $$
  select 
    u.id,
    u.username,
    u.avatar_url,
    coalesce(sum(m.points), 0) as points,
    t.title as circle_name
  from profiles u
  left join messages msg on msg.author_id = u.id
  left join topics t on t.id = msg.topic_id
  left join message_votes m on m.message_id = msg.id
  where t.is_active = true
  group by u.id, u.username, u.avatar_url, t.title
  order by points desc
  limit 10;
$$;

-- Grant execute permission to authenticated users
grant execute on function get_leaderboard_data() to authenticated;

-- Add RLS policy to ensure users can only see public data
create policy "Allow authenticated users to view leaderboard"
  on profiles
  for select
  to authenticated
  using (true); 