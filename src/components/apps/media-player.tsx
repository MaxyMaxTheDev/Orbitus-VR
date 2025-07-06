
"use client";

import { useState, useRef, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardContent } from '@/components/ui/card';
import { Play, Pause, SkipBack, SkipForward, Music4 } from 'lucide-react';
import { cn } from '@/lib/utils';

const playlist = [
  { id: 1, title: 'XenovaVR Launch Trailer', creator: 'XenovaVR', duration: '9:56', thumbnail: 'https://placehold.co/1280x720.png', hint: 'futuristic city', videoSrc: 'https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4' },
  { id: 2, title: 'Live from the Orbital Stage', creator: 'DJ Hyperion', duration: '0:15', thumbnail: 'https://placehold.co/1280x720.png', hint: 'concert lights', videoSrc: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4' },
  { id: 3, title: 'Sculpting Worlds in VR', creator: 'Ana Digital', duration: '1:00', thumbnail: 'https://placehold.co/1280x720.png', hint: '3d modeling', videoSrc: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4' },
  { id: 4, title: 'Deep Dive: Mariana Trench', creator: 'ExploreVR', duration: '0:15', thumbnail: 'https://placehold.co/1280x720.png', hint: 'underwater bioluminescence', videoSrc: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4' },
  { id: 5, title: 'Cyber-Samurai: The Movie', creator: 'Synthwave Pictures', duration: '14:48', thumbnail: 'https://placehold.co/1280x720.png', hint: 'samurai neon', videoSrc: 'https://storage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4' },
  { id: 6, title: 'How to build a Dyson Sphere', creator: 'Cosmo Engineer', duration: '12:14', thumbnail: 'https://placehold.co/1280x720.png', hint: 'dyson sphere', videoSrc: 'https://storage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4' },
];

type Video = typeof playlist[0];

export function MediaPlayer() {
  const [currentVideo, setCurrentVideo] = useState<Video>(playlist[0]);
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const handleNext = useCallback(() => {
    const currentIndex = playlist.findIndex(v => v.id === currentVideo.id);
    const nextIndex = (currentIndex + 1) % playlist.length;
    setCurrentVideo(playlist[nextIndex]);
    setIsPlaying(true);
  }, [currentVideo.id]);

  // This effect handles the video source and playback state
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    
    // If the video source is different, update it and load
    if (video.src !== currentVideo.videoSrc) {
        video.src = currentVideo.videoSrc;
        video.load();
    }
    
    // Control play/pause
    if (isPlaying) {
      video.play().catch(e => {
        // Autoplay might be blocked
        console.error("Video play failed:", e)
        setIsPlaying(false); // Update state if play fails
      });
    } else {
      video.pause();
    }

  }, [isPlaying, currentVideo]);

  // This effect handles event listeners on the video element
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const onEnded = () => handleNext();
    const onPlay = () => setIsPlaying(true);
    const onPause = () => setIsPlaying(false);

    video.addEventListener('ended', onEnded);
    video.addEventListener('play', onPlay);
    video.addEventListener('pause', onPause);
    
    return () => {
      video.removeEventListener('ended', onEnded);
      video.removeEventListener('play', onPlay);
      video.removeEventListener('pause', onPause);
    };
  }, [handleNext]);


  const handleSelectVideo = (video: Video) => {
    if (currentVideo.id !== video.id) {
        setCurrentVideo(video);
        setIsPlaying(true);
    } else {
        setIsPlaying(!isPlaying);
    }
  };

  const handlePrev = () => {
    if (videoRef.current && videoRef.current.currentTime > 3) {
      videoRef.current.currentTime = 0;
      return;
    }
    const currentIndex = playlist.findIndex(v => v.id === currentVideo.id);
    const prevIndex = (currentIndex - 1 + playlist.length) % playlist.length;
    setCurrentVideo(playlist[prevIndex]);
    setIsPlaying(true);
  };
  
  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  return (
    <div className="h-full w-full overflow-y-auto">
        <div className="flex flex-col lg:flex-row p-4 gap-4">
            {/* Main Player */}
            <div className="lg:flex-[3] flex flex-col gap-4">
                <Card className="w-full aspect-video bg-black rounded-lg overflow-hidden border-primary/30 relative">
                    <video
                        ref={videoRef}
                        className="w-full h-full object-contain cursor-pointer"
                        poster={currentVideo.thumbnail}
                        onClick={togglePlay}
                        onDoubleClick={(e) => e.currentTarget.requestFullscreen()}
                        playsInline
                        key={currentVideo.videoSrc}
                    >
                        <source src={currentVideo.videoSrc} type="video/mp4" />
                        Your browser does not support the video tag.
                    </video>
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
                        <Button variant="ghost" size="icon" onClick={togglePlay} className="w-14 h-14 rounded-full bg-accent text-accent-foreground hover:bg-accent/80">
                            {isPlaying ? <Pause className="w-8 h-8"/> : <Play className="w-8 h-8 ml-1" />}
                        </Button>
                        <Button variant="ghost" size="icon" onClick={handleNext} className="rounded-full hover:bg-white/20">
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
