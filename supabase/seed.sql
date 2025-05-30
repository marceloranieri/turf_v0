-- seed.sql

-- Insert one topic (required for daily_topics and message tests)
insert into topics (id, title, slug, question, category, date, is_active)
values (
  '22222222-2222-2222-2222-222222222222',
  'Should pineapple go on pizza?',
  'pineapple-on-pizza',
  'Is pineapple a valid topping?',
  'food',
  CURRENT_DATE,
  true
);

-- Link topic to daily_topics for today
insert into daily_topics (id, topic_id, date, created_at)
values (
  '33333333-3333-3333-3333-333333333333',
  '22222222-2222-2222-2222-222222222222',
  CURRENT_DATE,
  now()
);
