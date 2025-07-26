// src/app/(main)/login/page.tsx

"use client";
import { AuthForm } from '@/components/modules/auth/AuthForm';
import { FloatingParticlesBackground } from '@/components/core/FloatingParticlesBackground';
import { motion } from 'framer-motion';

const LoginPage = () => {
    return (
        <div className="min-h-screen bg-black flex items-center justify-center overflow-hidden relative p-4">
            
            <FloatingParticlesBackground />

            {/* This layer with the text will now let the mouse pass through it */}
            <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
                <p className="font-display text-[15vw] lg:text-[12vw] text-white/10 font-black uppercase whitespace-nowrap">
                    
                </p>
            </div>
            
            {/* This layer with the form will ALSO let the mouse pass through... */}
            <main className="w-full z-20 pointer-events-none">
                <AuthForm />
            </main>
            
        </div>
    );
};

export default LoginPage;