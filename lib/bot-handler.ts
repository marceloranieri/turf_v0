import { createClient } from '@supabase/supabase-js'
import OpenAI from 'openai'
import { startOfMonth } from 'date-fns'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
})

const MONTHLY_LIMIT = 17000000 // 17M tokens = ~$60
const ALERT_THRESHOLD = 0.85

interface Bot {
  bot_id: string
  nickname: string
  personality_prompt: string
  behavior: string
}

export async function handleBotResponse(botId: string, userMessage: string) {
  // Check if bots are enabled
  const { data: config } = await supabase
    .from('config')
    .select('value')
    .eq('key', 'bots_enabled')
    .single()

  if (!config?.value) {
    console.log('Bots are currently disabled')
    return null
  }

  // Check token usage
  const { data: usage } = await supabase
    .from('token_usage')
    .select('tokens_used')
    .gte('created_at', startOfMonth(new Date()).toISOString())

  const totalUsed = usage?.reduce((sum, row) => sum + row.tokens_used, 0) || 0

  if (totalUsed > MONTHLY_LIMIT * ALERT_THRESHOLD) {
    // Send Slack alert
    await fetch(process.env.SLACK_WEBHOOK_URL!, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        text: `🚨 Turf Alert: GPT token usage hit ${Math.round(totalUsed / 1000)}K this month. You're near your $60 budget cap.`
      })
    })

    // If over limit, only respond to mentions
    if (totalUsed > MONTHLY_LIMIT && !userMessage.includes('@')) {
      return null
    }
  }

  // Get bot details
  const { data: bot } = await supabase
    .from('bots')
    .select('*')
    .eq('bot_id', botId)
    .single()

  if (!bot) {
    console.error('Bot not found:', botId)
    return null
  }

  // Generate response
  const systemMessage = `You are ${bot.nickname}. ${bot.personality_prompt}. Follow these constraints: ${bot.behavior}`

  const response = await openai.chat.completions.create({
    model: 'gpt-3.5-turbo',
    messages: [
      { role: 'system', content: systemMessage },
      { role: 'user', content: userMessage }
    ],
    max_tokens: 200
  })

  // Log token usage
  await supabase.from('token_usage').insert({
    bot_id: bot.bot_id,
    tokens_used: response.usage?.total_tokens || 0
  })

  return response.choices[0]?.message?.content
}

// Function to check and send token usage alerts
export async function checkTokenUsage() {
  const { data: usage } = await supabase
    .from('token_usage')
    .select('tokens_used')
    .gte('created_at', startOfMonth(new Date()).toISOString())

  const totalUsed = usage?.reduce((sum, row) => sum + row.tokens_used, 0) || 0

  if (totalUsed > MONTHLY_LIMIT * ALERT_THRESHOLD) {
    await fetch(process.env.SLACK_WEBHOOK_URL!, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        text: `🚨 Turf Alert: GPT token usage hit ${Math.round(totalUsed / 1000)}K this month. You're near your $60 budget cap.`
      })
    })
  }
} 