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
    
    // Use RPC function instead of direct SQL query
    const { error } = await supabaseAdmin.rpc('setup_initial_database');
    
    if (error) {
      console.error('Error setting up database:', error);
      return NextResponse.json(
        { error: 'Failed to set up database' },
        { status: 500 }
      );
    }
    
    return NextResponse.json({
      message: "Database set up successfully"
    });
  } catch (error) {
    console.error('Error setting up database:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
