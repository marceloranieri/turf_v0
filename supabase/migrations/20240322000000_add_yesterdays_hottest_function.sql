-- Create function to get yesterday's hottest messages
create or replace function get_yesterdays_hottest_messages(date_input date)
returns table (
  id uuid,
  topic_title text,
  slug text,
  message text,
  username text,
  upvotes int
)
language sql
as $$
select 
  m.id,
  t.title as topic_title,
  t.slug,
  m.content as message,
  u.username,
  m.upvotes
from messages m
join topics t on m.topic_id = t.id
join users u on m.user_id = u.id
where t.date = date_input
order by m.upvotes desc
limit 5;
$$; 