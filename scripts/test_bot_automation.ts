import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL || 'https://vknmgkonzwhqptweemwr.supabase.co';
const supabaseKey = process.env.SUPABASE_SERVICE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZrbm1na29uendocXB0d2VlbXdyIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0NzI2MjU1MSwiZXhwIjoyMDYyODM4NTUxfQ.ItkI6Qln8qYKTs4bmMmEkG4izZ6YNrdcheoCWrA5FKg';

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase credentials');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function testBotReplies() {
  console.log('\n🧪 Testing Bot Replies...');
  
  // 1. Get initial message count
  const { count: initialCount } = await supabase
    .from('messages')
    .select('*', { count: 'exact', head: true });
  
  // 2. Run bot_replier.ts
  console.log('Running bot_replier.ts...');
  await import('./bot_replier');
  
  // 3. Wait for messages to be processed
  await new Promise(res => setTimeout(res, 10000));
  
  // 4. Get new message count
  const { count: finalCount } = await supabase
    .from('messages')
    .select('*', { count: 'exact', head: true });
  
  console.log(`Messages before: ${initialCount}`);
  console.log(`Messages after: ${finalCount}`);
  console.log(`New messages: ${finalCount - initialCount}`);
}

async function testResetAssignments() {
  console.log('\n🧪 Testing Bot Assignment Reset...');
  
  // 1. Get initial assignment count
  const { count: initialCount } = await supabase
    .from('bot_circle_assignment')
    .select('*', { count: 'exact', head: true });
  
  // 2. Run reset_bot_assignments.ts
  console.log('Running reset_bot_assignments.ts...');
  await import('./reset_bot_assignments');
  
  // 3. Wait for reset to complete
  await new Promise(res => setTimeout(res, 5000));
  
  // 4. Get new assignment count
  const { count: finalCount } = await supabase
    .from('bot_circle_assignment')
    .select('*', { count: 'exact', head: true });
  
  console.log(`Assignments before: ${initialCount}`);
  console.log(`Assignments after: ${finalCount}`);
  
  // 5. Verify distribution
  const { data: assignments } = await supabase
    .from('bot_circle_assignment')
    .select('bot_id, circle_id');
  
  const botAssignments = new Map<string, number>();
  assignments?.forEach(a => {
    botAssignments.set(a.bot_id, (botAssignments.get(a.bot_id) || 0) + 1);
  });
  
  console.log('\nBot assignment distribution:');
  for (const [bot_id, count] of botAssignments.entries()) {
    console.log(`${bot_id}: ${count} circles`);
  }
}

async function main() {
  try {
    await testBotReplies();
    await testResetAssignments();
  } catch (err) {
    console.error('❌ Test failed:', err);
    process.exit(1);
  }
}

main(); 