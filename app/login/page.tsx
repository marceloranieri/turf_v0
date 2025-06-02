"use client"

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { error } = await signIn(email, password);
      if (error) throw error;
      toast({ title: 'Success', description: 'Signed in successfully' });
      router.push('/');
    } catch (error) {
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
    } catch (error) {
      toast({ title: 'Google sign-in failed', description: error.message, variant: 'destructive' });
    }
  };

  return (
    <div className="flex min-h-screen flex-col md:flex-row bg-black text-white">
      <div className="flex-1 flex items-center justify-center p-6 sm:p-12">
        <form onSubmit={handleSubmit} className="w-full max-w-md space-y-6">
          <div className="text-center">
            <img src="/logo.svg" alt="Turf Logo" className="h-8 mx-auto mb-4" />
            <h1 className="text-3xl font-bold">Login to your account</h1>
            <p className="text-zinc-400 text-sm mt-1">
              Rediscover social with Turf: Fresh daily topics to spark your wit and meet your kind of people.
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
            <a href="/reset-password" className="text-yellow-400 hover:underline">Forgot password</a>
          </div>

          <Button type="submit" className="w-full bg-yellow-400 text-black hover:bg-yellow-300" disabled={isLoading}>
            {isLoading ? 'Signing In…' : 'Sign In'}
          </Button>

          <Button type="button" variant="outline" className="w-full" onClick={handleGoogleSignIn}>
            Sign In with Google
          </Button>

          <p className="text-center text-sm text-zinc-400">
            Don't have an account? <a href="/register" className="text-yellow-400 hover:underline">Sign up</a>
          </p>
        </form>
      </div>

      <div
        className="hidden md:flex flex-1 bg-cover bg-center items-center justify-center p-8"
        style={{ backgroundImage: 'url("/turf-signup-visual.jpg")' }}
      >
        <div className="bg-zinc-900/80 rounded-xl p-6 text-left shadow-lg max-w-sm">
          <p className="text-sm text-zinc-300 mb-2">Join Your Crowd</p>
          <p className="text-lg font-semibold">
            Where shared interests spark fresh chats — and new friends, daily!
          </p>
        </div>
      </div>
    </div>
  );
}
