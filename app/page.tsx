import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ParticleBackground } from "@/components/particle-background"
import DailyDebateTopics from "@/components/DailyDebateTopics"

export default function HomePage() {
  return (
    <div className="container mx-auto py-10 px-4">
      <div className="max-w-6xl mx-auto space-y-12">
        <section className="text-center space-y-4">
          <h1 className="text-4xl font-bold">Welcome to Debate Topics</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Explore thought-provoking debate topics across various categories.
            New topics are selected daily to keep the discussions fresh and engaging.
          </p>
        </section>

        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold">Today's Debate Topics</h2>
          </div>
          <DailyDebateTopics />
        </section>
      </div>
    </div>
  )
}
