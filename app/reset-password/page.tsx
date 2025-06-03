'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase';
import { ArrowLeft } from 'lucide-react';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password/new`
      });
      if (error) throw error;

      toast({ title: 'Email sent', description: 'Check your inbox to reset your password.' });
      router.push('/check-email');
    } catch (error: any) {
      toast({ title: 'Reset failed', description: error.message || 'Something went wrong.', variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col md:flex-row bg-black text-white">
      <div className="flex-1 flex items-center justify-center p-6 sm:p-12">
        <form onSubmit={handleSubmit} className="w-full max-w-md space-y-6">
          <div className="text-center">
            <img src="/logo.svg" alt="Turf Logo" className="h-8 mx-auto mb-4" />
            <h1 className="text-3xl font-bold mb-2">Forgot Password?</h1>
            <p className="text-zinc-400 text-sm mt-1.1">
              Enter the email address associated with your Turf account.
            </p>
          </div>

          <Input
            type="email"
            placeholder="Email Address"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <Button
            type="submit"
            className="w-full bg-yellow-400 text-black hover:bg-yellow-300"
            disabled={isLoading}
          >
            {isLoading ? 'Sending...' : 'Reset Password'}
          </Button>

          <div className="text-center">
            <a href="/login" className="flex items-center justify-center gap-1 text-sm text-zinc-400 hover:text-yellow-400">
              <ArrowLeft className="h-4 w-4" /> Back to login Screen
            </a>
          </div>
        </form>
      </div>

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
        <div className="absolute top-10 right-10 bg-zinc-900/80 text-white rounded-2xl px-6 py-4 flex items-center justify-between w-[min(90vw,600px)] shadow-xl backdrop-blur-sm z-10 gap-4">
          <div>
            <p className="text-base font-semibold leading-snug">Wake your brain: rediscover social with Turf.</p>
            <p className="text-sm text-zinc-300 mt-1">Join daily debates on favorite topics. Pick a side. Meet your kind.</p>
          </div>
          <img
            src="/Avatars_Turf.webp"
            alt="People avatars"
            className="w-24 h-8 object-contain"
          />
        </div>
      </div>
    </div>
  );
} 