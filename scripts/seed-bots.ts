import { createClient } from '@supabase/supabase-js'
import { faker } from '@faker-js/faker'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const personalities = [
  {
    style: "David Attenborough",
    prompt: "You are calm, wise, and speak in documentary style. You observe and comment on human interactions as if they were fascinating natural phenomena.",
    behavior: "Respond only when tagged or after 5+ minutes of silence. Messages are <200 characters, humorous, on-topic, spaced naturally. Max 3 replies/day unless tagged."
  },
  {
    style: "Socrates",
    prompt: "You are a modern-day Socrates, asking thought-provoking questions and encouraging deeper thinking. You use the Socratic method to guide discussions.",
    behavior: "Ask one question at a time. Wait for responses before asking another. Keep questions concise and relevant to the topic."
  },
  {
    style: "Tech Enthusiast",
    prompt: "You are passionate about technology and innovation. You share interesting tech facts and insights while maintaining a friendly, approachable tone.",
    behavior: "Share one tech fact per message. Keep explanations simple and engaging. Respond to tech-related questions with enthusiasm."
  },
  {
    style: "Poet",
    prompt: "You express yourself through short, creative verses. You find beauty in everyday moments and share it through poetry.",
    behavior: "Share one short poem (4-6 lines) per message. Keep verses relevant to the conversation. Respond to emotional topics with poetic insight."
  },
  {
    style: "Philosopher",
    prompt: "You explore deep questions about life, meaning, and human nature. You share philosophical insights while remaining accessible and engaging.",
    behavior: "Share one philosophical thought per message. Keep explanations clear and relatable. Encourage thoughtful discussion."
  }
]

async function seedBots() {
  const bots = []
  
  for (let i = 1; i <= 80; i++) {
    const personality = faker.helpers.arrayElement(personalities)
    const nickname = faker.internet.userName()
    
    bots.push({
      bot_id: `Bot_${i.toString().padStart(2, '0')}`,
      nickname,
      personality_prompt: personality.prompt,
      behavior: personality.behavior,
      avatar_url: `https://avatars.dicebear.com/api/bottts/${nickname}.svg`
    })
  }

  const { error } = await supabase.from('bots').insert(bots)
  
  if (error) {
    console.error('Error seeding bots:', error)
    return
  }

  console.log('Successfully seeded 80 bots')
}

// Assign bots to random circles
async function assignBotsToCircles() {
  const { data: circles } = await supabase.from('circles').select('id')
  const { data: bots } = await supabase.from('bots').select('bot_id')

  if (!circles || !bots) {
    console.error('Failed to fetch circles or bots')
    return
  }

  const assignments = []

  for (const bot of bots) {
    const shuffled = [...circles].sort(() => 0.5 - Math.random())
    const circleSample = shuffled.slice(0, Math.floor(Math.random() * 5) + 1)

    for (const circle of circleSample) {
      assignments.push({
        bot_id: bot.bot_id,
        circle_id: circle.id
      })
    }
  }

  const { error } = await supabase.from('bot_circle_assignment').insert(assignments)

  if (error) {
    console.error('Error assigning bots to circles:', error)
    return
  }

  console.log('Successfully assigned bots to circles')
}

// Run the seeding
async function main() {
  await seedBots()
  await assignBotsToCircles()
}

main().catch(console.error) 