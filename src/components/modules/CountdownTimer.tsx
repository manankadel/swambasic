"use client";
import { useState, useEffect } from 'react';

const CountdownUnit = ({ value, label }: { value: string, label: string }) => (
    <div className="flex flex-col items-center">
        <span className="font-display font-black text-4xl md:text-6xl tracking-tighter">
            {value}
        </span>
        <span className="font-sans text-xs text-foreground/50 tracking-widest mt-1">
            {label}
        </span>
    </div>
);

const CountdownTimer = () => {
  // SET YOUR LAUNCH DATE HERE
  const launchDate = new Date("2025-07-21T12:00:00Z").getTime();
  const [timeLeft, setTimeLeft] = useState({ d: 0, h: 0, m: 0, s: 0 });

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date().getTime();
      const distance = launchDate - now;

      if (distance < 0) {
        clearInterval(interval);
        return;
      }

      setTimeLeft({
        d: Math.floor(distance / (1000 * 60 * 60 * 24)),
        h: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        m: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        s: Math.floor((distance % (1000 * 60)) / 1000),
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [launchDate]);

  const pad = (num: number) => num.toString().padStart(2, '0');

  return (
    <div className="flex items-start gap-4 md:gap-8">
        <CountdownUnit value={pad(timeLeft.d)} label="DAYS" />
        <span className="font-display font-black text-4xl md:text-6xl text-foreground/50">:</span>
        <CountdownUnit value={pad(timeLeft.h)} label="HOURS" />
        <span className="font-display font-black text-4xl md:text-6xl text-foreground/50">:</span>
        <CountdownUnit value={pad(timeLeft.m)} label="MINS" />
        <span className="font-display font-black text-4xl md:text-6xl text-foreground/50">:</span>
        <CountdownUnit value={pad(timeLeft.s)} label="SECS" />
    </div>
  );
};

export default CountdownTimer;