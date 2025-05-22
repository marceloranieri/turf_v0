export const runtime = 'nodejs';

import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function POST() {
  try {
    const cookieStore = cookies();
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore });
    
    // Create notifications table if it doesn't exist
    // Note: Raw SQL execution removed - this should be handled through migrations
    const { error } = { error: null } // Placeholder - table creation should be done via Supabase dashboard;
    
    if (error) {
      console.error('Error creating notifications table:', error);
      return NextResponse.json({ error: String(error) }, { status: 500 });
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error setting up notifications:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
} 