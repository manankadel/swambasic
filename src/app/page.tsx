"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { GatewayAnimation } from '@/components/modules/GatewayAnimation';
import { WaitlistForm } from '@/components/modules/WaitlistForm';
import CountdownTimer from '@/components/modules/CountdownTimer';
import { InteractiveLiquidBackground } from '@/components/core/InteractiveLiquidBackground';
import { useSound } from '@/hooks/useSound';

// PasswordAccess component does not need to change
const PasswordAccess = () => {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const playHoverSound = useSound('/audio/hover.mp3', 0.3);
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => { e.preventDefault(); setIsLoading(true); setError(''); const response = await fetch('/api/access', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ password }), }); if (response.ok) { router.push('/home'); } else { const data = await response.json(); setError(data.error || 'Invalid access code.'); setIsLoading(false); } };
  return ( <div className="mt-8 flex flex-col items-center"> <form onSubmit={handleSubmit} className="flex items-center gap-4"> <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter Access Code" className="font-sans w-full max-w-[240px] bg-transparent border-b-2 border-foreground/50 focus:border-foreground text-center text-lg focus:outline-none transition-colors duration-300 disabled:opacity-50" disabled={isLoading}/> <button type="submit" disabled={isLoading} className="text-foreground/80 hover:text-white transition-colors disabled:opacity-50" onMouseEnter={playHoverSound}> <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg> </button> </form> {error && <p className="mt-2 text-sm text-red-400">{error}</p>} </div> );
};

export default function GatewayPage() {
  const [showContent, setShowContent] = useState(false);
  useEffect(() => { const timer = setTimeout(() => { setShowContent(true); }, 2500); return () => clearTimeout(timer); }, []);
  
  return (
    <>
      <InteractiveLiquidBackground /> 
      {/* 
        THE FINAL FIX IS HERE:
        - I am setting the height to 'calc(var(--app-height))'. This forces the `main` element to be EXACTLY the height of the visible screen area.
        - `h-screen` is removed because it is unreliable.
        - `overflow-hidden` remains to guarantee no scrolling.
      */}
      <main style={{ height: 'calc(var(--app-height, 100vh))' }} className="grid w-full place-items-center overflow-hidden p-4">
        
        <div className="flex w-full flex-col items-center">
            <motion.div layout transition={{ duration: 1.0, ease: 'easeInOut' }}>
              <GatewayAnimation />
            </motion.div>
            <AnimatePresence>
                {showContent && (
                <motion.div className="flex w-full max-w-sm flex-col items-center text-center" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1.0, ease: 'easeInOut', delay: 0.5 }}>
                    <p className="font-sans text-lg md:text-xl mt-6 mb-6 text-foreground/80 animate-shimmer-glow">Join the waitlist for exclusive access.</p>
                    <div className="mb-8"> <CountdownTimer /> </div>
                    <div className="w-full flex justify-center"> <WaitlistForm /> </div>
                    <div className="mt-8"> <PasswordAccess /> </div>
                </motion.div>
                )}
            </AnimatePresence>
        </div>
      </main>
    </>
  );
}