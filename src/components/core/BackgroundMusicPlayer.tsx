"use client";

import { useState, useRef, useEffect, useCallback, useMemo } from 'react';

// ==================================================================
// OPTIMIZED ICON COMPONENTS
// ==================================================================
const SoundOnIcon = () => (
  <svg 
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
    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
    <path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path>
    <path d="M19.07 4.93a10 10 0 0 1 0 14.14"></path>
  </svg>
);

const PlayIcon = () => (
  <svg 
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
    <polygon points="5 3 19 12 5 21 5 3"></polygon>
  </svg>
);

// ==================================================================
// PERFORMANCE CONSTANTS
// ==================================================================
const AUDIO_CONFIG = {
  START_TIME: 93,
  PRELOAD: 'auto',
  VOLUME: 0.7, // Slightly lower volume for better UX
  FADE_IN_DURATION: 1000, // 1 second fade in
};

const BUTTON_STYLES: React.CSSProperties = {
  position: 'fixed',
  bottom: '24px',
  right: '24px',
  zIndex: 50,
  padding: '12px',
  borderRadius: '50%',
  backgroundColor: 'rgba(0, 0, 0, 0.3)',
  backdropFilter: 'blur(8px)',
  border: 'none',
  cursor: 'pointer',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  willChange: 'transform, opacity',
  contain: 'layout style paint',
};

// ==================================================================
// OPTIMIZED BACKGROUND MUSIC PLAYER
// ==================================================================
export const BackgroundMusicPlayer = () => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const fadeIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const userInteractedRef = useRef(false);
  const retryTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  // ==================================================================
  // OPTIMIZED FADE IN FUNCTION
  // ==================================================================
  const fadeInAudio = useCallback((audio: HTMLAudioElement) => {
    audio.volume = 0;
    const steps = 20;
    const volumeStep = AUDIO_CONFIG.VOLUME / steps;
    const timeStep = AUDIO_CONFIG.FADE_IN_DURATION / steps;
    
    let currentStep = 0;
    
    if (fadeIntervalRef.current) {
      clearInterval(fadeIntervalRef.current);
    }
    
    fadeIntervalRef.current = setInterval(() => {
      currentStep++;
      audio.volume = Math.min(volumeStep * currentStep, AUDIO_CONFIG.VOLUME);
      
      if (currentStep >= steps) {
        if (fadeIntervalRef.current) {
          clearInterval(fadeIntervalRef.current);
          fadeIntervalRef.current = null;
        }
      }
    }, timeStep);
  }, []);

  // ==================================================================
  // OPTIMIZED AUTOPLAY FUNCTION
  // ==================================================================
  const attemptAutoplay = useCallback(async () => {
    const audio = audioRef.current;
    if (!audio || hasError) return;

    try {
      // Set start time
      audio.currentTime = AUDIO_CONFIG.START_TIME;
      
      // Multiple autoplay strategies for maximum compatibility
      const playPromise = audio.play();
      
      if (playPromise !== undefined) {
        await playPromise;
        setIsPlaying(true);
        fadeInAudio(audio);
      }
    } catch (error) {
      console.warn("Autoplay prevented:", error);
      setIsPlaying(false);
      
      // Retry autoplay on next user interaction
      const handleFirstInteraction = () => {
        if (!userInteractedRef.current) {
          userInteractedRef.current = true;
          attemptAutoplay();
          document.removeEventListener('click', handleFirstInteraction);
          document.removeEventListener('touchstart', handleFirstInteraction);
          document.removeEventListener('keydown', handleFirstInteraction);
        }
      };
      
      document.addEventListener('click', handleFirstInteraction, { passive: true });
      document.addEventListener('touchstart', handleFirstInteraction, { passive: true });
      document.addEventListener('keydown', handleFirstInteraction, { passive: true });
    }
  }, [fadeInAudio, hasError]);

  // ==================================================================
  // OPTIMIZED PLAY/PAUSE TOGGLE
  // ==================================================================
  const togglePlayPause = useCallback(async () => {
    const audio = audioRef.current;
    if (!audio || hasError) return;

    try {
      if (isPlaying) {
        audio.pause();
        setIsPlaying(false);
        if (fadeIntervalRef.current) {
          clearInterval(fadeIntervalRef.current);
          fadeIntervalRef.current = null;
        }
      } else {
        // Set start time if at beginning
        if (audio.currentTime < AUDIO_CONFIG.START_TIME) {
          audio.currentTime = AUDIO_CONFIG.START_TIME;
        }
        
        await audio.play();
        setIsPlaying(true);
        fadeInAudio(audio);
      }
      
      userInteractedRef.current = true;
    } catch (error) {
      console.error("Error toggling audio:", error);
      setHasError(true);
    }
  }, [isPlaying, fadeInAudio, hasError]);

  // ==================================================================
  // OPTIMIZED EFFECTS
  // ==================================================================
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    // Audio event handlers
    const handleCanPlayThrough = () => {
      setIsLoaded(true);
      if (!userInteractedRef.current) {
        // Small delay to ensure audio is fully ready
        retryTimeoutRef.current = setTimeout(attemptAutoplay, 100);
      }
    };

    const handleError = () => {
      console.error("Audio loading error");
      setHasError(true);
      setIsLoaded(false);
    };

    const handleEnded = () => {
      // Reset to start time when song ends (for looping)
      audio.currentTime = AUDIO_CONFIG.START_TIME;
    };

    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);

    // Add event listeners
    audio.addEventListener('canplaythrough', handleCanPlayThrough);
    audio.addEventListener('error', handleError);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('play', handlePlay);
    audio.addEventListener('pause', handlePause);

    // Preload audio
    audio.load();

    // Cleanup
    return () => {
      if (fadeIntervalRef.current) {
        clearInterval(fadeIntervalRef.current);
      }
      if (retryTimeoutRef.current) {
        clearTimeout(retryTimeoutRef.current);
      }
      
      audio.removeEventListener('canplaythrough', handleCanPlayThrough);
      audio.removeEventListener('error', handleError);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('play', handlePlay);
      audio.removeEventListener('pause', handlePause);
    };
  }, [attemptAutoplay]);

  // ==================================================================
  // MEMOIZED COMPONENTS
  // ==================================================================
  const buttonIcon = useMemo(() => {
    if (hasError) return <PlayIcon />;
    return isPlaying ? <SoundOnIcon /> : <PlayIcon />;
  }, [isPlaying, hasError]);

  const buttonAriaLabel = useMemo(() => {
    if (hasError) return "Audio unavailable";
    return isPlaying ? "Pause music" : "Play music";
  }, [isPlaying, hasError]);

  // Don't render if audio failed to load
  if (hasError) {
    return null;
  }

  return (
    <>
      <audio 
        ref={audioRef}
        src="/audio/background-music.mp3"
        loop
        preload={AUDIO_CONFIG.PRELOAD}
        style={{ display: 'none' }}
      />
      
      <button
        onClick={togglePlayPause}
        style={BUTTON_STYLES}
        className="text-white/70 hover:text-white hover:scale-110 active:scale-95 shadow-lg backdrop-blur-sm"
        aria-label={buttonAriaLabel}
        disabled={!isLoaded && !hasError}
        type="button"
      >
        {buttonIcon}
      </button>
    </>
  );
};