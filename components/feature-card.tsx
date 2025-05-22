import { Clock, Music, Brain, BookOpen } from "lucide-react"

interface FeatureCardProps {
  icon: string
  title: string
  description: string
  gradient: string
}

export function FeatureCard({ icon, title, description, gradient }: FeatureCardProps) {
  const getIcon = () => {
    switch (icon) {
      case "clock":
        return <Clock className="h-6 w-6" />
      case "music":
        return <Music className="h-6 w-6" />
      case "brain":
        return <Brain className="h-6 w-6" />
      case "book":
        return <BookOpen className="h-6 w-6" />
      default:
        return <Clock className="h-6 w-6" />
    }
  }

  return (
    <div className="bg-zinc-900/80 backdrop-blur-sm border border-zinc-800 rounded-xl p-6 hover:border-zinc-700 transition-all hover:shadow-lg hover:shadow-violet-500/5 hover:translate-y-[-4px] group">
      <div className={`bg-gradient-to-r ${gradient} p-3 rounded-lg inline-block mb-4`}>{getIcon()}</div>

      <h3 className="text-xl font-semibold mb-2 group-hover:text-violet-400 transition-colors">{title}</h3>
      <p className="text-zinc-400">{description}</p>
    </div>
  )
}
