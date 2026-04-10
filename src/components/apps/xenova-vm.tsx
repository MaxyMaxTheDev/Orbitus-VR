
"use client";

import { useState, useEffect } from 'react';
import { Loader2, Terminal, Info, ShieldAlert } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

export function XenovaVM() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate BIOS/Kernel boot time
    const timer = setTimeout(() => setIsLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="w-full h-full bg-[#0c0c0c] flex flex-col relative overflow-hidden">
      {/* VM Header / Status Bar */}
      <div className="h-8 bg-black/40 border-b border-white/5 flex items-center justify-between px-4 text-[10px] font-mono text-white/40 select-none">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
            VM STATE: RUNNING
          </span>
          <span>CPU: X86_64</span>
          <span>MEM: 512MB</span>
        </div>
        <div className="flex items-center gap-4">
          <span>ETH0: CONNECTED</span>
          <span>IO: STDOUT/TTY1</span>
        </div>
      </div>

      <div className="flex-1 relative">
        {isLoading ? (
          <div className="absolute inset-0 z-10 bg-black flex flex-col items-center justify-center gap-4">
            <div className="font-mono text-xs text-green-500 space-y-1">
              <p>[    0.000000] Linux version 4.19.0-x86_64</p>
              <p>[    0.004512] Xenova Hypervisor detected</p>
              <p>[    0.124851] Initializing CPU modules...</p>
              <p>[    0.458712] Mounting virtual drives...</p>
              <p>[    0.895124] Starting systemd-journald...</p>
            </div>
            <Loader2 className="w-8 h-8 animate-spin text-primary mt-4" />
          </div>
        ) : (
          <iframe
            src="https://copy.sh/v86/?profile=linux26"
            className="w-full h-full border-0"
            title="XenovaVM x86 Emulator"
            sandbox="allow-scripts allow-same-origin allow-forms"
          />
        )}
      </div>

      {/* Overlay Warning for guest access */}
      <div className="absolute bottom-4 left-4 p-2 px-3 bg-black/60 backdrop-blur-md border border-white/10 rounded text-[10px] font-mono text-white/60 pointer-events-none">
        <span className="flex items-center gap-2">
          <Terminal className="w-3 h-3 text-primary" />
          XENOVA VIRTUAL MACHINE v3.0.4-LTS
        </span>
      </div>
    </div>
  );
}
