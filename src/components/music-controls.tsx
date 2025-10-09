
"use client";

import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Play, Pause, SkipBack, SkipForward } from 'lucide-react';
import { useMusicPlayer } from '@/contexts/music-player-context';
import { cn } from '@/lib/utils';

export function MusicControls() {
  const {
    currentTrack,
    isPlaying,
    togglePlayPause,
    skipNext,
    skipPrev,
  } = useMusicPlayer();

  return (
    <div className="flex items-center gap-4">
        <div className="relative w-16 h-16 rounded-md overflow-hidden flex-shrink-0 border border-border">
            <Image src={currentTrack.cover} alt={currentTrack.title} layout="fill" objectFit="cover" data-ai-hint={currentTrack.hint} />
        </div>
        <div className="flex-1 overflow-hidden">
            <p className="font-semibold text-foreground truncate">{currentTrack.title}</p>
            <p className="text-xs text-muted-foreground">{currentTrack.artist}</p>
        </div>
        <div className="flex items-center">
            <Button variant="ghost" size="icon" onClick={skipPrev} className="w-10 h-10 rounded-full hover:bg-white/20">
                <SkipBack />
            </Button>
            <Button variant="ghost" size="icon" onClick={togglePlayPause} className="w-12 h-12 rounded-full bg-accent text-accent-foreground hover:bg-accent/80">
                {isPlaying ? <Pause className="w-6 h-6"/> : <Play className="w-6 h-6 ml-1" />}
            </Button>
            <Button variant="ghost" size="icon" onClick={skipNext} className="w-10 h-10 rounded-full hover:bg-white/20">
                <SkipForward />
            </Button>
        </div>
    </div>
  );
}
