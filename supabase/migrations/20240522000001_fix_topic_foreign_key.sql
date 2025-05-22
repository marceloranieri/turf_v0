-- Drop the existing foreign key constraint
ALTER TABLE daily_topics DROP CONSTRAINT daily_topics_topic_id_fkey;

-- Add the new foreign key constraint with RESTRICT
ALTER TABLE daily_topics ADD CONSTRAINT daily_topics_topic_id_fkey
    FOREIGN KEY (topic_id) REFERENCES topics(id) ON DELETE RESTRICT; 