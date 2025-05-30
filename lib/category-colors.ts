import { 
  Flame, 
  Brain, 
  Heart, 
  Music, 
  Gamepad2, 
  Code2, 
  Palette, 
  Globe, 
  BookOpen, 
  Briefcase,
  type LucideIcon 
} from "lucide-react"

export type Category = {
  name: string
  color: string
  bgColor: string
  borderColor: string
  icon: LucideIcon
  emoji: string
}

export const categories: Record<string, Category> = {
  "Technology": {
    name: "Technology",
    color: "text-blue-400",
    bgColor: "bg-blue-400/10",
    borderColor: "border-blue-400/20",
    icon: Code2,
    emoji: "💻"
  },
  "Science": {
    name: "Science",
    color: "text-purple-400",
    bgColor: "bg-purple-400/10",
    borderColor: "border-purple-400/20",
    icon: Brain,
    emoji: "🧪"
  },
  "Entertainment": {
    name: "Entertainment",
    color: "text-pink-400",
    bgColor: "bg-pink-400/10",
    borderColor: "border-pink-400/20",
    icon: Music,
    emoji: "🎭"
  },
  "Gaming": {
    name: "Gaming",
    color: "text-green-400",
    bgColor: "bg-green-400/10",
    borderColor: "border-green-400/20",
    icon: Gamepad2,
    emoji: "🎮"
  },
  "Art": {
    name: "Art",
    color: "text-yellow-400",
    bgColor: "bg-yellow-400/10",
    borderColor: "border-yellow-400/20",
    icon: Palette,
    emoji: "🎨"
  },
  "World": {
    name: "World",
    color: "text-red-400",
    bgColor: "bg-red-400/10",
    borderColor: "border-red-400/20",
    icon: Globe,
    emoji: "🌍"
  },
  "Books": {
    name: "Books",
    color: "text-indigo-400",
    bgColor: "bg-indigo-400/10",
    borderColor: "border-indigo-400/20",
    icon: BookOpen,
    emoji: "📚"
  },
  "Business": {
    name: "Business",
    color: "text-cyan-400",
    bgColor: "bg-cyan-400/10",
    borderColor: "border-cyan-400/20",
    icon: Briefcase,
    emoji: "💼"
  },
  "Trending": {
    name: "Trending",
    color: "text-orange-400",
    bgColor: "bg-orange-400/10",
    borderColor: "border-orange-400/20",
    icon: Flame,
    emoji: "🔥"
  },
  "Lifestyle": {
    name: "Lifestyle",
    color: "text-emerald-400",
    bgColor: "bg-emerald-400/10",
    borderColor: "border-emerald-400/20",
    icon: Heart,
    emoji: "✨"
  }
}

export function getCategory(categoryName: string): Category {
  return categories[categoryName] || categories["Trending"]
} 