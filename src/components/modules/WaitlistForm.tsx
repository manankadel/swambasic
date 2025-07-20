"use client";
import { useState } from 'react';
import { motion } from 'framer-motion';
import { useSound } from '@/hooks/useSound';

export const WaitlistForm = () => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  // UPDATED: Only initialize the hover sound. Click and typing are global now.
  const playHoverSound = useSound('/audio/hover.mp3');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // REMOVED: playClickSound() is removed from here. The global handler does it.
    setStatus('loading');
    setMessage('');

    // ... rest of the function is the same
    const response = await fetch('/api/waitlist', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });
    const data = await response.json();
    if (response.ok) {
      setStatus('success');
      setMessage("You're on the list. We'll be in touch.");
      setEmail('');
    } else {
      setStatus('error');
      setMessage(data.error || 'An unexpected error occurred.');
    }
  };

  return (
    <div className="w-full max-w-sm mt-4 text-center">
      <form onSubmit={handleSubmit} className="flex items-stretch gap-4">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          required
          // REMOVED: No onKeyDown needed here, it's handled globally
          className="h-14 flex-grow px-4 bg-white/5 border border-white/20 backdrop-blur-sm rounded-3xl focus:outline-none focus:border-white/50 transition-all duration-300 placeholder-foreground/50 font-sans"
          disabled={status === 'loading' || status === 'success'}
        />
        <motion.button
          type="submit"
          disabled={status === 'loading' || status === 'success'}
          className="h-14 px-6 bg-white/10 border border-white/20 backdrop-blur-sm rounded-3xl font-sans font-semibold text-white transition-all duration-300 disabled:opacity-50 hover:border-white/40 hover:shadow-[0_0_20px_rgba(255,255,255,0.15)]"
          whileTap={{ scale: status !== 'loading' ? 0.95 : 1 }}
          onMouseEnter={playHoverSound}
        >
          {status === 'loading' ? '...' : 'Waitlist'}
        </motion.button>
      </form>
      
      {message && (
        <p className={`mt-3 text-sm ${status === 'error' ? 'text-red-400' : 'text-green-400'}`}>
          {message}
        </p>
      )}
    </div>
  );
};