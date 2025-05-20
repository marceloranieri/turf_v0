import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

// Export with the name the code is expecting
export const createClient = () => {
  return createServerComponentClient({ cookies });
};

// Keep old name for backward compatibility
export const createServerSupabaseClient = createClient;

export default createClient; 