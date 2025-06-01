-- Create notifications table
create table if not exists notifications (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users(id) on delete cascade not null,
  actor_id uuid references auth.users(id) on delete cascade not null,
  type text not null check (type in ('follow', 'like', 'message', 'upvote')),
  content text,
  topic_id uuid references topics(id) on delete cascade,
  created_at timestamp with time zone default now() not null,
  read boolean default false not null
);

-- Enable RLS
alter table notifications enable row level security;

-- Create policies
create policy "Users can view their own notifications"
  on notifications for select
  to authenticated
  using (auth.uid() = user_id);

create policy "Users can mark their notifications as read"
  on notifications for update
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- Create function to generate notification content
create or replace function generate_notification_content(
  p_type text,
  p_actor_username text,
  p_topic_title text default null
)
returns text
language plpgsql
as $$
begin
  return case p_type
    when 'follow' then p_actor_username || ' started following you'
    when 'like' then p_actor_username || ' liked your message'
    when 'message' then p_actor_username || ' replied in ' || coalesce(p_topic_title, 'a circle')
    when 'upvote' then p_actor_username || ' upvoted your message in ' || coalesce(p_topic_title, 'a circle')
  end;
end;
$$;

-- Create function to create notifications
create or replace function create_notification(
  p_user_id uuid,
  p_actor_id uuid,
  p_type text,
  p_topic_id uuid default null
)
returns uuid
language plpgsql
security definer
as $$
declare
  v_actor_username text;
  v_topic_title text;
  v_content text;
  v_notification_id uuid;
begin
  -- Get actor username
  select username into v_actor_username
  from profiles
  where id = p_actor_id;

  -- Get topic title if provided
  if p_topic_id is not null then
    select title into v_topic_title
    from topics
    where id = p_topic_id;
  end if;

  -- Generate notification content
  v_content := generate_notification_content(p_type, v_actor_username, v_topic_title);

  -- Create notification
  insert into notifications (user_id, actor_id, type, content, topic_id)
  values (p_user_id, p_actor_id, p_type, v_content, p_topic_id)
  returning id into v_notification_id;

  return v_notification_id;
end;
$$;

-- Grant permissions
grant execute on function create_notification to authenticated;
grant execute on function generate_notification_content to authenticated; 