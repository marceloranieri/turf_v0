'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft } from 'lucide-react';

export default function VerifyCodePage() {
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const { toast } = useToast();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (index: number, value: string) => {
    if (/[^0-9]/.test(value)) return;

    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);

    if (value && inputRefs.current[index + 1]) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === 'Backspace' && !code[index] && inputRefs.current[index - 1]) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const joined = code.join('');
    if (joined.length !== 6) {
      toast({ title: 'Invalid code', description: 'Please enter all 6 digits.', variant: 'destructive' });
      return;
    }

    setIsLoading(true);

    // Simulate successful validation
    setTimeout(() => {
      toast({ title: 'Code verified', description: 'You may now reset your password.' });
      router.push('/reset-password/new');
      setIsLoading(false);
    }, 800);
  };

  return (
    <div className="flex min-h-screen flex-col md:flex-row bg-black text-white">
      {/* Left panel */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-12">
        <form onSubmit={handleSubmit} className="w-full max-w-md space-y-6 text-center">
          <img src="/logo.svg" alt="Turf Logo" className="h-8 mx-auto mb-4" />

          <h1 className="text-2xl font-bold mb-5">Enter the code</h1>
          <p className="text-zinc-400 text-sm mt-1.1">Unlock Your Account: Enter the Code below.</p>

          <div className="flex justify-center gap-2 mt-4" role="group" aria-label="Verification code">
            {code.map((char, index) => (
              <input
                key={index}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={char}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                ref={(el) => (inputRefs.current[index] = el)}
                className="w-12 h-14 text-center text-2xl rounded-md bg-zinc-800 text-yellow-400 focus:outline-none focus:ring-2 focus:ring-yellow-300"
                aria-label={`Digit ${index + 1} of verification code`}
              />
            ))}
          </div>

          <Button
            type="submit"
            className="w-full bg-yellow-400 text-black hover:bg-yellow-300 mt-4"
            disabled={isLoading}
          >
            {isLoading ? 'Verifying…' : 'Verify Email'}
          </Button>

          <div className="text-center">
            <a href="/login" className="flex items-center justify-center gap-1 text-sm text-zinc-400 hover:text-yellow-400">
              <ArrowLeft className="h-4 w-4" />
              Back to login Screen
            </a>
          </div>
        </form>
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