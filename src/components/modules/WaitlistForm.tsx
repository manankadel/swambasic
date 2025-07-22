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

    try {
      const response = await fetch('/api/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, phone }),
      });

      // DEBUG: Log response details
      console.log('Response status:', response.status);
      console.log('Response ok:', response.ok);
      console.log('Response headers:', response.headers);

      // Check if response has content and is JSON
      let data = null;
      const contentType = response.headers.get('content-type');
      
      console.log('Content-Type:', contentType); // DEBUG
      
      if (contentType && contentType.includes('application/json')) {
        const text = await response.text();
        console.log('Response text:', text); // DEBUG
        
        if (text) {
          try {
            data = JSON.parse(text);
            console.log('Parsed data:', data); // DEBUG
          } catch (parseError) {
            console.error('Failed to parse JSON:', parseError);
            data = { error: 'Invalid response from server' };
          }
        }
      } else {
        // If it's not JSON, let's see what we got
        const text = await response.text();
        console.log('Non-JSON response text:', text);
      }

      console.log('Final data object:', data); // DEBUG

      if (response.ok) {
        console.log('Response was OK, setting success'); // DEBUG
        setStatus('success');
        setMessage("You're on the list. We'll be in touch.");
        setEmail('');
        setPhone('');
      } else {
        console.log('Response was NOT OK, setting error'); // DEBUG
        setStatus('error');
        setMessage(data?.error || `Server error: ${response.status}`);
      }
    } catch (error) {
      console.error('Network error:', error);
      setStatus('error');
      setMessage('Network error. Please try again.');
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