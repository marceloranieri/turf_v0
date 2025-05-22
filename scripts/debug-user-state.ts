import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

async function debugUserState() {
  try {
    // 1. Check current session
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    if (sessionError) throw sessionError;
    
    console.log('\n🔑 Current Session:', session ? 'Active' : 'None');
    if (session) {
      console.log('User ID:', session.user.id);
      console.log('Email:', session.user.email);
    }

    // 2. Check profile
    if (session) {
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .single();

      if (profileError) {
        console.log('\n❌ Profile Error:', profileError.message);
      } else {
        console.log('\n👤 Profile:', profile);
      }
    }

    // 3. Check user settings
    if (session) {
      const { data: settings, error: settingsError } = await supabase
        .from('user_settings')
        .select('*')
        .eq('id', session.user.id)
        .single();

      if (settingsError) {
        console.log('\n❌ Settings Error:', settingsError.message);
      } else {
        console.log('\n⚙️ User Settings:', settings);
      }
    }

    // 4. Verify tables exist
    const { data: tables, error: tablesError } = await supabase
      .from('information_schema.tables')
      .select('table_name')
      .in('table_name', ['profiles', 'user_settings'])
      .eq('table_schema', 'public');

    if (tablesError) {
      console.log('\n❌ Tables Error:', tablesError.message);
    } else {
      console.log('\n📋 Available Tables:', tables.map(t => t.table_name));
    }

  } catch (error) {
    console.error('\n❌ Debug Error:', error);
  }
}

debugUserState(); 