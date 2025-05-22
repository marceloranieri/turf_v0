"use client"

import { useEffect, useRef } from "react"
import Image from "next/image"

const LOGOS = [
  { name: "Spotify", image: "/spotify-logo.png" },
  { name: "Discord", image: "/discord-logo.png" },
  { name: "Steam", image: "/steam-logo.png" },
  { name: "Netflix", image: "/netflix-logo.png" },
  { name: "Reddit", image: "/reddit-logo.png" },
  { name: "GitHub", image: "/github-logo.png" },
]

export function IntegrationsGlow() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas dimensions
    const setCanvasDimensions = () => {
      const container = canvas.parentElement
      if (!container) return

      canvas.width = container.offsetWidth
      canvas.height = 400
    }

    setCanvasDimensions()
    window.addEventListener("resize", setCanvasDimensions)

    // Create gradient
    const createGradient = () => {
      const gradient = ctx!.createLinearGradient(0, 0, (canvas?.width || 0), (canvas?.height || 0))
      gradient.addColorStop(0, "rgba(139, 92, 246, 0.1)") // violet-500 with low opacity
      gradient.addColorStop(0.5, "rgba(79, 70, 229, 0.2)") // indigo-600 with medium opacity
      gradient.addColorStop(1, "rgba(139, 92, 246, 0.1)") // violet-500 with low opacity
      return gradient
    }

    // Particle properties
    const particleCount = 200
    const particles: Particle[] = []

    class Particle {
      x: number
      y: number
      size: number
      speedX: number
      speedY: number
      color: string

      constructor() {
        this.x = Math.random() * (canvas?.width || 0)
        this.y = Math.random() * (canvas?.height || 0)
        this.size = Math.random() * 3 + 1
        this.speedX = (Math.random() - 0.5) * 0.5
        this.speedY = (Math.random() - 0.5) * 0.5
        this.color = `rgba(${Math.floor(Math.random() * 100 + 155)}, ${Math.floor(Math.random() * 50 + 100)}, ${Math.floor(Math.random() * 100 + 155)}, ${Math.random() * 0.5 + 0.1})`
      }

      update() {
        this.x += this.speedX
        this.y += this.speedY

        if (this.x > (canvas?.width || 0)) this.x = 0
        else if (this.x < 0) this.x = canvas?.width || 0

        if (this.y > (canvas?.height || 0)) this.y = 0
        else if (this.y < 0) this.y = canvas?.height || 0
      }

      draw() {
        if (!ctx) return
        ctx!.beginPath()
        ctx!.arc(this.x, this.y, this.size, 0, Math.PI * 2)
        ctx!.fillStyle = this.color
        ctx!.fill()
      }
    }

    // Initialize particles
    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle())
    }

    // Animation loop
    function animate() {
      ctx!.clearRect(0, 0, (canvas?.width || 0), (canvas?.height || 0))

      // Draw background gradient
      ctx!.fillStyle = createGradient()
      ctx!.fillRect(0, 0, (canvas?.width || 0), (canvas?.height || 0))

      // Draw particles
      for (const particle of particles) {
        particle.update()
        particle.draw()
      }

      // Draw glow effect
      const centerX = (canvas?.width || 0) / 2
      const centerY = (canvas?.height || 0) / 2

      const gradient = ctx!.createRadialGradient(centerX, centerY, 0, centerX, centerY, (canvas?.width || 0) * 0.6)

      gradient.addColorStop(0, "rgba(139, 92, 246, 0.3)") // violet-500
      gradient.addColorStop(0.5, "rgba(79, 70, 229, 0.1)") // indigo-600
      gradient.addColorStop(1, "rgba(0, 0, 0, 0)")

      ctx!.fillStyle = gradient
      ctx!.fillRect(0, 0, (canvas?.width || 0), (canvas?.height || 0))

      requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener("resize", setCanvasDimensions)
    }
  }, [])

  return (
    <div className="relative h-[400px]">
      <canvas ref={canvasRef} className="absolute inset-0 z-0 rounded-xl" />

      <div className="relative z-10 flex items-center justify-center h-full">
        <div className="grid grid-cols-3 md:grid-cols-6 gap-8 px-4">
          {LOGOS.map((logo, index) => (
            <div
              key={index}
              className="flex items-center justify-center bg-zinc-900/50 backdrop-blur-sm p-4 rounded-xl border border-zinc-800 hover:border-violet-500/50 transition-all hover:scale-105 hover:shadow-lg hover:shadow-violet-500/10"
            >
              <Image
                src={logo.image || "/placeholder.svg"}
                alt={logo.name}
                width={60}
                height={60}
                className="w-12 h-12 object-contain filter grayscale hover:grayscale-0 transition-all"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
