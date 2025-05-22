import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  // Verify this is a legitimate cron request
  const authHeader = request.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  
  try {
    const supabase = createClient();
    
    // Call the cleanup function
    const { error } = await supabase.rpc('cleanup_expired_analytics_cache');
    
    if (error) {
      throw error;
    }
    
    return NextResponse.json({ 
      success: true,
      message: 'Cache cleanup completed successfully'
    });
  } catch (error) {
    console.error('Cache cleanup error:', error);
    return NextResponse.json({ 
      error: 'Failed to clean up cache',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
} 