-- Drop the old foreign key constraint
ALTER TABLE daily_topics
DROP CONSTRAINT IF EXISTS daily_topics_topic_id_fkey;

-- Add new constraint with RESTRICT delete
ALTER TABLE daily_topics
ADD CONSTRAINT daily_topics_topic_id_fkey
FOREIGN KEY (topic_id)
REFERENCES topics(id)
ON DELETE RESTRICT;
