
"use client";

import { useState, useCallback } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardContent } from '@/components/ui/card';
import { Play, Pause, SkipBack, SkipForward, Music4 } from 'lucide-react';
import { cn } from '@/lib/utils';

// Import the coded video components
import { 
  XenovaTrailer,
  OrbitalStage,
  SculptingWorlds,
  DeepDive,
  CyberSamurai,
  DysonSphere
} from '@/components/videos';

// Update the playlist to use components instead of video files
const playlist = [
  { id: 1, title: 'XenovaVR Launch Trailer', creator: 'XenovaVR', duration: 'Loop', thumbnail: 'https://placehold.co/1280x720.png', hint: 'futuristic city', component: XenovaTrailer },
  { id: 2, title: 'Live from the Orbital Stage', creator: 'DJ Hyperion', duration: 'Loop', thumbnail: 'https://placehold.co/1280x720.png', hint: 'concert lights', component: OrbitalStage },
  { id: 3, title: 'Sculpting Worlds in VR', creator: 'Ana Digital', duration: 'Loop', thumbnail: 'https://placehold.co/1280x720.png', hint: '3d modeling', component: SculptingWorlds },
  { id: 4, title: 'Deep Dive: Mariana Trench', creator: 'ExploreVR', duration: 'Loop', thumbnail: 'https://placehold.co/1280x720.png', hint: 'underwater bioluminescence', component: DeepDive },
  { id: 5, title: 'Cyber-Samurai: The Movie', creator: 'Synthwave Pictures', duration: 'Loop', thumbnail: 'https://placehold.co/1280x720.png', hint: 'samurai neon', component: CyberSamurai },
  { id: 6, title: 'How to build a Dyson Sphere', creator: 'Cosmo Engineer', duration: 'Loop', thumbnail: 'https://placehold.co/1280x720.png', hint: 'dyson sphere', component: DysonSphere },
];

type Video = typeof playlist[0];

export function MediaPlayer() {
  const [currentVideo, setCurrentVideo] = useState<Video>(playlist[0]);
  const [isPlaying, setIsPlaying] = useState(false);

  const handleNext = useCallback(() => {
    const currentIndex = playlist.findIndex(v => v.id === currentVideo.id);
    const nextIndex = (currentIndex + 1) % playlist.length;
    setCurrentVideo(playlist[nextIndex]);
    setIsPlaying(true);
  }, [currentVideo.id]);

  const handlePrev = () => {
    const currentIndex = playlist.findIndex(v => v.id === currentVideo.id);
    const prevIndex = (currentIndex - 1 + playlist.length) % playlist.length;
    setCurrentVideo(playlist[prevIndex]);
    setIsPlaying(true);
  };
  
  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const handleSelectVideo = (video: Video) => {
    if (currentVideo.id !== video.id) {
        setCurrentVideo(video);
        setIsPlaying(true);
    } else {
        togglePlay();
    }
  };

  const VideoComponent = currentVideo.component;

  return (
    <div className="h-full w-full overflow-y-auto">
        <div className="flex flex-col lg:flex-row p-4 gap-4">
            {/* Main Player */}
            <div className="lg:flex-[3] flex flex-col gap-4">
                <Card className="w-full aspect-video bg-black rounded-lg overflow-hidden border-primary/30 relative cursor-pointer" onClick={togglePlay}>
                   <VideoComponent isPlaying={isPlaying} />
                </Card>
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-bold text-foreground">{currentVideo.title}</h2>
                        <p className="text-md text-muted-foreground">{currentVideo.creator}</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button variant="ghost" size="icon" onClick={(e) => { e.stopPropagation(); handlePrev(); }} className="rounded-full hover:bg-white/20">
                            <SkipBack />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={(e) => { e.stopPropagation(); togglePlay(); }} className="w-14 h-14 rounded-full bg-accent text-accent-foreground hover:bg-accent/80">
                            {isPlaying ? <Pause className="w-8 h-8"/> : <Play className="w-8 h-8 ml-1" />}
                        </Button>
                        <Button variant="ghost" size="icon" onClick={(e) => { e.stopPropagation(); handleNext(); }} className="rounded-full hover:bg-white/20">
                            <SkipForward />
                        </Button>
                    </div>
                </div>
            </div>

            {/* Playlist */}
            <div className="lg:flex-[2] flex flex-col">
                <h3 className="text-xl font-bold mb-2 text-accent tracking-wider">Playlist</h3>
                <Card className="flex-1 bg-transparent border-primary/30 min-h-[300px] lg:min-h-0">
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
    </div>
  );
}
