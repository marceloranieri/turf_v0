"use client"

import { createBrowserClient } from '@supabase/ssr';

const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function checkRateLimit({
  userId,
  endpoint,
  maxRequests = 5,
  windowMs = 10_000,
}: {
  userId: string;
  endpoint: string;
  maxRequests?: number;
  windowMs?: number;
}): Promise<{ allowed: boolean; count: number }> {
  const windowStart = new Date(Date.now() - windowMs).toISOString();

  const { count, error } = await supabase
    .from('api_usage')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId)
    .eq('endpoint', endpoint)
    .gt('timestamp', windowStart);

  if (error) {
    console.error('Rate limit check failed:', error);
    return { allowed: true, count: 0 }; // fail open on error
  }

  if ((count ?? 0) >= maxRequests) {
    return { allowed: false, count: count ?? 0 };
  }

  await supabase.from('api_usage').insert({
    user_id: userId,
    endpoint,
  });

  return { allowed: true, count: count ?? 0 };
}
