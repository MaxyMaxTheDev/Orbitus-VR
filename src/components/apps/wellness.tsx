
"use client";

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const cycle = {
  idle: { next: 'inhale' as const, duration: 0, text: 'Start', instruction: 'Click Start to begin the session.' },
  inhale: { next: 'hold' as const, duration: 4000, text: 'Breathe In...', instruction: 'Follow the circle, inhale slowly.' },
  hold: { next: 'exhale' as const, duration: 4000, text: 'Hold', instruction: 'Hold your breath.' },
  exhale: { next: 'inhale' as const, duration: 6000, text: 'Breathe Out...', instruction: 'Exhale completely.' },
};

type BreathingState = keyof typeof cycle;

export function Wellness() {
  const [state, setState] = useState<BreathingState>('idle');
  
  useEffect(() => {
    if (state === 'idle') return;

    const currentStateInfo = cycle[state];
    const timer = setTimeout(() => {
      setState(currentStateInfo.next);
    }, currentStateInfo.duration);

    return () => clearTimeout(timer);
  }, [state]);

  const toggleSession = () => {
    setState(prevState => prevState === 'idle' ? 'inhale' : 'idle');
  };

  const currentStateInfo = cycle[state];
  const isExpanded = state === 'inhale' || state === 'hold';
  const transitionDuration = state !== 'idle' ? `${currentStateInfo.duration}ms` : '500ms';

  return (
    <div className="h-full w-full flex flex-col items-center justify-center p-4 bg-black/20 gap-8">
      <div className="relative flex items-center justify-center w-64 h-64">
        <div
          className={cn(
            "absolute rounded-full bg-primary/20 transition-all ease-out",
            isExpanded ? 'w-64 h-64' : 'w-24 h-24'
          )}
          style={{ transitionDuration }}
        ></div>
        <div
          className={cn(
            "absolute rounded-full bg-primary/40 transition-all ease-out",
            isExpanded ? 'w-48 h-48' : 'w-16 h-16'
          )}
          style={{ transitionDuration }}
        ></div>
        <div className="relative w-32 h-32 rounded-full bg-primary flex items-center justify-center text-center text-primary-foreground font-bold text-lg">
          {currentStateInfo.text}
        </div>
      </div>
      
      <div className="text-center">
        <h2 className="text-2xl font-semibold text-accent">{currentStateInfo.text}</h2>
        <p className="text-muted-foreground mt-2">{currentStateInfo.instruction}</p>
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
