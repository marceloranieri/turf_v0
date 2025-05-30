import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { startOfMonth } from 'https://esm.sh/date-fns@2.29.3'

const MONTHLY_LIMIT = 17000000 // 17M tokens = ~$60
const ALERT_THRESHOLD = 0.85

serve(async (req) => {
  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const { data: usage } = await supabase
      .from('token_usage')
      .select('tokens_used')
      .gte('created_at', startOfMonth(new Date()).toISOString())

    const totalUsed = usage?.reduce((sum, row) => sum + row.tokens_used, 0) || 0

    if (totalUsed > MONTHLY_LIMIT * ALERT_THRESHOLD) {
      await fetch(Deno.env.get('SLACK_WEBHOOK_URL') ?? '', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: `🚨 Turf Alert: GPT token usage hit ${Math.round(totalUsed / 1000)}K this month. You're near your $60 budget cap.`
        })
      })
    }

    return new Response(
      JSON.stringify({ success: true, totalUsed }),
      { headers: { 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    )
  }
}) 