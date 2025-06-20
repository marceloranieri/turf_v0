"use client"

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/context/auth-context';
import { supabase } from '@/lib/supabase';
import { Eye, EyeOff } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { signIn } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { error } = await signIn(email, password);
      if (error) throw error;
      toast({ title: 'Success', description: 'Signed in successfully' });
      router.push('/');
    } catch (error: any) {
      toast({ title: 'Login failed', description: error.message, variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: { redirectTo: `${window.location.origin}/auth/callback` }
      });
      if (error) throw error;
    } catch (error: any) {
      toast({ title: 'Google sign-in failed', description: error.message, variant: 'destructive' });
    }
  };

  return (
    <div className="flex min-h-screen flex-col md:flex-row bg-black text-white">
      <div className="flex-1 flex items-center justify-center p-6 sm:p-12">
        <form onSubmit={handleSubmit} className="w-full max-w-md space-y-6">
          <div className="text-center">
            <img src="/logo.svg" alt="Turf Logo" className="h-8 mx-auto mb-4" />
            <h1 className="text-2xl font-bold mb-5">Login to your account</h1>
            <p className="text-zinc-400 text-sm mt-1.1">
              Fresh daily topics to spark your wit, with your kind of people.
            </p>
          </div>

          <Input
            type="email"
            name="email"
            placeholder="Email Address"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <div className="relative">
            <Input
              type={showPassword ? 'text' : 'password'}
              name="password"
              placeholder="Password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="pr-10"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-zinc-400 hover:text-white"
            >
              {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </button>
          </div>

          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={remember}
                onChange={() => setRemember(!remember)}
                className="accent-yellow-400"
              />
              Remember for 30 days
            </label>
            <a href="/reset-password" className="text-yellow-400 hover:underline">
              Forgot password
            </a>
          </div>

          <Button type="submit" className="w-full bg-yellow-400 text-black hover:bg-yellow-300" disabled={isLoading}>
            {isLoading ? 'Signing In…' : 'Sign In'}
          </Button>

          <Button type="button" variant="outline" className="w-full" onClick={handleGoogleSignIn}>
            Sign In with Google
          </Button>

          <p className="text-center text-sm text-zinc-400">
            Don't have an account?{' '}
            <a href="/register" className="text-yellow-400 hover:underline">
              Sign up
            </a>
          </p>
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
