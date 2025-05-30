create or replace function get_yesterdays_top_messages()
returns table (
  id uuid,
  title text,
  category text,
  engagement_score bigint,
  created_at timestamptz
) language plpgsql security definer as $$
begin
  return query
  select 
    m.id,
    m.title,
    m.category,
    (
      coalesce((select count(*) from message_likes where message_id = m.id), 0) +
      coalesce((select count(*) from message_comments where message_id = m.id), 0)
    ) as engagement_score,
    m.created_at
  from messages m
  where 
    m.created_at >= current_date - interval '1 day'
    and m.created_at < current_date
    and m.is_archived = true
  order by engagement_score desc
  limit 12;
end;
$$; 