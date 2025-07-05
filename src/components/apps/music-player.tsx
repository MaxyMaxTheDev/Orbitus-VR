"use client";

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardContent } from '@/components/ui/card';
import { Play, Pause, SkipBack, SkipForward, Music4, Volume2, VolumeX } from 'lucide-react';
import { Slider } from '@/components/ui/slider';
import { cn } from '@/lib/utils';

const playlist = [
  { id: 1, title: 'Cyberdreams', artist: 'SynthRider', duration: '3:45', src: 'https://storage.googleapis.com/studioprompts/placeholder-audio/cyberdreams.mp3', cover: 'https://placehold.co/500x500.png', hint: 'abstract synthwave' },
  { id: 2, title: 'Orbital Resonance', artist: 'DJ Hyperion', duration: '5:12', src: 'https://storage.googleapis.com/studioprompts/placeholder-audio/orbital.mp3', cover: 'https://placehold.co/500x500.png', hint: 'planet rings' },
  { id: 3, title: 'Crystal Caves', artist: 'Ana Digital', duration: '4:20', src: 'https://storage.googleapis.com/studioprompts/placeholder-audio/caves.mp3', cover: 'https://placehold.co/500x500.png', hint: 'glowing crystals' },
  { id: 4, title: 'Data Stream', artist: 'Oracle', duration: '6:01', src: 'https://storage.googleapis.com/studioprompts/placeholder-audio/data.mp3', cover: 'https://placehold.co/500x500.png', hint: 'binary code' },
  { id: 5, title: 'Neon Noir', artist: 'SynthRider', duration: '3:58', src: 'https://storage.googleapis.com/studioprompts/placeholder-audio/noir.mp3', cover: 'https://placehold.co/500x500.png', hint: 'neon city rain' },
];

type Track = typeof playlist[0];

export function MusicPlayer() {
  const [currentTrack, setCurrentTrack] = useState<Track>(playlist[0]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);

  const formatTime = (time: number) => {
    if (isNaN(time)) return '0:00';
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const handlePlayPause = () => {
    if (isPlaying) {
      audioRef.current?.pause();
    } else {
      audioRef.current?.play();
    }
    setIsPlaying(!isPlaying);
  };
  
  const handleNext = () => {
    const currentIndex = playlist.findIndex(t => t.id === currentTrack.id);
    const nextIndex = (currentIndex + 1) % playlist.length;
    setCurrentTrack(playlist[nextIndex]);
  }

  const handlePrev = () => {
    if (audioRef.current && audioRef.current.currentTime > 3) {
        audioRef.current.currentTime = 0;
        return;
    }
    const currentIndex = playlist.findIndex(t => t.id === currentTrack.id);
    const prevIndex = (currentIndex - 1 + playlist.length) % playlist.length;
    setCurrentTrack(playlist[prevIndex]);
  }

  useEffect(() => {
    if (isPlaying) {
        audioRef.current?.play().catch(e => console.error("Audio play failed:", e));
    }
  }, [currentTrack, isPlaying]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateProgress = () => {
        const newProgress = (audio.currentTime / audio.duration) * 100;
        if (isFinite(newProgress)) {
            setProgress(newProgress);
        }
        setCurrentTime(audio.currentTime);
    }
    const handleMetadata = () => setDuration(audio.duration);
    const handleEnd = () => handleNext();

    audio.addEventListener('timeupdate', updateProgress);
    audio.addEventListener('loadedmetadata', handleMetadata);
    audio.addEventListener('ended', handleEnd);
    return () => {
      audio.removeEventListener('timeupdate', updateProgress);
      audio.removeEventListener('loadedmetadata', handleMetadata);
      audio.removeEventListener('ended', handleEnd);
    };
  }, [currentTrack.id]);
  
  return (
    <div className="flex h-full w-full p-4 gap-4 bg-black/20">
      <audio ref={audioRef} src={currentTrack.src} muted={isMuted} onPlay={() => setIsPlaying(true)} onPause={() => setIsPlaying(false)} />
      <div className="flex-[2] flex flex-col gap-4 items-center justify-center">
        <Card className="w-64 h-64 bg-black rounded-lg overflow-hidden border-2 border-primary/30 relative shadow-2xl shadow-accent/10">
          <Image src={currentTrack.cover} alt={currentTrack.title} layout="fill" objectFit="cover" data-ai-hint={currentTrack.hint} className={cn(isPlaying && "animate-spin-slow")}/>
        </Card>
        <div>
            <h2 className="text-2xl font-bold text-foreground text-center font-headline tracking-wider">{currentTrack.title}</h2>
            <p className="text-md text-muted-foreground text-center">{currentTrack.artist}</p>
        </div>
        <div className="w-full max-w-sm flex flex-col gap-3">
            <Slider value={[progress]} onValueChange={(value) => {
                if(audioRef.current) audioRef.current.currentTime = (value[0] / 100) * audioRef.current.duration;
            }} />
            <div className="flex justify-between text-xs text-muted-foreground">
                <span>{formatTime(currentTime)}</span>
                <span>{formatTime(duration)}</span>
            </div>
            <div className="flex items-center justify-center gap-4">
                <Button variant="ghost" size="icon" onClick={handlePrev} className="rounded-full hover:bg-white/20">
                    <SkipBack />
                </Button>
                <Button variant="ghost" size="icon" onClick={handlePlayPause} className="w-16 h-16 rounded-full bg-accent text-accent-foreground hover:bg-accent/80">
                    {isPlaying ? <Pause className="w-8 h-8"/> : <Play className="w-8 h-8 ml-1" />}
                </Button>
                <Button variant="ghost" size="icon" onClick={handleNext} className="rounded-full hover:bg-white/20">
                    <SkipForward />
                </Button>
            </div>
             <Button variant="ghost" size="icon" onClick={() => setIsMuted(!isMuted)} className="rounded-full hover:bg-white/20 self-center">
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
                    onClick={() => setCurrentTrack(track)}
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
