'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

export default function CheckEmailPage() {
  const router = useRouter();

  return (
    <div className="flex min-h-screen flex-col md:flex-row bg-black text-white">
      {/* Left section */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-md space-y-6 text-center">
          <img src="/logo.svg" alt="Turf Logo" className="h-8 mx-auto mb-4" />

          <h1 className="text-3xl font-bold">Check your email</h1>
          <p className="text-zinc-400 text-sm">
            We sent a verification link to your email (check spam if needed).
          </p>

          <Button
            className="w-full bg-yellow-400 text-black hover:bg-yellow-300"
            onClick={() => router.push('/verify-code')}
          >
            Enter the code Manually
          </Button>

          <div className="text-center">
            <a
              href="/login"
              className="flex items-center justify-center gap-1 text-sm text-zinc-400 hover:text-yellow-400"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to login Screen
            </a>
          </div>
        </div>
      </div>

      {/* Right section with image + message */}
      <div className="hidden md:flex flex-1 items-center justify-center p-8 relative">
        <video
          className="absolute inset-0 w-full h-full object-cover rounded-xl"
          src="/turf-auth-loop.mp4"
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          poster="/turf-signup-visual.jpg"
          onError={(e) => console.error('Video loading error:', e)}
        />
        <div className="relative z-10 bg-zinc-900/80 rounded-xl p-6 text-left shadow-lg max-w-sm">
          <p className="text-sm text-zinc-300 mb-2">Join Your Crowd</p>
          <p className="text-lg font-semibold">
            Where shared interests spark fresh chats — and new friends, daily!
          </p>
        </div>
      </div>
    </div>
  );
} 