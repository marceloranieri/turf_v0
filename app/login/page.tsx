'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import Link from 'next/link'

export default function LoginPage() {
  const router = useRouter()
  const supabase = createClientComponentClient()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    const { error } = await supabase.auth.signInWithPassword({ email, password })

    if (error) setError(error.message)
    else router.push('/dashboard')

    setLoading(false)
  }

  const handleGoogleLogin = async () => {
    setLoading(true)
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`
      }
    })
    if (error) setError(error.message)
    setLoading(false)
  }

  return (
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-2 bg-white text-black">
      
      {/* Left: Auth Form */}
      <div className="flex flex-col justify-center items-center px-8 py-12">
        <div className="w-full max-w-md">
          <div className="flex flex-col items-center space-y-2 mb-6">
            <div className="h-10 w-10 rounded-full bg-emerald-900 text-white flex items-center justify-center text-sm font-bold">🤖</div>
            <h2 className="text-2xl font-semibold">Sign in to Turf</h2>
            <p className="text-sm text-zinc-600 text-center">
              Access your Turf account to unlock personalized features and tools.
            </p>
          </div>

          <button
            onClick={handleGoogleLogin}
            disabled={loading}
            className="w-full bg-white border border-zinc-300 rounded px-4 py-2 flex justify-center items-center gap-2 text-sm mb-4 hover:bg-zinc-50"
          >
            <img src="/google.svg" alt="Google" className="h-5 w-5" />
            Sign In with Google
          </button>

          <div className="flex items-center my-4">
            <div className="flex-grow border-t border-zinc-200" />
            <span className="px-2 text-xs text-zinc-500">Or with email</span>
            <div className="flex-grow border-t border-zinc-200" />
          </div>

          <form onSubmit={handleEmailLogin} className="space-y-4">
            <div>
              <label htmlFor="email" className="text-sm block mb-1">Email</label>
              <input
                type="email"
                id="email"
                value={email}
                required
                onChange={e => setEmail(e.target.value)}
                className="w-full border border-zinc-300 rounded px-4 py-2 text-sm focus:outline-none focus:ring focus:ring-emerald-500"
              />
            </div>

            <div>
              <label htmlFor="password" className="text-sm block mb-1">Password</label>
              <input
                type="password"
                id="password"
                value={password}
                required
                onChange={e => setPassword(e.target.value)}
                className="w-full border border-zinc-300 rounded px-4 py-2 text-sm focus:outline-none focus:ring focus:ring-emerald-500"
              />
            </div>

            {error && <p className="text-sm text-red-500">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white rounded px-4 py-2 text-sm font-medium transition"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <div className="text-sm text-center mt-6 text-zinc-500">
            Don't have an account?{' '}
            <Link href="/register" className="text-emerald-600 hover:underline">
              Sign Up
            </Link>
          </div>
        </div>
      </div>

      {/* Right: Visual Message */}
      <div className="relative hidden md:flex items-center justify-center bg-black px-8">
        <div className="text-center max-w-sm text-white space-y-4">
          <p className="text-lg font-semibold leading-snug">
            Your brain can handle more than 15-second videos. Prove us wrong.
          </p>
          <p className="text-sm text-zinc-400">
            Turf is a live chatroom sparkplug — daily debates around your favorite topics,
            curated nonstop and wiped clean at midnight. Pick a side, test your wit, meet your people.
          </p>
          <img
            src="/braincube.png"
            alt="Brain in Ice"
            className="mx-auto w-40 h-auto mt-4"
          />
        </div>
      </div>
    </div>
  )
} 