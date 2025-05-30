-- Seed admin user
insert into profiles (id, username, role)
values ('your-auth-user-id', 'Marcelo', 'admin');

-- Seed sample topics
insert into topics (title, slug, question, category, date, description)
values 
  ('Why Donkeys Are Underrated', 'why-donkeys-are-underrated', 'What makes donkeys special?', 'Animals', CURRENT_DATE, 'A deep dive into the unique qualities of donkeys.'),
  ('The Future of AI', 'future-of-ai', 'How will AI shape our future?', 'Technology', CURRENT_DATE, 'Exploring the potential impacts of artificial intelligence.');

-- Seed sample messages
insert into messages (topic_id, user_id, content, upvotes)
values 
  ((select id from topics where slug = 'why-donkeys-are-underrated'), 'your-auth-user-id', 'Donkeys are incredibly loyal and intelligent!', 5),
  ((select id from topics where slug = 'future-of-ai'), 'your-auth-user-id', 'AI will revolutionize healthcare and education.', 3); 