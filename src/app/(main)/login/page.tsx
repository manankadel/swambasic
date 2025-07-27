// src/app/(main)/login/page.tsx

"use client";
import { useState } from 'react';
import { AuthForm } from '@/components/modules/auth/AuthForm';
import { FloatingParticlesBackground } from '@/components/core/FloatingParticlesBackground';

const LoginPage = () => {
    // 1. Create a state to hold the normalized mouse position (-1 to 1)
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

    // 2. This function will run whenever the mouse moves over the main container
    const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
        const { clientWidth, clientHeight } = event.currentTarget;
        const x = (event.clientX / clientWidth) * 2 - 1;
        const y = -((event.clientY / clientHeight) * 2 - 1);
        setMousePosition({ x, y });
    };

    return (
        // 3. The onMouseMove handler is attached here, on the top-level div.
        // It will now capture mouse movement across the ENTIRE page.
        <div 
            className="min-h-screen bg-black flex items-end justify-center overflow-hidden relative p-4 pb-20"
            onMouseMove={handleMouseMove}
        >
            
            {/* 4. We pass the mouse position state down as a prop */}
            <FloatingParticlesBackground mousePosition={mousePosition} />
            
            {/* THE TEXT IS NOW REMOVED */}
            
            <main className="w-full z-20">
                <AuthForm />
            </main>
            
        </div>
    );
};

export default LoginPage;