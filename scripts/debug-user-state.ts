import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error("❌ Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function debugUser() {
  console.log("🔍 Checking current user session...");

  const { data: { session }, error: sessionError } = await supabase.auth.getSession();

  if (sessionError) {
    console.error("❌ Error fetching session:", sessionError.message);
    return;
  }

  if (!session) {
    console.warn("⚠️ No active session found. Try logging in via your app and rerun this.");
    return;
  }

  console.log("✅ Session found for user:", session.user.email);

  const userId = session.user.id;

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .single();

  const { data: settings, error: settingsError } = await supabase
    .from("user_settings")
    .select("*")
    .eq("id", userId)
    .single();

  console.log("\n📄 Profile:");
  profileError ? console.error(profileError.message) : console.dir(profile, { depth: null });

  console.log("\n⚙️ Settings:");
  settingsError ? console.error(settingsError.message) : console.dir(settings, { depth: null });
}

debugUser();
