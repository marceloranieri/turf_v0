export const runtime = 'nodejs';

import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function POST() {
  try {
    const cookieStore = cookies();
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore });
    
    // Add null check for supabase client
    if (!supabase) {
      return NextResponse.json(
        { error: 'Supabase client not initialized' },
        { status: 500 }
      );
    }
    
    // Create bookmarks table if it doesn't exist
    const { error: tableError } = await supabase.rpc('create_bookmarks_table');
    
    if (tableError) {
      // Instead of using .query() directly, create an RPC function in Supabase
      // that runs this SQL, then call it here
      const { error: setupError } = await supabase.rpc('setup_bookmarks_tables_and_policies');
      
      if (setupError) {
        console.error('Error creating bookmarks table:', setupError);
        return NextResponse.json({ error: setupError.message }, { status: 500 });
      }
    }
    
    // Create trigger to auto-delete expired bookmarks
    const { error: triggerError } = await supabase.rpc('setup_bookmarks_triggers');
    
    if (triggerError) {
      console.error('Error creating trigger:', triggerError);
      return NextResponse.json({ error: triggerError.message }, { status: 500 });
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error setting up bookmarks:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
