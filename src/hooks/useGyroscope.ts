// src/hooks/useGyroscope.ts
"use client";
import { useState, useEffect, useCallback } from 'react';
import * as THREE from 'three';

// This hook will manage all gyroscope logic
export const useGyroscope = () => {
    const [needsPermission, setNeedsPermission] = useState(false);
    const [permissionGranted, setPermissionGranted] = useState(false);
    // This state will hold the SMOOTHED gyroscope data
    const [smoothedGyroData, setSmoothedGyroData] = useState({ x: 0, y: 0 });

    useEffect(() => {
        // Check if the permission API exists (for iOS 13+)
        if (typeof (DeviceOrientationEvent as any).requestPermission === 'function') {
            setNeedsPermission(true);
        }

        // This is the function that listens to the device's motion
        const handleDeviceOrientation = (event: DeviceOrientationEvent) => {
            const { beta, gamma } = event; // beta: front-back tilt, gamma: left-right
            if (beta !== null && gamma !== null) {
                // 1. Get the raw sensor data and normalize it
                const rawX = THREE.MathUtils.clamp(gamma / 90, -1, 1);
                const rawY = THREE.MathUtils.clamp(beta / 90, -1, 1);

                // --- THE FIX IS HERE ---
                // 2. Instead of setting the state directly with the raw data,
                // we smoothly interpolate ("lerp") the current value towards the new raw value.
                // This dampens any sudden jumps or "jerks". The `0.1` is the smoothing factor.
                setSmoothedGyroData(currentSmoothedValue => ({
                    x: THREE.MathUtils.lerp(currentSmoothedValue.x, rawX, 0.1),
                    y: THREE.MathUtils.lerp(currentSmoothedValue.y, rawY, 0.1)
                }));
            }
        };

        // We only start listening for motion AFTER permission has been granted
        if (permissionGranted) {
            window.addEventListener('deviceorientation', handleDeviceOrientation);
            return () => {
                window.removeEventListener('deviceorientation', handleDeviceOrientation);
            };
        }
    }, [permissionGranted]); // This effect re-runs if permission is granted

    // The function our button will call to ask for permission
    const requestPermission = useCallback(() => {
        if (typeof (DeviceOrientationEvent as any).requestPermission === 'function') {
            (DeviceOrientationEvent as any).requestPermission()
                .then((permissionState: string) => {
                    if (permissionState === 'granted') {
                        setPermissionGranted(true);
                    }
                })
                .catch(console.error);
        } else {
            // For Android or other devices that don't need a prompt
            setPermissionGranted(true);
        }
    }, []);

    // The hook provides all the necessary tools to the components
    return { needsPermission, requestPermission, smoothedGyroData };
};