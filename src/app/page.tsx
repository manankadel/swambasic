"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { GatewayAnimation } from '@/components/modules/GatewayAnimation';
import { WaitlistForm } from '@/components/modules/WaitlistForm';
import CountdownTimer from '@/components/modules/CountdownTimer';
import { InteractiveLiquidBackground } from '@/components/core/InteractiveLiquidBackground';
import { useSound } from '@/hooks/useSound';

const PasswordAccess = () => {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // UPDATED: Only initialize the hover sound here.
  const playHoverSound = useSound('/audio/hover.mp3', 0.3);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // REMOVED: playClickSound() is removed.
    setIsLoading(true);
    setError('');

    // ... rest of the function is the same
    const response = await fetch('/api/access', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    });
    if (response.ok) {
      router.push('/home');
    } else {
      const data = await response.json();
      setError(data.error || 'Invalid access code.');
      setIsLoading(false);
    }
  };

  return (
    <div className="mt-8 flex flex-col items-center">
      <form onSubmit={handleSubmit} className="flex items-center gap-4">
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          // REMOVED: onKeyDown is removed. The global handler takes care of it.
          placeholder="Enter Access Code"
          className="font-sans w-64 bg-transparent border-b-2 border-foreground/50 focus:border-foreground text-center text-lg focus:outline-none transition-colors duration-300 disabled:opacity-50"
          disabled={isLoading}
        />
        <button 
          type="submit" 
          disabled={isLoading} 
          className="text-foreground/80 hover:text-white transition-colors disabled:opacity-50"
          onMouseEnter={playHoverSound}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="5" y1="12" x2="19" y2="12"></line>
            <polyline points="12 5 19 12 12 19"></polyline>
          </svg>
        </button>
      </form>
      {error && <p className="mt-2 text-sm text-red-400">{error}</p>}
    </div>
  );
};

// ... The rest of the GatewayPage component remains unchanged ...
export default function GatewayPage() {
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowContent(true);
    }, 2500);
    return () => clearTimeout(timer);
  }, []);
  
  return (
    <>
      <InteractiveLiquidBackground /> 
      <main className="flex min-h-screen flex-col items-center justify-center relative z-10 overflow-hidden">
        <div className="p-6 flex flex-col items-center justify-center">
            <div className="absolute top-1/2 -translate-y-[150px] sm:-translate-y-40">
                <GatewayAnimation />
            </div>
            <AnimatePresence>
                {showContent && (
                <motion.div
                    className="flex flex-col items-center text-center w-full absolute top-1/2"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, ease: 'easeInOut' }}
                >
                    <p className="font-sans mb-6 text-foreground/80">Join the waitlist for exclusive access.</p>
                    <div className="mb-8"> <CountdownTimer /> </div>
                    <div className="w-full flex justify-center"> <WaitlistForm /> </div>
                    <div> <PasswordAccess /> </div>
                </motion.div>
                )}
            </AnimatePresence>
        </div>
      </main>
    </>
  );
}