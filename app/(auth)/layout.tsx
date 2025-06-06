import "../globals.css"

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 min-h-screen relative">
      {/* Video Background */}
      <div className="relative hidden md:block w-full h-full">
        <video
          className="absolute top-0 left-0 w-full h-full object-cover"
          src="/turf-auth-loop.mp4"
          autoPlay
          loop
          muted
          playsInline
        />
        <div className="absolute inset-0 bg-black/30 z-10" />
        <div className="relative z-20 flex items-center justify-center h-full">
          <h1 className="text-4xl font-bold text-white">Welcome to Turf</h1>
        </div>
      </div>

      {/* Dynamic Left Panel */}
      <div className="flex items-center justify-center bg-black text-white p-8">
        <div className="w-full max-w-md">{children}</div>
      </div>
    </div>
  )
} 