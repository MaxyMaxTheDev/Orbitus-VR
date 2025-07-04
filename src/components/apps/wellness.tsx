
"use client";

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

type BreathingState = 'idle' | 'inhale' | 'hold' | 'exhale';

const cycle: Record<BreathingState, { next: BreathingState; duration: number; text: string; instruction: string }> = {
  idle: { next: 'inhale', duration: 0, text: 'Start', instruction: 'Click Start to begin the session.' },
  inhale: { next: 'hold', duration: 4000, text: 'Breathe In...', instruction: 'Follow the circle, inhale slowly.' },
  hold: { next: 'exhale', duration: 4000, text: 'Hold', instruction: 'Hold your breath.' },
  exhale: { next: 'inhale', duration: 6000, text: 'Breathe Out...', instruction: 'Exhale completely.' },
};

export function Wellness() {
  const [state, setState] = useState<BreathingState>('idle');
  
  useEffect(() => {
    if (state === 'idle') return;

    const timer = setTimeout(() => {
      setState(cycle[state].next);
    }, cycle[state].duration);

    return () => clearTimeout(timer);
  }, [state]);

  const toggleSession = () => {
    setState(prevState => prevState === 'idle' ? 'inhale' : 'idle');
  };

  return (
    <div className="h-full w-full flex flex-col items-center justify-center p-4 bg-black/20 gap-8">
      <div className="relative flex items-center justify-center w-64 h-64">
        <div className={cn(
          "absolute rounded-full bg-primary/20 transition-all duration-[3000ms] ease-out",
          state === 'inhale' ? 'w-64 h-64' : 'w-24 h-24'
        )}></div>
        <div className={cn(
          "absolute rounded-full bg-primary/40 transition-all duration-[3000ms] ease-out",
          state === 'inhale' ? 'w-48 h-48' : 'w-16 h-16'
        )}></div>
        <div className="relative w-32 h-32 rounded-full bg-primary flex items-center justify-center text-center text-primary-foreground font-bold text-lg">
          {cycle[state].text}
        </div>
      </div>
      
      <div className="text-center">
        <h2 className="text-2xl font-semibold text-accent">{cycle[state].text}</h2>
        <p className="text-muted-foreground mt-2">{cycle[state].instruction}</p>
      </div>

      <Button
        onClick={toggleSession}
        className="w-48 bg-accent hover:bg-accent/80 text-accent-foreground text-lg py-6"
      >
        {state === 'idle' ? 'Start Session' : 'End Session'}
      </Button>
    </div>
  );
}
