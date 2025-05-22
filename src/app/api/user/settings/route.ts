import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { withRateLimit } from '@/lib/rate-limit';
import { withValidation } from '@/middleware/validation';
import { userSettingsSchema } from '@/lib/validations/api';

// GET handler for user settings
async function getSettingsHandler(request: NextRequest) {
  const supabase = createClient();
  
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    return new NextResponse(
      JSON.stringify({ error: 'Unauthorized' }),
      { status: 401, headers: { 'Content-Type': 'application/json' } }
    );
  }

  const { data: settings, error } = await supabase
    .from('user_settings')
    .select('*')
    .eq('user_id', user.id)
    .single();

  if (error) {
    return new NextResponse(
      JSON.stringify({ error: 'Failed to fetch settings' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }

  return NextResponse.json(settings);
}

// PATCH handler for updating user settings
async function updateSettingsHandler(request: NextRequest, data: { body: any }) {
  const supabase = createClient();
  
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    return new NextResponse(
      JSON.stringify({ error: 'Unauthorized' }),
      { status: 401, headers: { 'Content-Type': 'application/json' } }
    );
  }

  const { error } = await supabase
    .from('user_settings')
    .upsert({
      user_id: user.id,
      ...data.body,
      updated_at: new Date().toISOString(),
    });

  if (error) {
    return new NextResponse(
      JSON.stringify({ error: 'Failed to update settings' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }

  return new NextResponse(null, { status: 204 });
}

// Apply rate limiting and validation to the handlers
export const GET = withRateLimit(
  withValidation(
    { query: undefined },
    getSettingsHandler
  )
);

export const PATCH = withRateLimit(
  withValidation(
    { body: userSettingsSchema },
    updateSettingsHandler
  )
); 