// src/components/core/MotionPermissionPrompt.tsx
"use client";
import { useState, useEffect } from 'react';

const MotionIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M10 3.2a9 9 0 1 0 10.8 10.8"/>
        <path d="M14 2.26A9.01 9.01 0 0 0 12 2a9 9 0 0 0-9.2 8.74"/>
        <path d="M22 12h-2.5"/><path d="M6 12H2"/><path d="M12 6V2"/><path d="M12 22v-2.5"/>
    </svg>
);

export const MotionPermissionPrompt = () => {
    // This state tracks if the button should be visible at all.
    const [shouldShowPrompt, setShouldShowPrompt] = useState(false);

    // This effect runs ONCE to see if the browser REQUIRES a permission prompt.
    useEffect(() => {
        // This function only exists on iOS 13+ devices.
        if (typeof (DeviceOrientationEvent as any).requestPermission === 'function') {
            setShouldShowPrompt(true);
        }
    }, []);

    // This function is called ONLY when the user taps the button.
    const requestPermission = () => {
        (DeviceOrientationEvent as any).requestPermission()
            .then((permissionState: string) => {
                if (permissionState === 'granted') {
                    // Once permission is granted, we hide the button forever.
                    setShouldShowPrompt(false);
                }
            })
            .catch(console.error); // If they deny, the button remains.
    };

    // If the browser doesn't need a prompt (e.g., Android, Desktop), render nothing.
    if (!shouldShowPrompt) {
        return null;
    }

    return (
        <button
            onClick={requestPermission}
            className="fixed bottom-4 right-4 z-50 p-3 bg-white/10 text-white backdrop-blur-md rounded-full animate-pulse transition-all hover:bg-white/20"
            aria-label="Enable motion controls"
        >
            <MotionIcon />
        </button>
    );
};