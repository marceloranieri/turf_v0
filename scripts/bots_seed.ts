// scripts/bots_seed.ts
import { createClient } from '@supabase/supabase-js';

// Using your actual Supabase project values:
const supabaseUrl = 'https://vknmgkonzwhqptweemwr.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZrbm1na29uendocXB0d2VlbXdyIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0NzI2MjU1MSwiZXhwIjoyMDYyODM4NTUxfQ.ItkI6Qln8qYKTs4bmMmEkG4izZ6YNrdcheoCWrA5FKg';

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase credentials');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const inspirations = [
  ["Jim Carrey", "silly, fast-paced, unpredictable, uses exaggerated metaphors"],
  ["Tina Fey", "witty, sarcastic, clever, observational"],
  ["Keanu Reeves", "calm, thoughtful, sincere, understated humor"],
  ["David Attenborough", "calm, wise, speaks in documentary style"],
  ["Issa Rae", "awkwardly charming, sharp, authentic"],
  ["Larry David", "neurotic, blunt, deadpan"],
  ["Phoebe Waller-Bridge", "dry humor, self-deprecating, chaotic wit"],
  ["Robin Williams", "rapid-fire, improvisational, heartfelt"],
  ["Bill Nye", "enthusiastic, nerdy, educational with punchlines"],
  ["Oprah Winfrey", "empathetic, wise, uplifting"],
  ["Anthony Bourdain", "world-weary, adventurous, brutally honest"],
  ["Jon Stewart", "smart, satirical, sharp political insight"],
  ["Ali Wong", "raunchy, smart, brutally honest"],
  ["Bob Ross", "soothing, encouraging, metaphorical"],
  ["Pedro Pascal", "gentle swagger, charming, warm"],
  ["Zendaya", "cool, composed, subtle wit"],
  ["Donald Glover", "meta, unpredictable, creatively layered"],
  ["Ricky Gervais", "biting sarcasm, atheist wit, UK vibe"],
  ["Greta Thunberg", "direct, purpose-driven, sharp logic"],
  ["Neil deGrasse Tyson", "explainer, nerdy passion, cosmic humor"]
];

const customNicknames = [
  "ThornWhisperer", "RavenClaw", "StormChaser", "WolfHowl", "FrostBite", "EmberGlow", "TideTurner", "LeafDancer",
  "StoneSilent", "SkyDiver", "ByteBender", "CodeCracker", "QuantumLeap", "NanoNinja", "CircuitSurfer",
  "DataDrifter", "PixelPirate", "TechTinker", "CyberSphinx", "LogicLurker", "DragonDreamer", "PhoenixFlight",
  "GriffinGaze", "ValkyrieVibe", "TitanTamer", "ElfEcho", "DwarfDynamo", "MermaidMystic", "CentaurSprint",
  "GoblinGrin", "SpiceSorcerer", "BrewMaster", "CookieCraze", "SushiSamurai", "TacoTitan", "PizzaPhantom",
  "LatteLover", "WhiskeyWanderer", "MochaMaven", "CurryConnoisseur", "EchoEnigma", "VortexVoyager", "ShadowSeeker",
  "DreamWeaver", "TimeTraveler", "MindMeld", "SoulSearcher", "FateFinder", "TruthTeller", "WisdomWhisper",
  "JediJester", "HobbitHunter", "TrekkerTales", "PotterPundit", "MarvelManiac", "DCDevotee", "WitcherWatcher",
  "ThronesThrone", "StarWarsSage", "AnimeAddict", "PunIntended", "WordPlayground", "JestQuest", "QuipQueen",
  "RiddleRider", "BanterBandit", "SarcasmSage", "WittyKitty", "HumorHound", "LaughLord", "CodeNinja",
  "ArtAlchemist", "MusicMaestro", "BookBard", "FilmFanatic", "GameGuru", "SportSpecter", "TravelTrekker",
  "CraftCrafter", "PhotoPhantom"
];

const avatarSources = [
  (seed: string) => `https://avatars.dicebear.com/api/bottts/${seed}.svg`,
  (seed: string) => `https://api.dicebear.com/6.x/thumbs/svg?seed=${seed}`,
  (seed: string) => `https://api.dicebear.com/6.x/fun-emoji/svg?seed=${seed}`,
  (seed: string) => `https://api.multiavatar.com/${seed}.png`,
  (seed: string) => `https://robohash.org/${seed}.png`,
  (seed: string) => {
    const categories = ["manga", "cat", "person", "dog", "nature", "anime"];
    const cat = categories[Math.floor(Math.random() * categories.length)];
    const lock = Math.floor(Math.random() * 1000);
    return `https://loremflickr.com/320/320/${cat}?lock=${lock}`;
  }
];

async function seedBots() {
  try {
    const bots = [];

    for (let i = 0; i < 80; i++) {
      const [inspiration, tone] = inspirations[i % inspirations.length];
      const nickname = customNicknames[i];
      const bot_id = `Bot_${(i + 1).toString().padStart(2, '0')}`;
      const personality_prompt = `Your style resembles ${inspiration}, but you never reference them. You are ${tone}.`;
      const behavior = "Respond only when tagged or after 5+ minutes of silence. Messages are <200 characters, humorous, on-topic, spaced naturally. Max 3 replies/day unless tagged.";
      const avatar_url = avatarSources[Math.floor(Math.random() * avatarSources.length)](nickname);

      bots.push({ bot_id, nickname, personality_prompt, behavior, avatar_url });
    }

    console.log('🔄 Inserting bots into Supabase...');
    const { data, error } = await supabase.from("bots").insert(bots).select();

    if (error) {
      console.error("❌ Failed to insert bots:", error.message);
      console.error("Error details:", error);
      process.exit(1);
    }

    console.log(`✅ Successfully inserted ${data?.length || bots.length} bots.`);
    console.log('📊 First few bots inserted:', data?.slice(0, 3));
  } catch (err) {
    console.error('❌ Unexpected error:', err);
    process.exit(1);
  }
}

// Test Supabase connection before seeding
async function testConnection() {
  try {
    const { data, error } = await supabase.from('bots').select('count').limit(1);
    if (error) throw error;
    console.log('✅ Successfully connected to Supabase');
    return true;
  } catch (err) {
    console.error('❌ Failed to connect to Supabase:', err);
    return false;
  }
}

// Run the script
async function main() {
  console.log('🚀 Starting bot seeding process...');
  const connected = await testConnection();
  if (!connected) process.exit(1);
  await seedBots();
}

main();