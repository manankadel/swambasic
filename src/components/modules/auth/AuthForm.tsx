// src/components/modules/auth/AuthForm.tsx

"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';

interface FormInputProps { id: string; label: string; type?: string; value: string; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; required?: boolean; disabled?: boolean; }
const FormInput = ({ id, label, type = "text", value, onChange, required = true, disabled = false }: FormInputProps) => (<div className="relative"><label htmlFor={id} className="font-sans text-xs uppercase tracking-wider text-white/60">{label}</label><input type={type} id={id} name={id} value={value} onChange={onChange} required={required} disabled={disabled} autoComplete={type === 'password' ? 'current-password' : 'email'} className="w-full mt-2 px-1 py-2 bg-transparent text-white border-b-2 border-white/20 focus:outline-none focus:border-white transition-colors font-sans disabled:opacity-50" /></div>);

export const AuthForm = () => {
    const router = useRouter();
    const [formType, setFormType] = useState<'login' | 'register'>('login');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [loginEmail, setLoginEmail] = useState(''); const [loginPassword, setLoginPassword] = useState('');
    const [regFirstName, setRegFirstName] = useState(''); const [regLastName, setRegLastName] = useState('');
    const [regEmail, setRegEmail] = useState(''); const [regPassword, setRegPassword] = useState('');

    const handleApiSubmit = async (endpoint: string, body: Record<string, unknown>) => { setIsLoading(true); setError(''); try { const response = await fetch(endpoint, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) }); const data = await response.json(); if (!response.ok) throw new Error(data.error || 'Something went wrong'); router.push('/account'); router.refresh(); } catch (err: any) { setError(err.message); } finally { setIsLoading(false); } };
    const handleLoginSubmit = (e: React.FormEvent) => { e.preventDefault(); handleApiSubmit('/api/auth/login', { email: loginEmail, password: loginPassword }); };
    const handleRegisterSubmit = (e: React.FormEvent) => { e.preventDefault(); handleApiSubmit('/api/auth/register', { firstName: regFirstName, lastName: regLastName, email: regEmail, password: regPassword }); };
    const toggleFormType = (type: 'login' | 'register') => { if(!isLoading) { setFormType(type); setError(''); } };

    return (
        // ...but this div re-enables pointer events for itself and all its children.
        <div className="w-[80%] max-w-sm md:max-w-md mx-auto flex flex-col items-center pointer-events-auto">
            <div className="w-full h-[450px] md:h-[520px]" style={{ perspective: '1200px' }}>
                <motion.div
                    className="relative w-full h-full"
                    animate={{ rotateY: formType === 'login' ? 0 : 180 }}
                    transition={{ type: 'spring', stiffness: 200, damping: 25 }}
                    style={{ transformStyle: 'preserve-3d' }}
                >
                    {/* FRONT OF THE CARD (LOGIN) */}
                    <div className="absolute w-full h-full rounded-2xl border border-white/15 bg-white/5 backdrop-blur-xl shadow-2xl shadow-black/40" style={{ backfaceVisibility: 'hidden' }}>
                        <form onSubmit={handleLoginSubmit} className="relative z-10 w-full h-full p-10 flex flex-col justify-center space-y-10">
                            <h2 className="font-display text-2xl md:text-4xl font-bold text-center">Sign In</h2>
                            <FormInput id="login-email" label="Email" type="email" value={loginEmail} onChange={(e) => setLoginEmail(e.target.value)} disabled={isLoading} />
                            <FormInput id="login-password" label="Password" type="password" value={loginPassword} onChange={(e) => setLoginPassword(e.target.value)} disabled={isLoading} />
                            <button type="submit" disabled={isLoading} className="w-full mt-4 px-8 py-3 bg-white text-black font-sans font-bold uppercase tracking-widest hover:bg-white/80 transition-colors disabled:opacity-50">{isLoading && formType === 'login' ? '...' : 'Sign In'}</button>
                            <p className="text-center text-xs text-white/50">Don't have an account? <button type='button' onClick={() => toggleFormType('register')} className="font-bold hover:text-white transition">Create one</button>.</p>
                        </form>
                    </div>

                    {/* BACK OF THE CARD (REGISTER) */}
                    <div className="absolute w-full h-full rounded-2xl border border-white/15 bg-white/5 backdrop-blur-xl shadow-2xl shadow-black/40" style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}>
                        <form onSubmit={handleRegisterSubmit} className="relative z-10 w-full h-full p-10 flex flex-col justify-center space-y-6">
                            <h2 className="font-display text-2xl md:text-4xl font-bold text-center">Join Us</h2>
                            <div className="grid grid-cols-2 gap-x-6">
                                <FormInput id="reg-firstName" label="First Name" value={regFirstName} onChange={(e) => setRegFirstName(e.target.value)} disabled={isLoading} />
                                <FormInput id="reg-lastName" label="Last Name" value={regLastName} onChange={(e) => setRegLastName(e.target.value)} disabled={isLoading} />
                            </div>
                            <FormInput id="reg-email" label="Email" type="email" value={regEmail} onChange={(e) => setRegEmail(e.target.value)} disabled={isLoading} />
                            <FormInput id="reg-password" label="Password" type="password" value={regPassword} onChange={(e) => setRegPassword(e.target.value)} disabled={isLoading} />
                            <button type="submit" disabled={isLoading} className="w-full mt-2 px-8 py-3 bg-white text-black font-sans font-bold uppercase tracking-widest hover:bg-white/80 transition-colors disabled:opacity-50">{isLoading && formType === 'register' ? '...' : 'Join'}</button>
                            <p className="text-center text-xs text-white/50">Already have an account? <button type='button' onClick={() => toggleFormType('login')} className="font-bold hover:text-white transition">Sign in</button>.</p>
                        </form>
                    </div>
                </motion.div>
            </div>
             
             <div className="h-6 mt-6 text-center">
                {error && <p className="text-sm text-red-400" role="alert">{error}</p>}
            </div>
        </div>
    );
};