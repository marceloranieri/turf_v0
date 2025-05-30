create or replace function get_todays_top_live_messages()
returns table (
  id uuid,
  title text,
  category text,
  engagement_score bigint
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
    ) as engagement_score
  from messages m
  where 
    m.created_at >= current_date
    and m.created_at < current_date + interval '1 day'
    and m.is_archived = false
  order by engagement_score desc
  limit 5;
end;
$$; 