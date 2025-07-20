"use client";

import { useState, useRef } from 'react';

// Minimalistic SVG Icons for the controls
const SoundOnIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
    <path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path>
    <path d="M19.07 4.93a10 10 0 0 1 0 14.14"></path>
  </svg>
);

const SoundOffIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
    <line x1="23" y1="9" x2="17" y2="15"></line>
    <line x1="17" y1="9" x2="23" y2="15"></line>
  </svg>
);


export const BackgroundMusicPlayer = () => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  // NEW: Add a ref to track if it's the first time the user plays the audio.
  const isFirstPlay = useRef(true);

  // This function toggles the music play/pause state
  const toggleAudio = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        // ==================================================================
        // THE FIX: Check if this is the first play action.
        // ==================================================================
        if (isFirstPlay.current) {
          // If it is, set the starting time to 20 seconds.
          audioRef.current.currentTime = 20;
          // Then, set the flag to false so this logic doesn't run again.
          isFirstPlay.current = false;
        }
        
        // Play returns a promise, we'll catch potential browser errors
        audioRef.current.play().catch(e => console.error("Audio play failed:", e));
      }
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <>
      {/* The actual HTML audio element, hidden from view. It loops the music file. */}
      <audio 
        ref={audioRef} 
        src="/audio/background-music.mp3" 
        loop 
        preload="auto" 
      />
      
      {/* This is the control button fixed to the bottom-right of the screen */}
      <button
        onClick={toggleAudio}
        className="fixed bottom-6 right-6 z-50 text-white/50 hover:text-white transition-colors duration-300"
        aria-label={isPlaying ? "Pause music" : "Play music"}
      >
        {isPlaying ? <SoundOnIcon /> : <SoundOffIcon />}
      </button>
    </>
  );
};