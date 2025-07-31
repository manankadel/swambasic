"use client";

import React, { useState, useEffect, useRef } from 'react';

interface TerminalEntry {
  type: 'command' | 'output' | 'easter' | 'secret';
  text: string;
}

const TerminalFooter = () => {
  const [currentLine, setCurrentLine] = useState(0);
  const [displayText, setDisplayText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showCursor, setShowCursor] = useState(true);
  const [terminalHistory, setTerminalHistory] = useState<TerminalEntry[]>([]);
  const [isHovered, setIsHovered] = useState(false);
  const [clickCount, setClickCount] = useState(0);
  const [isMounted, setIsMounted] = useState(false);
  const containerRef = useRef<HTMLElement>(null);

  // --- THIS IS THE FIX: The command list is now longer and more varied ---
  const commands = [
    { command: "> initiate --protocol=swambasic", output: "protocol loaded. welcome.", delay: 2000 },
    { command: "> cat /etc/philosophy", output: "form. function. perspective.", delay: 2500 },
    { command: "> query --identity", output: "we are not for everyone. and we never will be.", delay: 3000 },
    { command: "> get_var --collection", output: "vol. 1 // sins of saints", delay: 2800 },
    { command: "> social --connect --platform=instagram", output: "now streaming consciousness: @swambasic", delay: 3200 },
    { command: "> echo 'the concept'", output: "luxury is a mindset, not a price tag.", delay: 3000 },
    { command: "> run diagnostic --aesthetic", output: "result: [OK] minimal. textural. intentional.", delay: 2800 },
    { command: "> read /dev/thoughts --filter=genz", output: "iykyk. the vibe is the brand.", delay: 2500 },
    { command: "> get_directive --current", output: "reject the ordinary.", delay: 3000 },
    { command: "> stream --updates", output: "new artifacts are being forged in the void...", delay: 3500 },
    { command: "> cat /logs/saints.log", output: "ERROR: no saints found.", delay: 2800 },
    { command: "> cat /logs/sins.log", output: "log file too large to display.", delay: 2800 },
    { command: "> follow --us", output: "find us in the static: @swambasic", delay: 3200 },
    { command: "> exit --code=0", output: "disconnecting... but the signal remains.", delay: 3000 }
  ];

  const easterEggs = [
    "> this is not a footer.",
    "> where does the minimalism end?",
    "> ask a better question.",
    "> find what you are not looking for.",
    "> iykyk"
  ];

  const secrets = [
    "// form is an illusion.",
    "/* function is a construct. */", 
    "// perspective is the only constant.",
    "/* the void is staring back. */",
    "// did you see it?"
  ];
  // --- END OF THE FIX ---

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    const typeCommand = async (text: string, isCommand = true) => {
      setIsTyping(true);
      setDisplayText('');
      for (let i = 0; i <= text.length; i++) {
        setDisplayText(text.slice(0, i));
        await new Promise(resolve => setTimeout(resolve, isCommand ? 40 : 25));
      }
      setIsTyping(false);
      return new Promise(resolve => setTimeout(resolve, 800));
    };

    const runCommand = async () => {
      const cmd = commands[currentLine];
      await typeCommand(cmd.command, true);
      setTerminalHistory(prev => [...prev, { type: 'command', text: cmd.command }]);
      await new Promise(resolve => setTimeout(resolve, 200));
      await typeCommand(cmd.output, false);
      setTerminalHistory(prev => [...prev, { type: 'output', text: cmd.output }]);
      await new Promise(resolve => setTimeout(resolve, cmd.delay));
      setCurrentLine(prev => (prev + 1) % commands.length);
    };

    const interval = setTimeout(runCommand, 1000);
    return () => clearTimeout(interval);
  }, [currentLine, commands]);

  useEffect(() => {
    const cursorInterval = setInterval(() => {
      setShowCursor(prev => !prev);
    }, 500);
    return () => clearInterval(cursorInterval);
  }, []);

  const handleClick = () => {
    setClickCount(prev => prev + 1);
    const randomEgg = easterEggs[Math.floor(Math.random() * easterEggs.length)];
    const randomSecret = secrets[Math.floor(Math.random() * secrets.length)];
    if (clickCount % 3 === 2) {
      setTerminalHistory(prev => [...prev, { type: 'secret', text: randomSecret }]);
    } else {
      setTerminalHistory(prev => [...prev, { type: 'easter', text: randomEgg }]);
    }
  };

  const formatTime = () => {
    if (!isMounted) return "00:00:00";
    const now = new Date();
    return now.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' });
  };

  return (
    <footer 
      ref={containerRef}
      className="bg-black text-green-400 font-mono text-sm relative border-t border-green-900/50 cursor-pointer overflow-hidden"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleClick}
    >
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-green-400/5 to-transparent animate-pulse"></div>
        <div className="absolute inset-0 bg-[linear-gradient(transparent_98%,rgba(34,197,94,0.1)_100%)] bg-[length:100%_4px]"></div>
      </div>
      <div className={`absolute inset-0 transition-opacity duration-1000 ${isHovered ? 'bg-green-400/5' : 'bg-green-400/2'}`}></div>
      <div className="relative z-10 p-6 max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-4 text-xs text-green-500/70">
          <div className="flex items-center space-x-4">
            <div className="flex space-x-2">
              <div className="w-3 h-3 rounded-full bg-red-500/60"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-500/60"></div>
              <div className="w-3 h-3 rounded-full bg-green-500/60"></div>
            </div>
            <span>swambasic_consciousness_interface</span>
          </div>
          <div className="flex items-center space-x-4">
            <span>{formatTime()}</span>
            <span className={`transition-opacity ${isHovered ? 'opacity-100' : 'opacity-50'}`}>◉ STREAMING</span>
          </div>
        </div>
        <div className="space-y-1 min-h-[200px] max-h-[300px] overflow-y-auto">
          {terminalHistory.slice(-10).map((entry, index) => (
            <div key={index} className={`transition-all duration-300 ${ entry.type === 'command' ? 'text-green-400' : entry.type === 'output' ? 'text-green-300/80 ml-2' : entry.type === 'easter' ? 'text-cyan-400' : 'text-gray-500 italic' }`}>
              {entry.text}
            </div>
          ))}
          <div className="flex items-center">
            <span className="text-green-400">{displayText}</span>
            <span className={`ml-1 ${showCursor && !isTyping ? 'opacity-100' : 'opacity-0'} transition-opacity`}>█</span>
          </div>
        </div>
        <div className="mt-6 pt-4 border-t border-green-900/30 flex justify-between items-center text-xs text-green-600/60">
          <div className="flex space-x-6">
            <span>form</span>
            <span>//</span>
            <span>function</span>
            <span>//</span>
            <span>perspective</span>
            <span>•</span>
            <span className={isHovered ? 'text-green-400' : ''}> [interact] </span>
          </div>
          <div className="text-green-500/40">
            {clickCount > 0 && `log: ${clickCount} thoughts processed`}
          </div>
        </div>
      </div>
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-green-400/50 to-transparent animate-pulse"></div>
      </div>
      <style jsx>{`
        .space-y-1::-webkit-scrollbar { width: 6px; }
        .space-y-1::-webkit-scrollbar-track { background: rgba(0, 0, 0, 0.3); }
        .space-y-1::-webkit-scrollbar-thumb { background: rgba(34, 197, 94, 0.3); border-radius: 3px; }
      `}</style>
    </footer>
  );
};

export default TerminalFooter;