"use client";
import { useState } from 'react';
import { motion } from 'framer-motion';
import { useSound } from '@/hooks/useSound';

export const WaitlistForm = () => {
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');
  const playHoverSound = useSound('/audio/hover.mp3', 0.3);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus('loading');
    setMessage('');

    const response = await fetch('/api/waitlist', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, phone }),
    });

    const data = await response.json();

    if (response.ok) {
      setStatus('success');
      setMessage("You're on the list. We'll be in touch.");
      setEmail('');
      setPhone('');
    } else {
      setStatus('error');
      setMessage(data.error || 'An unexpected error occurred.');
    }
  };

  return (
    <div className="w-full max-w-sm mt-4 text-center">
      {/* The main form is a flex column with a gap */}
      <form onSubmit={handleSubmit} className="flex flex-col items-stretch gap-4">
        
        {/* ================================================================== */}
        {/* NEW LAYOUT: A horizontal flex container for the inputs.          */}
        {/* ================================================================== */}
        <div className='flex flex-row gap-4'>
            {/* Input 1: Email (shorter width) */}
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              required
              // UPDATED: rounded-3xl and adjusted placeholder text
              className="h-11 w-1/2 flex-grow px-4 bg-white/5 border border-white/20 backdrop-blur-sm rounded-3xl focus:outline-none focus:border-white/50 transition-all duration-300 placeholder-foreground/50 font-sans"
              disabled={status === 'loading' || status === 'success'}
            />
            {/* Input 2: Phone (shorter width) */}
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Phone"
              // UPDATED: rounded-3xl and adjusted placeholder text
              className="h-11 w-1/2 flex-grow px-4 bg-white/5 border border-white/20 backdrop-blur-sm rounded-3xl focus:outline-none focus:border-white/50 transition-all duration-300 placeholder-foreground/50 font-sans"
              disabled={status === 'loading' || status === 'success'}
            />
        </div>

        {/* The button is now a direct child of the flex column, placing it below */}
        <motion.button
          type="submit"
          disabled={status === 'loading' || status === 'success'}
          // UPDATED: rounded-3xl
          className="h-11 px-6 bg-white/10 border border-white/20 backdrop-blur-sm rounded-3xl font-sans font-semibold text-white transition-all duration-300 disabled:opacity-50 hover:border-white/40 hover:shadow-[0_0_20px_rgba(255,255,255,0.15)]"
          whileTap={{ scale: status !== 'loading' ? 0.95 : 1 }}
          onMouseEnter={playHoverSound}
        >
          {status === 'loading' ? '...' : 'Join The Waitlist'}
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