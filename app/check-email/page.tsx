import Link from 'next/link'

export default function CheckEmailPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-black p-4">
      <div className="max-w-md w-full space-y-8 text-center">
        <div>
          <h2 className="text-3xl font-bold text-white">Check your email</h2>
          <p className="mt-2 text-zinc-400">
            We sent you a verification link. Please check your email to continue.
          </p>
        </div>
        <div className="mt-8">
          <Link
            href="/login"
            className="text-violet-400 hover:text-violet-300 transition-colors"
          >
            Return to sign in
          </Link>
        </div>
      </div>
    </div>
  )
} 