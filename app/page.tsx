import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ParticleBackground } from "@/components/particle-background"
import { IntegrationsGlow } from "@/components/integrations-glow"
import { FeatureCard } from "@/components/feature-card"
import { TestimonialCard } from "@/components/testimonial-card"

export default function Home() {
  return (
    <div className="relative min-h-screen bg-black text-white overflow-hidden">
      <ParticleBackground />

      {/* Hero Section */}
      <section className="relative pt-32 pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-violet-400 to-indigo-400 mb-6">
            Talk Like a Human. Not a Handle.
          </h1>
          <p className="text-xl md:text-2xl text-zinc-400 mb-10 leading-relaxed">
            Turf is a new kind of social space—one where chats are real, ideas matter, and nobody's chasing likes.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button className="bg-violet-600 hover:bg-violet-700 text-white px-8 py-6 rounded-xl text-lg font-medium transition-all hover:scale-105">
              Start chatting — it's free
            </Button>
            <Button
              variant="outline"
              className="border-zinc-700 text-zinc-300 hover:bg-zinc-800 px-8 py-6 rounded-xl text-lg font-medium transition-all"
            >
              See how it works
            </Button>
          </div>
        </div>

        <div className="mt-20 relative">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black z-10 pointer-events-none h-40 bottom-0"></div>
          <div className="relative z-0 rounded-xl overflow-hidden border border-zinc-800 shadow-2xl">
            <Image
              src="/placeholder-rzwyt.png"
              alt="Turf app interface"
              width={1200}
              height={600}
              className="w-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">What Makes Turf Actually Fun</h2>
          <p className="text-lg text-zinc-400 max-w-2xl mx-auto">
            We built Turf to be the social app we've always wanted—where conversations feel real again.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FeatureCard
            icon="clock"
            title="Ephemeral Circles"
            description="New topics, new people, every 24 hours."
            gradient="from-purple-500 to-indigo-500"
          />
          <FeatureCard
            icon="music"
            title="Taste Match"
            description="Connect over your Spotify, Netflix, Steam, or whatever you vibe with."
            gradient="from-violet-500 to-fuchsia-500"
          />
          <FeatureCard
            icon="brain"
            title="AI Picks, Not AI Chats"
            description="Our AI suggests conversations — you do the talking."
            gradient="from-blue-500 to-cyan-500"
          />
          <FeatureCard
            icon="book"
            title="Recaps"
            description="TL;DRs that actually help you stay in the loop."
            gradient="from-indigo-500 to-blue-500"
          />
        </div>
      </section>

      {/* Integrations Section */}
      <section className="relative py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto overflow-hidden">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Connect Your Digital Life</h2>
          <p className="text-lg text-zinc-400 max-w-2xl mx-auto">
            Turf integrates with the services you already use, making it easy to share what you love.
          </p>
        </div>

        <IntegrationsGlow />
      </section>

      {/* Testimonials Section */}
      <section className="relative py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">People Are Kinda Into It</h2>
          <p className="text-lg text-zinc-400 max-w-2xl mx-auto">
            Don't take our word for it—here's what our users have to say.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <TestimonialCard
            quote="I joined for the anime chat. Stayed for the bizarre late-night hypotheticals."
            author="Alex K."
            role="Designer"
            avatar="/placeholder.svg?height=80&width=80"
          />
          <TestimonialCard
            quote="No likes. No pressure. Just vibes."
            author="Jamie T."
            role="Student"
            avatar="/placeholder.svg?height=80&width=80"
          />
          <TestimonialCard
            quote="This is the only social app I've used that didn't make me feel worse after."
            author="Sam R."
            role="Developer"
            avatar="/placeholder.svg?height=80&width=80"
          />
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="relative py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto bg-gradient-to-r from-zinc-900 to-zinc-800 p-12 rounded-2xl border border-zinc-800">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Try a Better Version of Social.</h2>
          <p className="text-lg text-zinc-400 mb-8">
            Join thousands of people who are rediscovering what makes conversations meaningful.
          </p>
          <Button className="bg-violet-600 hover:bg-violet-700 text-white px-8 py-6 rounded-xl text-lg font-medium transition-all hover:scale-105">
            Start Now — Free & Instant
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-zinc-800">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-6 md:mb-0">
            <div className="flex items-center">
              <div className="h-8 w-8 rounded-full bg-gradient-to-r from-violet-600 to-indigo-600 mr-2"></div>
              <span className="text-xl font-bold">Turf</span>
            </div>
            <p className="text-zinc-500 mt-2">Chat like no one's watching.</p>
          </div>

          <div className="flex flex-wrap gap-8">
            <Link href="#" className="text-zinc-400 hover:text-white transition-colors">
              About
            </Link>
            <Link href="#" className="text-zinc-400 hover:text-white transition-colors">
              Privacy
            </Link>
            <Link href="#" className="text-zinc-400 hover:text-white transition-colors">
              Terms
            </Link>
            <Link href="#" className="text-zinc-400 hover:text-white transition-colors">
              Contact
            </Link>
          </div>

          <div className="mt-6 md:mt-0">
            <p className="text-zinc-500">© 2024 Turf. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
