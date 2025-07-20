"use client";

import { useCallback } from 'react';

/**
 * A custom hook to play a sound effect.
 * @param soundPath The path to the sound file from the `public` directory.
 * @param volume The volume to play the sound at (0.0 to 1.0). Defaults to 0.5.
 * @returns A `play` function to trigger the sound.
 */
export const useSound = (soundPath: string, volume: number = 0.5) => {
  const play = useCallback(() => {
    // We create a new Audio object on each play call.
    // This is simple and effective for short, non-overlapping SFX.
    const audio = new Audio(soundPath);
    audio.volume = volume;
    audio.play().catch(e => {
      // Audio playback can sometimes be blocked by the browser, so we log errors silently.
      console.error(`Could not play sound ${soundPath}:`, e);
    });
  }, [soundPath, volume]);

  return play;
};