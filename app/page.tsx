import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ParticleBackground } from "@/components/particle-background"

export default function Home() {
  return (
    <div className="relative min-h-screen w-full flex flex-col items-center justify-center bg-black p-4">
      <ParticleBackground />

      <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent pointer-events-none z-10"></div>

      <div className="z-20 text-center max-w-3xl">
        <div className="flex flex-col items-center mb-8">
          <div className="h-16 w-16 rounded-full bg-gradient-to-r from-violet-600 to-indigo-600 flex items-center justify-center mb-4">
            <span className="text-2xl font-bold text-white">T</span>
          </div>
          <h1 className="text-4xl font-bold text-white mb-4">Turf</h1>
          <p className="text-xl text-zinc-400 mb-8">Talk Like a Human. Not a Handle.</p>
        </div>

        <p className="text-zinc-300 mb-8">
          Turf is a new kind of social space—one where chats are real, ideas matter, and nobody's chasing likes.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            asChild
            className="bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white py-6 px-8 rounded-lg transition-all hover:scale-[1.02]"
          >
            <Link href="/register">Get Started</Link>
          </Button>
          <Button
            asChild
            variant="outline"
            className="bg-zinc-800/80 border-zinc-700/50 text-white hover:bg-zinc-800 py-6 px-8 rounded-lg"
          >
            <Link href="/login">Sign In</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
