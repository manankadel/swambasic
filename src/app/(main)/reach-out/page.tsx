// src/app/(main)/reach-out/page.tsx
"use client";

import { motion, useMotionValue, useTransform } from 'framer-motion';
import { useState } from 'react';
import { FloatingParticlesBackground } from '@/components/core/FloatingParticlesBackground';

const containerVariants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.3 } } };
const itemVariants = { hidden: { y: 20, opacity: 0 }, visible: { y: 0, opacity: 1, transition: { duration: 0.8, ease: 'easeOut' } } };

export default function ReachOutPage() {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const rotateX = useTransform(mouseY, [-0.5, 0.5], ['7deg', '-7deg']);
  const rotateY = useTransform(mouseX, [-0.5, 0.5], ['-7deg', '7deg']);
  
  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    const { clientWidth, clientHeight } = event.currentTarget;
    const x = (event.clientX / clientWidth) - 0.5;
    const y = (event.clientY / clientHeight) - 0.5;
    mouseX.set(x);
    mouseY.set(y);
  };
  
  // --- THIS IS THE FIX: State management for the form ---
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [formStatus, setFormStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [statusMessage, setStatusMessage] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      setFormStatus('loading');
      setStatusMessage('');

      try {
          const response = await fetch('/api/contact', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(formData),
          });
          const result = await response.json();
          if (!response.ok) throw new Error(result.error || 'Something went wrong.');
          
          setFormStatus('success');
          setStatusMessage(result.message);
          setFormData({ name: '', email: '', message: '' }); // Clear form
      } catch (error: any) {
          setFormStatus('error');
          setStatusMessage(error.message);
      }
  };
  // --- END OF FIX ---

  return (
    <main className="relative min-h-screen w-full flex items-center justify-center overflow-hidden p-4 pt-32 pb-12" onMouseMove={handleMouseMove}>
      <FloatingParticlesBackground mousePosition={{ x: 0, y: 0 }} gyroData={{ x: 0, y: 0 }} />
      
      <motion.div className="w-full max-w-xl z-10" style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }} variants={containerVariants} initial="hidden" animate="visible">
        <div className="rounded-2xl border border-white/10 bg-black/20 backdrop-blur-2xl shadow-2xl shadow-black/50 p-8 md:p-12">
            <motion.h1 variants={itemVariants} className="font-display text-4xl md:text-5xl font-bold mb-2"> Let's Connect </motion.h1>
            <motion.p variants={itemVariants} className="font-sans text-base text-white/60 mb-8 max-w-md"> For inquiries, collaborations, or conversations. </motion.p>
            
            {/* --- THIS IS THE FIX: Form now uses the new logic --- */}
            <motion.form variants={itemVariants} className="space-y-6" onSubmit={handleSubmit}>
                <div className="flex flex-col">
                  <label htmlFor="name" className="font-sans text-xs uppercase tracking-widest text-white/50 mb-2">Name</label>
                  <input type="text" id="name" name="name" value={formData.name} onChange={handleInputChange} required className="bg-black/20 border border-white/10 rounded-lg p-3 font-sans focus:outline-none focus:border-white/50 transition-colors" />
                </div>
                <div className="flex flex-col">
                  <label htmlFor="email" className="font-sans text-xs uppercase tracking-widest text-white/50 mb-2">Email</label>
                  <input type="email" id="email" name="email" value={formData.email} onChange={handleInputChange} required className="bg-black/20 border border-white/10 rounded-lg p-3 font-sans focus:outline-none focus:border-white/50 transition-colors" />
                </div>
                <div className="flex flex-col">
                  <label htmlFor="message" className="font-sans text-xs uppercase tracking-widest text-white/50 mb-2">Message</label>
                  <textarea id="message" name="message" value={formData.message} onChange={handleInputChange} required rows={4} className="bg-black/20 border border-white/10 rounded-lg p-3 font-sans focus:outline-none focus:border-white/50 transition-colors resize-none"></textarea>
                </div>
                <div>
                  <button type="submit" disabled={formStatus === 'loading'} className="w-full mt-2 py-3 bg-white text-black font-sans font-bold uppercase tracking-widest rounded-full hover:bg-white/80 active:scale-95 transition-all disabled:opacity-50">
                    {formStatus === 'loading' ? 'Sending...' : 'Send'}
                  </button>
                </div>
            </motion.form>
             {statusMessage && (
                <p className={`mt-4 text-center text-sm ${formStatus === 'error' ? 'text-red-400' : 'text-green-400'}`}>
                    {statusMessage}
                </p>
            )}
        </div>
        <motion.div variants={itemVariants} className="flex justify-center gap-6 mt-8 text-center">
            <div> <h3 className="font-sans text-xs uppercase tracking-widest text-white/50">Inquiries</h3> <a href="mailto:contact@swambasic.com" className="font-sans text-sm text-white hover:underline">contact@swambasic.com</a> </div>
            <div> <h3 className="font-sans text-xs uppercase tracking-widest text-white/50">Support</h3> <a href="mailto:support@swambasic.com" className="font-sans text-sm text-white hover:underline">support@swambasic.com</a> </div>
        </motion.div>
      </motion.div>
    </main>
  );
}