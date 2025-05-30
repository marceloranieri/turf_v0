import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL || 'https://vknmgkonzwhqptweemwr.supabase.co';
const supabaseKey = process.env.SUPABASE_SERVICE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZrbm1na29uendocXB0d2VlbXdyIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0NzI2MjU1MSwiZXhwIjoyMDYyODM4NTUxfQ.ItkI6Qln8qYKTs4bmMmEkG4izZ6YNrdcheoCWrA5FKg';

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase credentials');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function clearAssignments() {
  const { error } = await supabase.from('bot_circle_assignment').delete().neq('bot_id', '');
  if (error) throw error;
  console.log('🧹 Cleared all bot-to-circle assignments.');
}

async function reassignBots() {
  const { data: bots, error: botsError } = await supabase.from('bots').select('bot_id');
  if (botsError) throw botsError;
  const { data: topics, error: topicsError } = await supabase.from('topics').select('id');
  if (topicsError) throw topicsError;
  if (!bots?.length || !topics?.length) throw new Error('No bots or topics found.');

  const assignments = [];
  const now = new Date().toISOString();
  for (const bot of bots) {
    const shuffled = [...topics].sort(() => 0.5 - Math.random());
    const numCircles = Math.floor(Math.random() * 5) + 1;
    const selected = shuffled.slice(0, numCircles);
    for (const topic of selected) {
      assignments.push({ bot_id: bot.bot_id, circle_id: topic.id, created_at: now });
    }
  }
  const { error: insertError } = await supabase.from('bot_circle_assignment').insert(assignments);
  if (insertError) throw insertError;
  console.log(`✅ Reassigned ${bots.length} bots to new circles.`);
}

async function main() {
  await clearAssignments();
  await reassignBots();
}

main(); 