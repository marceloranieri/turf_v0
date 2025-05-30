import { createClient } from '@supabase/supabase-js';

// Your live Supabase project with service role
const supabaseUrl = 'https://vknmgkonzwhqptweemwr.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZrbm1na29uendocXB0d2VlbXdyIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0NzI2MjU1MSwiZXhwIjoyMDYyODM4NTUxfQ.ItkI6Qln8qYKTs4bmMmEkG4izZ6YNrdcheoCWrA5FKg';

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase credentials');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function testConnection() {
  try {
    const { data, error } = await supabase.from('bots').select('count').limit(1);
    if (error) throw error;
    console.log('✅ Successfully connected to Supabase');
    return true;
  } catch (err) {
    console.error('❌ Failed to connect to Supabase:', err);
    return false;
  }
}

async function assignBotsToCircles() {
  try {
    console.log('🔄 Fetching bots and topics...');
    
    const { data: bots, error: botsError } = await supabase
      .from('bots')
      .select('bot_id, nickname');
    
    if (botsError) throw new Error(`Failed to fetch bots: ${botsError.message}`);
    if (!bots?.length) throw new Error('No bots found in database');

    const { data: topics, error: topicsError } = await supabase
      .from('topics')
      .select('id, title');
    
    if (topicsError) throw new Error(`Failed to fetch topics: ${topicsError.message}`);
    if (!topics?.length) throw new Error('No topics found in database');

    console.log(`📊 Found ${bots.length} bots and ${topics.length} topics`);

    const assignments = [];
    const assignmentStats = new Map<string, number>();
    const now = new Date().toISOString();

    for (const bot of bots) {
      const shuffled = [...topics].sort(() => 0.5 - Math.random());
      const numCircles = Math.floor(Math.random() * 5) + 1; // 1-5 circles
      const selectedCircles = shuffled.slice(0, numCircles);

      for (const circle of selectedCircles) {
        assignments.push({
          bot_id: bot.bot_id,
          circle_id: circle.id,
          created_at: now
        });
        
        // Track stats
        assignmentStats.set(circle.title, (assignmentStats.get(circle.title) || 0) + 1);
      }
    }

    console.log('🔄 Inserting assignments...');
    let successCount = 0;
    let errorCount = 0;

    for (const assignment of assignments) {
      const { error } = await supabase
        .from('bot_circle_assignment')
        .insert(assignment)
        .select();

      if (error) {
        console.error(
          `❌ Error inserting bot ${assignment.bot_id} to circle ${assignment.circle_id}:`,
          error.message,
          error
        );
        errorCount++;
      } else {
        successCount++;
      }
    }

    console.log('\n📊 Assignment Summary:');
    console.log(`✅ Successfully assigned: ${successCount}`);
    console.log(`❌ Errors: ${errorCount}`);
    
    console.log('\n📈 Bot distribution across topics:');
    for (const [topic, count] of assignmentStats.entries()) {
      console.log(`- ${topic}: ${count} bots`);
    }

  } catch (err) {
    console.error('❌ Error in assignment process:', err);
    process.exit(1);
  }
}

// Run the script
async function main() {
  console.log('🚀 Starting bot-to-circle assignment process...');
  const connected = await testConnection();
  if (!connected) process.exit(1);
  await assignBotsToCircles();
}

main(); 