"use client";
import { useState, useEffect, useCallback } from 'react';
import * as THREE from 'three';

// This hook will manage all gyroscope logic
export const useGyroscope = () => {
    const [needsPermission, setNeedsPermission] = useState(false);
    const [permissionGranted, setPermissionGranted] = useState(false);
    // This state holds the SMOOTHED gyroscope data
    const [smoothedGyroData, setSmoothedGyroData] = useState({ x: 0, y: 0 });

    useEffect(() => {
        // Check if the permission API exists (for iOS 13+)
        if (typeof (DeviceOrientationEvent as any).requestPermission === 'function') {
            setNeedsPermission(true);
        }

        const handleDeviceOrientation = (event: DeviceOrientationEvent) => {
            const { beta, gamma } = event; // beta: front-back tilt, gamma: left-right
            if (beta !== null && gamma !== null) {
                // We get the raw sensor data here
                const rawX = THREE.MathUtils.clamp(gamma / 90, -1, 1);
                const rawY = THREE.MathUtils.clamp(beta / 90, -1, 1);

                // THE FIX FOR "SUDDEN JUMP":
                // We don't set the state directly. We smoothly interpolate the
                // current value towards the new raw value. This dampens any jerks.
                setSmoothedGyroData(current => ({
                    x: THREE.MathUtils.lerp(current.x, rawX, 0.1),
                    y: THREE.MathUtils.lerp(current.y, rawY, 0.1)
                }));
            }
        };

        if (permissionGranted) {
            window.addEventListener('deviceorientation', handleDeviceOrientation);
            return () => {
                window.removeEventListener('deviceorientation', handleDeviceOrientation);
            };
        }
    }, [permissionGranted]);

    // The function to request permission, which will be called by our button
    const requestPermission = useCallback(() => {
        (DeviceOrientationEvent as any).requestPermission()
            .then((permissionState: string) => {
                if (permissionState === 'granted') {
                    setPermissionGranted(true);
                }
            })
            .catch(console.error);
    }, []);

    // The hook returns the data and the tools needed by the components
    return { needsPermission, requestPermission, smoothedGyroData };
};