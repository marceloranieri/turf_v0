"use client"

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/context/auth-context';
import { supabase } from '@/lib/supabase';
import { Eye, EyeOff } from 'lucide-react';

export default function RegisterPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { signUp } = useAuth();

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });

  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!termsAccepted) {
      toast({ title: 'You must accept the Terms of Service', variant: 'destructive' });
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast({ title: 'Error', description: 'Passwords do not match', variant: 'destructive' });
      return;
    }

    setIsLoading(true);
    const { email, password } = formData;

    try {
      const { error } = await signUp(email, password);
      if (error) throw error;
      toast({ title: 'Success', description: 'Check your email to confirm your account' });
      router.push('/check-email');
    } catch (error: any) {
      toast({ title: 'Error', description: error.message || 'Could not register', variant: 'destructive' });
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
      toast({ title: 'Error', description: 'Google sign-in failed', variant: 'destructive' });
    }
  };

  return (
    <div className="flex min-h-screen flex-col md:flex-row bg-black text-white">
      {/* Left: Form */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-12">
        <form onSubmit={handleSubmit} className="w-full max-w-md space-y-6">
          <div className="text-center">
            <img src="/logo.svg" alt="Turf Logo" className="h-8 mx-auto mb-4" />
            <h1 className="text-3xl font-bold">Create an account</h1>
            <p className="text-zinc-400 text-sm mt-1.1">
              Fresh daily topics to spark your wit, with your kind of people.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <Input name="firstName" placeholder="First Name" required onChange={handleChange} />
            <Input name="lastName" placeholder="Last Name" required onChange={handleChange} />
          </div>

          <Input type="email" name="email" placeholder="Email Address" required onChange={handleChange} />
          <Input type="tel" name="phone" placeholder="Phone Number" onChange={handleChange} />

          <div className="relative">
            <Input
              type={showPassword ? 'text' : 'password'}
              name="password"
              placeholder="Password"
              required
              onChange={handleChange}
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

          <Input
            type={showPassword ? 'text' : 'password'}
            name="confirmPassword"
            placeholder="Confirm Password"
            required
            onChange={handleChange}
          />

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="terms"
              className="accent-yellow-400"
              checked={termsAccepted}
              onChange={() => setTermsAccepted(prev => !prev)}
            />
            <label htmlFor="terms" className="text-sm text-zinc-300">
              I agree to the <a href="#" className="text-yellow-400 hover:underline">Terms of Service</a>
            </label>
          </div>

          <Button type="submit" className="w-full bg-yellow-400 text-black hover:bg-yellow-300" disabled={isLoading}>
            {isLoading ? 'Signing Up…' : 'Sign Up'}
          </Button>

          <Button type="button" variant="outline" className="w-full" onClick={handleGoogleSignIn}>
            Sign In with Google
          </Button>

          <p className="text-center text-sm text-zinc-400">
            Do you have an account? <a href="/login" className="text-yellow-400 hover:underline">Login</a>
          </p>

          <div className="text-center text-xs text-zinc-500 mt-6">
            <a href="#" className="hover:underline">Terms of Service</a> · <a href="#" className="hover:underline">Privacy Policy</a>
          </div>
        </form>
      </div>

      {/* Right: Image + quote */}
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
