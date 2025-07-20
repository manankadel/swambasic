"use client";

import { useState, useRef, useEffect } from 'react';

// The existing SoundOnIcon for when music is playing
const SoundOnIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
    <path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path>
    <path d="M19.07 4.93a10 10 0 0 1 0 14.14"></path>
  </svg>
);

// NEW: A proper "Play" icon for when the music is paused.
const PlayIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="5 3 19 12 5 21 5 3"></polygon>
    </svg>
);


export const BackgroundMusicPlayer = () => {
  const audioRef = useRef<HTMLAudioElement>(null);
  // The state now tracks if the music is actively playing. It starts as false.
  const [isPlaying, setIsPlaying] = useState(false);

  // This effect runs once to attempt autoplay.
  useEffect(() => {
    const audio = audioRef.current;
    if (audio) {
      // Set the start time to 20 seconds.
      audio.currentTime = 20;

      // Attempt to play the audio. This returns a promise.
      const playPromise = audio.play();

      if (playPromise !== undefined) {
        playPromise.then(_ => {
          // Autoplay started successfully!
          setIsPlaying(true);
        })
        .catch(error => {
          // Autoplay was prevented.
          // We don't need to do anything here, the UI will show the 'Play' icon.
          console.warn("Audio autoplay was prevented by the browser:", error);
          setIsPlaying(false);
        });
      }
    }
  }, []); // The empty array ensures this runs only once.

  // This function is now a simple Play/Pause toggle.
  const togglePlayPause = () => {
    const audio = audioRef.current;
    if (audio) {
        if (isPlaying) {
            audio.pause();
        } else {
            audio.play();
        }
        // Update our state to the new playing status.
        setIsPlaying(!isPlaying);
    }
  };

  return (
    <>
      {/* The audio element no longer has autoplay or muted props. We control it all with code. */}
      <audio 
        ref={audioRef} 
        src="/audio/background-music.mp3" 
        loop 
        preload="auto" 
      />
      
      <button
        onClick={togglePlayPause}
        className="fixed bottom-6 right-6 z-50 text-white/50 hover:text-white transition-colors duration-300"
        aria-label={isPlaying ? "Pause music" : "Play music"}
      >
        {/* If music is playing, show the SoundOn icon. Otherwise, show the Play icon. */}
        {isPlaying ? <SoundOnIcon /> : <PlayIcon />}
      </button>
    </>
  );
};