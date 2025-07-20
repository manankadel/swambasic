"use client";

import { useState, useEffect } from 'react';

/**
 * A custom hook to track the state of a CSS media query.
 * @param query The media query string to watch (e.g., '(max-width: 767px)').
 * @returns A boolean indicating whether the media query matches.
 */
export const useMediaQuery = (query: string): boolean => {
  // Ensure this runs only on the client
  const [matches, setMatches] = useState<boolean>(
    typeof window !== 'undefined' ? window.matchMedia(query).matches : false
  );

  useEffect(() => {
    const mediaQueryList = window.matchMedia(query);
    const listener = (event: MediaQueryListEvent) => {
      setMatches(event.matches);
    };

    // Use the modern addEventListener/removeEventListener
    mediaQueryList.addEventListener('change', listener);
    
    // Check again on mount in case the initial state was stale
    setMatches(mediaQueryList.matches);

    return () => {
      mediaQueryList.removeEventListener('change', listener);
    };
  }, [query]);

  return matches;
};