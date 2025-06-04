import { cookies } from 'next/headers';
import { createServerClient } from '@supabase/ssr';

export const getCurrentUser = async () => {
  const cookieStore = cookies();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: () => cookieStore }
  );

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error) {
    console.error("❌ Supabase getUser error:", error.message);
    return null;
  }

  return user;
}; 