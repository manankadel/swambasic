"use client";

import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { GatewayAnimation } from '@/components/modules/GatewayAnimation';
import { WaitlistForm } from '@/components/modules/WaitlistForm';
import CountdownTimer from '@/components/modules/CountdownTimer';
import { InteractiveLiquidBackground } from '@/components/core/InteractiveLiquidBackground';
import { useSound } from '@/hooks/useSound';

// ==================================================================
// PERFORMANCE CONSTANTS
// ==================================================================
const ANIMATION_CONFIG = {
  CONTENT_DELAY: 2500,
  MOTION_DURATION: 1.0,
  MOTION_EASE: 'easeInOut',
  FADE_DELAY: 0.5,
} as const;

const MOTION_VARIANTS = {
  content: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    transition: { 
      duration: ANIMATION_CONFIG.MOTION_DURATION, 
      ease: ANIMATION_CONFIG.MOTION_EASE, 
      delay: ANIMATION_CONFIG.FADE_DELAY 
    }
  },
  layout: {
    transition: { 
      duration: ANIMATION_CONFIG.MOTION_DURATION, 
      ease: ANIMATION_CONFIG.MOTION_EASE 
    }
  }
} as const;

const STYLES = {
  main: {
    height: 'calc(var(--app-height, 100vh))',
    contain: 'layout style paint',
    willChange: 'auto'
  },
  input: {
    contain: 'layout style'
  },
  button: {
    contain: 'layout style',
    willChange: 'color, opacity'
  }
} as const;

// ==================================================================
// OPTIMIZED ARROW ICON COMPONENT
// ==================================================================
const ArrowIcon = () => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width="24" 
    height="24" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round"
    style={{ pointerEvents: 'none' }}
  >
    <line x1="5" y1="12" x2="19" y2="12"></line>
    <polyline points="12 5 19 12 12 19"></polyline>
  </svg>
);

// ==================================================================
// OPTIMIZED PASSWORD ACCESS COMPONENT
// ==================================================================
const PasswordAccess = () => {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const abortControllerRef = useRef<AbortController | null>(null);
  
  // Optimized sound hook with lazy loading
  const playHoverSound = useSound('/audio/hover.mp3', 0.3);

  // Memoized input change handler
  const handlePasswordChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    if (error) setError(''); // Clear error on new input
  }, [error]);

  // Optimized submit handler with abort controller
  const handleSubmit = useCallback(async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!password.trim() || isLoading) return;
    
    // Cancel any pending request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    
    setIsLoading(true);
    setError('');
    
    // Create new abort controller
    abortControllerRef.current = new AbortController();
    
    try {
      const response = await fetch('/api/access', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
        signal: abortControllerRef.current.signal,
      });

      if (response.ok) {
        // Use replace for better performance
        router.replace('/home');
      } else {
        const data = await response.json();
        setError(data.error || 'Invalid access code.');
      }
    } catch (err: any) {
      if (err.name !== 'AbortError') {
        setError('Connection error. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  }, [password, isLoading, router]);

  // Optimized hover handler
  const handleMouseEnter = useCallback(() => {
    if (!isLoading) playHoverSound();
  }, [playHoverSound, isLoading]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  // Memoized form elements
  const formContent = useMemo(() => (
    <form onSubmit={handleSubmit} className="flex items-center gap-4">
      <input
        type="password"
        value={password}
        onChange={handlePasswordChange}
        placeholder="Enter Access Code"
        className="font-sans w-full max-w-[240px] bg-transparent border-b-2 border-foreground/50 focus:border-foreground text-center text-lg focus:outline-none transition-colors duration-300 disabled:opacity-50"
        disabled={isLoading}
        autoComplete="current-password"
        style={STYLES.input}
      />
      <button
        type="submit"
        disabled={isLoading || !password.trim()}
        className="text-foreground/80 hover:text-white transition-colors disabled:opacity-50"
        onMouseEnter={handleMouseEnter}
        style={STYLES.button}
        aria-label="Submit access code"
      >
        <ArrowIcon />
      </button>
    </form>
  ), [password, isLoading, handleSubmit, handlePasswordChange, handleMouseEnter]);

  return (
    <div className="mt-8 flex flex-col items-center">
      {formContent}
      {error && (
        <p className="mt-2 text-sm text-red-400" role="alert">
          {error}
        </p>
      )}
    </div>
  );
};

// ==================================================================
// OPTIMIZED MAIN GATEWAY PAGE COMPONENT
// ==================================================================
export default function GatewayPage() {
  const [showContent, setShowContent] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Optimized content reveal effect
  useEffect(() => {
    timeoutRef.current = setTimeout(() => {
      setShowContent(true);
    }, ANIMATION_CONFIG.CONTENT_DELAY);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  // Memoized content section
  const contentSection = useMemo(() => (
    <AnimatePresence mode="wait">
      {showContent && (
        <motion.div
          className="flex w-full max-w-sm flex-col items-center text-center"
          {...MOTION_VARIANTS.content}
        >
          <p className="font-sans text-md md:text-xl mt-6 mb-6 text-foreground/80 animate-shimmer-glow">
            Join the waitlist for exclusive access.
          </p>
          
          <div className="mb-6">
            <CountdownTimer />
          </div>
          
          <div className="w-full flex justify-center">
            <WaitlistForm />
          </div>
          
          <div className="mt-8">
            <PasswordAccess />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  ), [showContent]);

  // Memoized main layout
  const mainLayout = useMemo(() => (
    <main 
      style={STYLES.main}
      className="grid w-full place-items-center overflow-hidden p-4 pt-0"
    >
      <div className="flex w-full flex-col items-center">
        <motion.div layout {...MOTION_VARIANTS.layout}>
          <GatewayAnimation />
        </motion.div>
        {contentSection}
      </div>
    </main>
  ), [contentSection]);

  return (
    <>
      <InteractiveLiquidBackground />
      {mainLayout}
    </>
  );
}