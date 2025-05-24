import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const testUsers = [
  {
    email: 'test1@example.com',
    password: 'test123456',
    username: 'testuser1',
    avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=test1'
  },
  {
    email: 'test2@example.com',
    password: 'test123456',
    username: 'testuser2',
    avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=test2'
  }
];

async function seedTestUsers() {
  try {
    for (const user of testUsers) {
      // 1. Create auth user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: user.email,
        password: user.password
      });

      if (authError) {
        console.error(`❌ Error creating auth user ${user.email}:`, authError.message);
        continue;
      }

      if (!authData.user) {
        console.error(`❌ No user data returned for ${user.email}`);
        continue;
      }

      // 2. Update profile
      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          username: user.username,
          avatar_url: user.avatar_url
        })
        .eq('id', authData.user.id);

      if (profileError) {
        console.error(`❌ Error updating profile for ${user.email}:`, profileError.message);
      }

      // 3. Create user settings
      const { error: settingsError } = await supabase
        .from('user_settings')
        .insert({
          id: authData.user.id,
          dark_mode: Math.random() > 0.5,
          notifications_enabled: true
        });

      if (settingsError) {
        console.error(`❌ Error creating settings for ${user.email}:`, settingsError.message);
      }

      console.log(`✅ Created test user: ${user.email}`);
    }

    console.log('\n🎉 Test users seeded successfully!');
  } catch (error) {
    console.error('\n❌ Seeding Error:', error);
  }
}

seedTestUsers();
