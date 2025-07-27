"use client";
import { useGyroscope } from '@/hooks/useGyroscope'; // <-- Use our new hook

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
    // Get the tools from our custom hook
    const { needsPermission, requestPermission } = useGyroscope();

    // If the device doesn't need permission, this will be false.
    if (!needsPermission) {
        return null;
    }

    return (
        <button
            onClick={requestPermission}
            className="fixed bottom-4 left-4 z-50 p-3 bg-white/10 text-white backdrop-blur-md rounded-full animate-pulse transition-all hover:bg-white/20"
            aria-label="Enable motion controls"
        >
            <MotionIcon />
        </button>
    );
};