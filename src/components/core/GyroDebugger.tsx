// src/components/core/GyroDebugger.tsx
"use client";
import { useState, useEffect } from 'react';

export const GyroDebugger = () => {
    const [permissionGranted, setPermissionGranted] = useState(false);
    const [gyroData, setGyroData] = useState<{ alpha: number | null, beta: number | null, gamma: number | null }>({ alpha: null, beta: null, gamma: null });

    const requestPermission = () => {
        // This is the function that triggers the permission prompt on iOS
        if (typeof (DeviceOrientationEvent as any).requestPermission === 'function') {
            (DeviceOrientationEvent as any).requestPermission()
                .then((permissionState: string) => {
                    if (permissionState === 'granted') {
                        setPermissionGranted(true);
                    }
                })
                .catch(console.error);
        } else {
            // For Android or devices that don't need explicit permission
            setPermissionGranted(true);
        }
    };

    useEffect(() => {
        if (!permissionGranted) return;

        const handleDeviceOrientation = (event: DeviceOrientationEvent) => {
            setGyroData({ alpha: event.alpha, beta: event.beta, gamma: event.gamma });
        };
        
        window.addEventListener('deviceorientation', handleDeviceOrientation);
        return () => {
            window.removeEventListener('deviceorientation', handleDeviceOrientation);
        };
    }, [permissionGranted]);

    return (
        <div className="fixed bottom-2 left-2 z-50 bg-black/50 text-white text-[10px] p-2 rounded font-mono">
            {!permissionGranted && (
                <button onClick={requestPermission} className="bg-blue-500 px-2 py-1 rounded">
                    Enable Motion
                </button>
            )}
            <div>Status: {permissionGranted ? 'Granted' : 'Needed'}</div>
            <div>beta (x-tilt): {gyroData.beta?.toFixed(2) ?? 'null'}</div>
            <div>gamma (y-tilt): {gyroData.gamma?.toFixed(2) ?? 'null'}</div>
        </div>
    );
}