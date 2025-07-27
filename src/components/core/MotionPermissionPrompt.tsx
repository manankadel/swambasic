// src/components/core/MotionPermissionPrompt.tsx
"use client";
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const MotionIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M10 3.2a9 9 0 1 0 10.8 10.8"/>
        <path d="M14 2.26A9.01 9.01 0 0 0 12 2a9 9 0 0 0-9.2 8.74"/>
        <path d="M22 12h-2.5"/><path d="M6 12H2"/><path d="M12 6V2"/><path d="M12 22v-2.5"/>
    </svg>
);

export const MotionPermissionPrompt = () => {
    // This state tracks if the entire prompt (button and hint) should be visible.
    const [shouldShowPrompt, setShouldShowPrompt] = useState(false);
    const [showHint, setShowHint] = useState(false);

    // THE FIX: The logic is now much simpler and more reliable.
    useEffect(() => {
        // We ONLY check if the permission function EXISTS. We do not call it.
        // This function only exists on iOS 13+ and some Android devices.
        if (typeof (DeviceOrientationEvent as any).requestPermission === 'function') {
            // If it exists, it's a device that might need permission. So we show the prompt.
            setShouldShowPrompt(true);
            setShowHint(true);
            // Set a timer to hide the pop-up hint after 4 seconds
            const timer = setTimeout(() => {
                setShowHint(false);
            }, 4000);
            return () => clearTimeout(timer); // Clean up the timer
        }
        // If the function doesn't exist, we do nothing, and the prompt remains hidden.
    }, []);

    // This function is called ONLY when the user physically taps the button.
    const requestPermission = () => {
        (DeviceOrientationEvent as any).requestPermission()
            .then((permissionState: string) => {
                if (permissionState === 'granted') {
                    // If they grant permission, hide the entire prompt.
                    setShouldShowPrompt(false);
                }
                // If they deny, the button remains visible for them to try again.
            })
            .catch(console.error);
    };

    // If the browser doesn't need a prompt, this will be false and we render nothing.
    if (!shouldShowPrompt) {
        return null;
    }

    return (
        <div className="fixed bottom-4 right-4 z-50 flex items-center gap-3">
            <AnimatePresence>
                {showHint && (
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        transition={{ duration: 0.5, ease: "easeInOut" }}
                        className="bg-white/10 backdrop-blur-md p-2 px-3 rounded-lg"
                    >
                        <p className="text-white text-xs font-sans">
                            Enable motion for an interactive experience.
                        </p>
                    </motion.div>
                )}
            </AnimatePresence>
            
            <button
                onClick={requestPermission}
                className="p-3 bg-white/10 text-white backdrop-blur-md rounded-full animate-pulse transition-all hover:bg-white/20"
                aria-label="Enable motion controls"
            >
                <MotionIcon />
            </button>
        </div>
    );
};