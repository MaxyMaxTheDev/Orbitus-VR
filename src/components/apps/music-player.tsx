
"use client";

import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardContent } from '@/components/ui/card';
import { Play, Pause, SkipBack, SkipForward, Music4, Volume2, VolumeX } from 'lucide-react';
import { Slider } from '@/components/ui/slider';
import { cn } from '@/lib/utils';
import { useMusicPlayer } from '@/contexts/music-player-context';


export function MusicPlayer() {
  const {
    playlist,
    currentTrack,
    isPlaying,
    isMuted,
    progress,
    duration,
    currentTime,
    togglePlayPause,
    selectTrack,
    skipNext,
    skipPrev,
    seek,
    toggleMute,
  } = useMusicPlayer();


  const formatTime = (time: number) => {
    if (isNaN(time)) return '0:00';
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  
  return (
    <div className="flex h-full w-full p-4 gap-4 bg-black/20">
      <div className="flex-[2] flex flex-col gap-4 items-center justify-center">
        <Card className="w-64 h-64 bg-black rounded-lg overflow-hidden border-2 border-primary/30 relative shadow-2xl shadow-accent/10">
          <Image src={currentTrack.cover} alt={currentTrack.title} layout="fill" objectFit="cover" data-ai-hint={currentTrack.hint} className={cn(isPlaying && "animate-spin-slow")}/>
        </Card>
        <div>
            <h2 className="text-2xl font-bold text-foreground text-center font-headline tracking-wider">{currentTrack.title}</h2>
            <p className="text-md text-muted-foreground text-center">{currentTrack.artist}</p>
        </div>
        <div className="w-full max-w-sm flex flex-col gap-3">
            <Slider value={[progress]} onValueChange={([value]) => seek(value)} />
            <div className="flex justify-between text-xs text-muted-foreground">
                <span>{formatTime(currentTime)}</span>
                <span>{formatTime(duration)}</span>
            </div>
            <div className="flex items-center justify-center gap-4">
                <Button variant="ghost" size="icon" onClick={skipPrev} className="rounded-full hover:bg-white/20">
                    <SkipBack />
                </Button>
                <Button variant="ghost" size="icon" onClick={togglePlayPause} className="w-16 h-16 rounded-full bg-accent text-accent-foreground hover:bg-accent/80">
                    {isPlaying ? <Pause className="w-8 h-8"/> : <Play className="w-8 h-8 ml-1" />}
                </Button>
                <Button variant="ghost" size="icon" onClick={skipNext} className="rounded-full hover:bg-white/20">
                    <SkipForward />
                </Button>
            </div>
             <Button variant="ghost" size="icon" onClick={toggleMute} className="rounded-full hover:bg-white/20 self-center">
                {isMuted ? <VolumeX /> : <Volume2 />}
            </Button>
        </div>
      </div>

      <div className="flex-[2] flex flex-col">
        <h3 className="text-xl font-bold mb-2 text-accent tracking-wider font-headline">PLAYLIST</h3>
        <Card className="flex-1 bg-transparent border-primary/20">
          <ScrollArea className="h-full w-full">
            <CardContent className="p-2">
                <div className="flex flex-col gap-2">
                {playlist.map((track) => (
                    <div
                    key={track.id}
                    onClick={() => selectTrack(track)}
                    className={cn(
                        'flex items-center gap-3 p-2 rounded-lg cursor-pointer transition-colors duration-200 border border-transparent',
                        currentTrack.id === track.id ? 'bg-primary/20 border-primary' : 'hover:bg-primary/10'
                    )}
                    >
                    <div className="relative w-12 h-12 bg-secondary rounded-md overflow-hidden flex-shrink-0">
                        <Image src={track.cover} alt={track.title} layout="fill" objectFit="cover" data-ai-hint={track.hint} />
                    </div>
                    <div className="flex-1 overflow-hidden">
                        <p className="font-semibold text-foreground truncate">{track.title}</p>
                        <p className="text-xs text-muted-foreground">{track.artist}</p>
                    </div>
                     {currentTrack.id === track.id && isPlaying && (
                        <Music4 className="w-5 h-5 text-accent animate-pulse" />
                    )}
                    </div>
                ))}
                </div>
            </CardContent>
          </ScrollArea>
        </Card>
      </div>
    </div>
  );
}
