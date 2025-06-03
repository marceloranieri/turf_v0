'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import clsx from 'clsx';
import { supabase } from '@/lib/supabase';

export default function ResetPasswordPage() {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  const passwordStrength = (pwd: string) => {
    if (pwd.length < 6) return 0;
    let strength = 0;
    if (/[a-z]/.test(pwd)) strength++;
    if (/[A-Z]/.test(pwd)) strength++;
    if (/[0-9]/.test(pwd)) strength++;
    if (/[^a-zA-Z0-9]/.test(pwd)) strength++;
    return strength;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast({ title: 'Error', description: 'Passwords do not match', variant: 'destructive' });
      return;
    }
    if (passwordStrength(newPassword) < 3) {
      toast({ title: 'Weak password', description: 'Try adding symbols, numbers, or uppercase letters.' });
      return;
    }

    const { error } = await supabase.auth.updateUser({ password: newPassword });

    if (error) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
      return;
    }

    toast({ title: 'Password updated!', description: 'You are now logged in.' });
    router.push('/chat');
  };

  const strength = passwordStrength(newPassword);

  return (
    <div className="flex min-h-screen flex-col md:flex-row bg-black text-white">
      <div className="flex-1 flex items-center justify-center p-6 sm:p-12">
        <form onSubmit={handleSubmit} className="w-full max-w-md space-y-6 text-center">
          <img src="/logo.svg" alt="Turf Logo" className="h-8 mx-auto mb-4" />
          <h1 className="text-3xl font-bold">Forgot Password?</h1>
          <p className="text-zinc-400 text-sm">Reset your password</p>

          <div className="relative">
            <Input
              type={showPassword ? 'text' : 'password'}
              placeholder="New Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
            <div className="h-1 mt-2 rounded bg-zinc-800 overflow-hidden">
              <div
                className={clsx('h-full transition-all', {
                  'bg-red-500 w-1/4': strength === 1,
                  'bg-orange-400 w-1/2': strength === 2,
                  'bg-yellow-400 w-3/4': strength === 3,
                  'bg-green-500 w-full': strength === 4,
                })}
              />
            </div>
          </div>

          <Input
            type={showPassword ? 'text' : 'password'}
            placeholder="Repeat your new password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />

          <Button type="submit" className="w-full bg-yellow-400 text-black hover:bg-yellow-300">
            Reset Password
          </Button>

          <div className="text-center">
            <a href="/login" className="flex items-center justify-center gap-1 text-sm text-zinc-400 hover:text-yellow-400">
              <ArrowLeft className="h-4 w-4" />
              Back to login Screen
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