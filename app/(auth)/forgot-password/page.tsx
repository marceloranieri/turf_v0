'use client'

import { useState } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

export default function ForgotPasswordPage() {
  const supabase = createClientComponentClient()
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setMessage('')

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/create-password`
    })

    if (error) {
      setError(error.message)
    } else {
      setMessage('Check your email for a reset link.')
    }

    setLoading(false)
  }

  return (
    <>
      <h2 className="text-2xl font-bold text-center mb-6">Forgot Password?</h2>
      <form onSubmit={handleReset} className="space-y-4">
        <input
          className="w-full px-4 py-2 bg-zinc-800 border border-zinc-600 rounded text-white"
          placeholder="Email"
          required
          value={email}
          onChange={e => setEmail(e.target.value)}
        />
        {error && <p className="text-red-500 text-sm">{error}</p>}
        {message && <p className="text-green-400 text-sm">{message}</p>}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-violet-600 hover:bg-violet-700 text-white py-2 rounded"
        >
          {loading ? 'Sending...' : 'Send Reset Link'}
        </button>
      </form>
    </>
  )
} 