-- Create the leaderboard RPC function
create or replace function get_circle_leaderboard()
returns table (
  user_id uuid,
  username text,
  avatar_url text,
  total_points int,
  circle_id uuid,
  circle_topic text
) as $$
begin
  return query
  select
    u.id as user_id,
    u.username,
    u.avatar_url,
    sum(m.points) as total_points,
    m.circle_id,
    c.topic as circle_topic
  from message_votes m
  join users u on u.id = m.user_id
  join circles c on c.id = m.circle_id
  where c.date = current_date
  group by u.id, m.circle_id, c.topic
  order by total_points desc;
end;
$$ language plpgsql;

-- Grant access to authenticated users
grant execute on function get_circle_leaderboard() to authenticated;

-- Add RLS policy
create policy "Allow authenticated users to execute get_circle_leaderboard"
  on message_votes
  for select
  to authenticated
  using (true);

-- Create index for better performance
create index if not exists idx_message_votes_circle_date
  on message_votes (circle_id, created_at desc); 