"use client";

import { useEffect } from 'react';

/**
 * This component solves the "dynamic viewport" problem on mobile browsers.
 * It measures the actual window.innerHeight and sets it as a CSS variable (`--app-height`).
 * This ensures our layout is always based on the REAL visible screen space.
 */
export const AppHeightProvider = ({ children }: { children: React.ReactNode }) => {
  useEffect(() => {
    const setAppHeight = () => {
      // Get the actual inner height of the window
      const appHeight = `${window.innerHeight}px`;
      // Set it as a CSS variable on the root HTML element
      document.documentElement.style.setProperty('--app-height', appHeight);
    };

    // Set the height when the component mounts
    setAppHeight();

    // Also set it whenever the window is resized
    window.addEventListener('resize', setAppHeight);

    // Clean up the event listener when the component unmounts
    return () => {
      window.removeEventListener('resize', setAppHeight);
    };
  }, []);

  return <>{children}</>;
};