import { NextResponse } from 'next/server';
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    const { email, password } = await req.json();

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 401 });
    }

    return NextResponse.json({ user: data.user });
  } catch (error) {
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    );
  }
} 