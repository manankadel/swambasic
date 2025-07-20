"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { GatewayAnimation } from '@/components/modules/GatewayAnimation';
import { WaitlistForm } from '@/components/modules/WaitlistForm';
import CountdownTimer from '@/components/modules/CountdownTimer';
import { InteractiveLiquidBackground } from '@/components/core/InteractiveLiquidBackground';
import { useSound } from '@/hooks/useSound';

// PasswordAccess component remains unchanged
const PasswordAccess = () => {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const playHoverSound = useSound('/audio/hover.mp3', 0.3);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

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
          placeholder="Enter Access Code"
          className="font-sans w-full max-w-[240px] bg-transparent border-b-2 border-foreground/50 focus:border-foreground text-center text-lg focus:outline-none transition-colors duration-300 disabled:opacity-50"
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

      {/* ================================================================== */}
      {/* UNIVERSAL LAYOUT FIX:                                              */}
      {/* - min-h-screen: Ensures the container is at least full height.     */}
      {/* - flex items-center: Centers the content block horizontally.       */}
      {/* - py-20: Adds ample top/bottom padding.                            */}
      {/* - REMOVED: justify-center and overflow-hidden.                     */}
      {/* This combination ensures content is centered on tall screens and   */}
      {/* becomes scrollable on short screens without being cut off.         */}
      {/* ================================================================== */}
      <main className="flex min-h-screen flex-col items-center relative z-10 p-4 py-20">

        <div className="relative flex flex-col items-center justify-center">
            <motion.div layout transition={{ duration: 1.0, ease: 'easeInOut' }}>
              <GatewayAnimation />
            </motion.div>

            <AnimatePresence>
                {showContent && (
                <motion.div
                    className="flex flex-col items-center text-center w-full mt-6 md:mt-8"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, ease: 'easeInOut' }}
                >
                    <p className="font-display text-md md:text-xl mb-6 text-foreground/80 animate-shimmer-glow">Join the waitlist for exclusive access.</p>
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