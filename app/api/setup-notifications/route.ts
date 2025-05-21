import { NextResponse } from "next/server";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

export async function POST() {
  try {
    const cookieStore = cookies();
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore });
    
    // Add null check for supabase
    if (!supabase) {
      return NextResponse.json(
        { error: 'Supabase client not initialized' },
        { status: 500 }
      );
    }
    
    // Use RPC function instead of direct SQL query
    const { error } = await supabase.rpc('setup_notifications_table');
    
    if (error) {
      console.error('Error setting up notifications:', error);
      return NextResponse.json(
        { error: 'Failed to set up notifications' },
        { status: 500 }
      );
    }
    
    return NextResponse.json({
      message: "Notifications set up successfully"
    });
  } catch (error) {
    console.error('Error setting up notifications:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
