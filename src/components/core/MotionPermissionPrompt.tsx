// src/components/core/MotionPermissionPrompt.tsx
"use client";
import { useState, useEffect } from 'react';

// A simple SVG icon for tilting a phone
const MotionIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M10 3.2a9 9 0 1 0 10.8 10.8"/>
        <path d="M14 2.26A9.01 9.01 0 0 0 12 2a9 9 0 0 0-9.2 8.74"/>
        <path d="M22 12h-2.5"/>
        <path d="M6 12H2"/>
        <path d="M12 6V2"/>
        <path d="M12 22v-2.5"/>
    </svg>
);

export const MotionPermissionPrompt = () => {
    const [needsPermission, setNeedsPermission] = useState(false);
    const [isPulsing, setIsPulsing] = useState(true);

    // This effect runs once on mount to check if permission is needed
    useEffect(() => {
        if (typeof (DeviceOrientationEvent as any).requestPermission === 'function') {
            // Check the current permission state without prompting the user
            (DeviceOrientationEvent as any).requestPermission()
                .then((state: string) => {
                    if (state === 'prompt') {
                        setNeedsPermission(true); // Permission is needed
                    }
                }).catch(() => {/* Ignore errors */});
        }
    }, []);

    const requestPermission = () => {
        (DeviceOrientationEvent as any).requestPermission()
            .then((permissionState: string) => {
                if (permissionState === 'granted') {
                    setNeedsPermission(false); // Permission granted, hide the button
                }
            })
            .catch(console.error);
        setIsPulsing(false); // Stop pulsing after the first click
    };

    if (!needsPermission) {
        return null; // Don't render anything if permission isn't needed or is already granted
    }

    return (
        <button
            onClick={requestPermission}
            className={`fixed bottom-4 right-4 z-50 p-3 bg-white/10 text-white backdrop-blur-md rounded-full transition-all hover:bg-white/20 ${isPulsing ? 'animate-pulse' : ''}`}
            aria-label="Enable motion controls"
        >
            <MotionIcon />
        </button>
    );
};