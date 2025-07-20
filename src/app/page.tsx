"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { GatewayAnimation } from '@/components/modules/GatewayAnimation';
import { WaitlistForm } from '@/components/modules/WaitlistForm';
import CountdownTimer from '@/components/modules/CountdownTimer';
import { InteractiveLiquidBackground } from '@/components/core/InteractiveLiquidBackground';
import { useSound } from '@/hooks/useSound';

// The PasswordAccess component's code remains unchanged.
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
    const response = await fetch('/api/access', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ password }), });
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
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter Access Code" className="font-sans w-full max-w-[240px] bg-transparent border-b-2 border-foreground/50 focus:border-foreground text-center text-lg focus:outline-none transition-colors duration-300 disabled:opacity-50" disabled={isLoading}/>
        <button type="submit" disabled={isLoading} className="text-foreground/80 hover:text-white transition-colors disabled:opacity-50" onMouseEnter={playHoverSound}>
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
        </button>
      </form>
      {error && <p className="mt-2 text-sm text-red-400">{error}</p>}
    </div>
  );
};

// ==================================================================
// NEW ANIMATION VARIANTS FOR A SMOOTH, SEQUENCED TRANSITION
// ==================================================================

// Variant for the main container that holds EVERYTHING.
// This will smoothly animate the entire block upwards.
const mainContainerVariants = {
    initial: { y: 0 },
    contentVisible: { 
        y: -100, // Move the whole block 100px up
        transition: { duration: 1.0, ease: "easeInOut" }
    }
};

// Variant for the content (timer, forms) that fades in.
const contentVariants = {
    hidden: { opacity: 0 },
    visible: { 
        opacity: 1, 
        transition: { 
            duration: 1.0, 
            ease: "easeInOut",
            // THE FIX FOR THE OVERLAP: Delay this animation until the upward
            // movement is well underway.
            delay: 0.7 
        } 
    }
};


export default function GatewayPage() {
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowContent(true);
    }, 2500); // This delay is for the initial logo animation to finish.
    return () => clearTimeout(timer);
  }, []);
  
  return (
    <>
      <InteractiveLiquidBackground /> 
      <main className="flex min-h-screen w-full items-center justify-center p-4">
        
        {/* ================================================================== */}
        {/* THE DEFINITIVE FIX - USING VARIANTS INSTEAD OF THE 'layout' PROP */}
        {/* ================================================================== */}
        <motion.div 
            className="flex w-full max-w-2xl flex-col items-center"
            variants={mainContainerVariants}
            initial="initial"
            // When showContent becomes true, this animates the container to the "contentVisible" state (upwards).
            animate={showContent ? "contentVisible" : "initial"}
        >
            {/* REMOVED: The problematic motion.div with the 'layout' prop */}
            <GatewayAnimation />

            <AnimatePresence>
                {showContent && (
                <motion.div
                    className="flex w-full max-w-sm flex-col items-center text-center"
                    // These variants now control the fade-in with the crucial delay.
                    variants={contentVariants}
                    initial="hidden"
                    animate="visible"
                >
                    <p className="font-sans text-lg md:text-xl mt-8 mb-6 text-foreground/80 animate-shimmer-glow">Join the waitlist for exclusive access.</p>
                    <div className="mb-8"> <CountdownTimer /> </div>
                    <div className="w-full flex justify-center"> <WaitlistForm /> </div>
                    <div className="mt-8"> <PasswordAccess /> </div>
                </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
      </main>
    </>
  );
}