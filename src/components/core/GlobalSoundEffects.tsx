"use client";

import { useEffect, useRef } from 'react';

/**
 * This component attaches global event listeners to play sounds
 * for universal actions like clicking and typing anywhere on the page.
 * 
 * LATENCY FIX: Audio objects are now pre-loaded and reused via useRef.
 * On each event, we rewind the audio to the start (`currentTime = 0`) and play,
 * eliminating the delay of creating a new Audio() object each time.
 */
export const GlobalSoundEffects = () => {
  const clickSoundRef = useRef<HTMLAudioElement | null>(null);
  const typingSoundRef = useRef<HTMLAudioElement | null>(null);

  // Effect to pre-load the audio objects on component mount
  useEffect(() => {
    // Check if window is defined to ensure this runs only on the client
    if (typeof window !== 'undefined') {
        clickSoundRef.current = new Audio('/audio/typing.wav');
      clickSoundRef.current.volume = 0.5;

      typingSoundRef.current = new Audio('/audio/typing.wav');
      typingSoundRef.current.volume = 0.4;
    }
  }, []); // Empty dependency array ensures this runs only once

  useEffect(() => {
    const handleMouseDown = () => {
      if (clickSoundRef.current) {
        clickSoundRef.current.currentTime = 0.1; // Rewind to start
        clickSoundRef.current.play().catch(e => console.error("Could not play click sound:", e));
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      // Add null check for event.key before accessing its properties
      if (!event.key) return;
      
      const isTypingKey = event.key.length === 1 || event.key === 'Backspace';
      if (isTypingKey && typingSoundRef.current) {
        typingSoundRef.current.currentTime = 0; // Rewind to start
        typingSoundRef.current.play().catch(e => console.error("Could not play typing sound:", e));
      }
    };

    document.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []); // We don't need dependencies as the refs are stable

  return null;
};