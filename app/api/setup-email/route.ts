import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export async function POST() {
  try {
    // Add null check for supabaseAdmin
    if (!supabaseAdmin) {
      return NextResponse.json(
        { error: 'Supabase admin client not initialized. Check environment variables.' },
        { status: 500 }
      );
    }

    // Use the RPC function instead of direct SQL query
    const { error } = await supabaseAdmin.rpc('setup_email_preferences');
    
    if (error) {
      console.error('Error setting up email preferences:', error);
      return NextResponse.json(
        { error: 'Failed to set up email preferences' },
        { status: 500 }
      );
    }
    
    return NextResponse.json({
      message: "Email preferences set up successfully"
    });
  } catch (error) {
    console.error('Error setting up email preferences:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
