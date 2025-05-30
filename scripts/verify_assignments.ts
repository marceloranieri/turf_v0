import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://vknmgkonzwhqptweemwr.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZrbm1na29uendocXB0d2VlbXdyIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0NzI2MjU1MSwiZXhwIjoyMDYyODM4NTUxfQ.ItkI6Qln8qYKTs4bmMmEkG4izZ6YNrdcheoCWrA5FKg';

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase credentials');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function verifyAssignments() {
  try {
    console.log('🔍 Verifying bot-to-circle assignments...');

    // Get all assignments with bot and topic details
    const { data: assignments, error } = await supabase
      .from('bot_circle_assignment')
      .select(`
        bot_id,
        circle_id,
        created_at,
        bots (
          nickname,
          personality_prompt
        ),
        topics (
          title,
          category
        )
      `)
      .order('created_at', { ascending: false });

    if (error) throw error;

    if (!assignments?.length) {
      console.log('❌ No assignments found');
      return;
    }

    // Group assignments by topic
    const topicStats = new Map<string, {
      count: number;
      bots: Array<{ nickname: string; personality: string }>;
    }>();

    assignments.forEach(assignment => {
      const topicTitle = assignment.topics?.title || 'Unknown Topic';
      const current = topicStats.get(topicTitle) || { count: 0, bots: [] };
      
      current.count++;
      current.bots.push({
        nickname: assignment.bots?.nickname || 'Unknown Bot',
        personality: assignment.bots?.personality_prompt || 'No personality set'
      });
      
      topicStats.set(topicTitle, current);
    });

    // Print summary
    console.log('\n📊 Assignment Summary:');
    console.log(`Total assignments: ${assignments.length}`);
    console.log(`Unique topics: ${topicStats.size}`);
    
    console.log('\n📈 Bot distribution by topic:');
    for (const [topic, stats] of topicStats.entries()) {
      console.log(`\n${topic}:`);
      console.log(`  Total bots: ${stats.count}`);
      console.log('  Bot personalities:');
      stats.bots.forEach(bot => {
        console.log(`    - ${bot.nickname}: ${bot.personality.split('.')[0]}`);
      });
    }

  } catch (err) {
    console.error('❌ Error verifying assignments:', err);
    process.exit(1);
  }
}

// Run the verification
verifyAssignments(); 