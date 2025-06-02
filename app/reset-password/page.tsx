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
            <p className="text-zinc-400 text-sm">
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