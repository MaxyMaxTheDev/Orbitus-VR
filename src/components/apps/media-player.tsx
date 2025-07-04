
"use client";

import { useState } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardContent } from '@/components/ui/card';
import { Play, Pause, SkipBack, SkipForward, Music4 } from 'lucide-react';
import { cn } from '@/lib/utils';

const playlist = [
  { id: 1, title: 'NexusVR Launch Trailer', creator: 'Nexus Studios', duration: '2:34', thumbnail: 'https://placehold.co/1280x720.png', hint: 'futuristic city' },
  { id: 2, title: 'Live from the Orbital Stage', creator: 'DJ Hyperion', duration: '45:12', thumbnail: 'https://placehold.co/1280x720.png', hint: 'concert lights' },
  { id: 3, title: 'Sculpting Worlds in VR', creator: 'Ana Digital', duration: '12:50', thumbnail: 'https://placehold.co/1280x720.png', hint: '3d modeling' },
  { id: 4, title: 'Deep Dive: Mariana Trench', creator: 'ExploreVR', duration: '28:19', thumbnail: 'https://placehold.co/1280x720.png', hint: 'underwater bioluminescence' },
  { id: 5, title: 'Cyber-Samurai: The Movie', creator: 'Synthwave Pictures', duration: '1:42:08', thumbnail: 'https://placehold.co/1280x720.png', hint: 'samurai neon' },
  { id: 6, title: 'How to build a Dyson Sphere', creator: 'Cosmo Engineer', duration: '8:42', thumbnail: 'https://placehold.co/1280x720.png', hint: 'dyson sphere' },
];

type Video = typeof playlist[0];

export function MediaPlayer() {
  const [currentVideo, setCurrentVideo] = useState<Video>(playlist[0]);
  const [isPlaying, setIsPlaying] = useState(false);

  const handleSelectVideo = (video: Video) => {
    setCurrentVideo(video);
    setIsPlaying(true);
  };
  
  const handleNext = () => {
    const currentIndex = playlist.findIndex(v => v.id === currentVideo.id);
    const nextIndex = (currentIndex + 1) % playlist.length;
    handleSelectVideo(playlist[nextIndex]);
  }

  const handlePrev = () => {
    const currentIndex = playlist.findIndex(v => v.id === currentVideo.id);
    const prevIndex = (currentIndex - 1 + playlist.length) % playlist.length;
    handleSelectVideo(playlist[prevIndex]);
  }

  return (
    <div className="flex h-full w-full p-4 gap-4">
      {/* Main Player */}
      <div className="flex-[3] flex flex-col gap-4">
        <Card className="w-full aspect-video bg-black rounded-lg overflow-hidden border-primary/30 relative">
          <Image src={currentVideo.thumbnail} alt={currentVideo.title} layout="fill" objectFit="cover" data-ai-hint={currentVideo.hint} />
          <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
            {!isPlaying && <Play className="w-20 h-20 text-white/50" />}
          </div>
        </Card>
        <div className="flex items-center justify-between">
            <div>
                <h2 className="text-2xl font-bold text-foreground">{currentVideo.title}</h2>
                <p className="text-md text-muted-foreground">{currentVideo.creator}</p>
            </div>
            <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon" onClick={handlePrev} className="rounded-full hover:bg-white/20">
                    <SkipBack />
                </Button>
                <Button variant="ghost" size="icon" onClick={() => setIsPlaying(!isPlaying)} className="w-14 h-14 rounded-full bg-accent text-accent-foreground hover:bg-accent/80">
                    {isPlaying ? <Pause className="w-8 h-8"/> : <Play className="w-8 h-8" />}
                </Button>
                <Button variant="ghost" size="icon" onClick={handleNext} className="rounded-full hover:bg-white/20">
                    <SkipForward />
                </Button>
            </div>
        </div>
      </div>

      {/* Playlist */}
      <div className="flex-[2] flex flex-col">
        <h3 className="text-xl font-bold mb-2 text-accent tracking-wider">Playlist</h3>
        <Card className="flex-1 bg-transparent border-primary/30">
          <ScrollArea className="h-full w-full">
            <CardContent className="p-2">
                <div className="flex flex-col gap-2">
                {playlist.map((video) => (
                    <div
                    key={video.id}
                    onClick={() => handleSelectVideo(video)}
                    className={cn(
                        'flex items-center gap-3 p-2 rounded-lg cursor-pointer transition-colors duration-200',
                        currentVideo.id === video.id ? 'bg-primary/50' : 'hover:bg-primary/20'
                    )}
                    >
                    <div className="relative w-24 h-14 bg-secondary rounded-md overflow-hidden flex-shrink-0">
                        <Image src={video.thumbnail} alt={video.title} layout="fill" objectFit="cover" data-ai-hint={video.hint} />
                    </div>
                    <div className="flex-1 overflow-hidden">
                        <p className="font-semibold text-foreground truncate">{video.title}</p>
                        <p className="text-xs text-muted-foreground">{video.creator}</p>
                    </div>
                    <p className="text-sm text-muted-foreground">{video.duration}</p>
                    {currentVideo.id === video.id && isPlaying && (
                        <Music4 className="w-5 h-5 text-accent animate-float" />
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
