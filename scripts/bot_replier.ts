import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL || 'https://vknmgkonzwhqptweemwr.supabase.co';
const supabaseKey = process.env.SUPABASE_SERVICE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZrbm1na29uendocXB0d2VlbXdyIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0NzI2MjU1MSwiZXhwIjoyMDYyODM4NTUxfQ.ItkI6Qln8qYKTs4bmMmEkG4izZ6YNrdcheoCWrA5FKg';

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase credentials');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const MIN_DELAY_MS = 2000;
const MAX_DELAY_MS = 8000;
const SPAM_INTERVAL_MS = 3 * 60 * 1000; // 3 minutes

async function getEligibleBotAssignments() {
  // Fetch all bot-circle assignments
  const { data: assignments, error } = await supabase
    .from('bot_circle_assignment')
    .select('bot_id, circle_id');
  if (error) throw error;
  return assignments || [];
}

async function getLastBotMessage(bot_id: string, circle_id: string) {
  // Fetch the last message sent by this bot in this circle
  const { data, error } = await supabase
    .from('messages')
    .select('created_at')
    .eq('bot_id', bot_id)
    .eq('circle_id', circle_id)
    .order('created_at', { ascending: false })
    .limit(1);
  if (error) throw error;
  return data?.[0]?.created_at ? new Date(data[0].created_at) : null;
}

async function sendBotReply(bot_id: string, circle_id: string) {
  // Simulate typing delay
  const delay = Math.floor(Math.random() * (MAX_DELAY_MS - MIN_DELAY_MS + 1)) + MIN_DELAY_MS;
  await new Promise(res => setTimeout(res, delay));

  // Fetch bot info
  const { data: bot, error: botError } = await supabase
    .from('bots')
    .select('nickname, personality_prompt, behavior')
    .eq('bot_id', bot_id)
    .single();
  if (botError) throw botError;

  // Compose a dummy reply (replace with real LLM call in production)
  const reply = `Hi, I'm ${bot.nickname}! [Simulated reply]`;

  // Insert message
  const { error: msgError } = await supabase
    .from('messages')
    .insert({
      bot_id,
      circle_id,
      content: reply,
      created_at: new Date().toISOString(),
      is_bot: true
    });
  if (msgError) throw msgError;

  console.log(`🤖 ${bot.nickname} replied in circle ${circle_id} after ${delay}ms delay.`);
}

async function main() {
  const assignments = await getEligibleBotAssignments();
  for (const { bot_id, circle_id } of assignments) {
    const lastMsg = await getLastBotMessage(bot_id, circle_id);
    const now = new Date();
    if (!lastMsg || now.getTime() - lastMsg.getTime() > SPAM_INTERVAL_MS) {
      // Eligible to reply
      await sendBotReply(bot_id, circle_id);
    } else {
      console.log(`⏳ Skipping ${bot_id} in ${circle_id} (last msg too recent)`);
    }
  }
}

main(); 