'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

export default function CreateNewPasswordPage() {
  const router = useRouter()
  const supabase = createClientComponentClient()
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    const { data, error } = await supabase.auth.updateUser({ password })
    if (error) {
      setError(error.message)
      setLoading(false)
    } else {
      router.push('/auth/password-changed')
    }
  }

  return (
    <>
      <h2 className="text-2xl font-bold text-center mb-6">Set New Password</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          className="w-full px-4 py-2 bg-zinc-800 border border-zinc-600 rounded text-white"
          placeholder="New password"
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
        />
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-violet-600 hover:bg-violet-700 text-white py-2 rounded"
        >
          {loading ? 'Updating...' : 'Update Password'}
        </button>
      </form>
    </>
  )
} 