// src/app/(main)/login/page.tsx
"use client";
import { useState } from 'react';
import { AuthForm } from '@/components/modules/auth/AuthForm';
import { FloatingParticlesBackground } from '@/components/core/FloatingParticlesBackground';
import { MotionPermissionPrompt } from '@/components/core/MotionPermissionPrompt';
import { useGyroscope } from '@/hooks/useGyroscope'; // <-- Use our new hook here too

const LoginPage = () => {
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    // Get the smoothed gyro data from our hook
    const { smoothedGyroData } = useGyroscope();

    const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
        const { clientWidth, clientHeight } = event.currentTarget;
        const x = (event.clientX / clientWidth) * 2 - 1;
        const y = -((event.clientY / clientHeight) * 2 - 1);
        setMousePosition({ x, y });
    };

    return (
        <div 
            className="min-h-screen bg-black flex items-end justify-center overflow-hidden relative p-4 pb-20"
            onMouseMove={handleMouseMove}
        >
            {/* We now pass the SMOOTHED gyro data down to the particles */}
            <FloatingParticlesBackground 
                mousePosition={mousePosition} 
                gyroData={smoothedGyroData} 
            />
            
            <MotionPermissionPrompt />
            
            <main className="w-full z-20">
                <AuthForm />
            </main>
        </div>
    );
};

export default LoginPage;