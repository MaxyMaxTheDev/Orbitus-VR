
'use client';

import React, { createContext, useContext, useState, useRef, useEffect, ReactNode, useCallback } from 'react';

const playlist = [
    { id: 1, title: 'Rave Digger', artist: 'Kevin MacLeod', duration: '2:35', src: 'https://cdn.jsdelivr.net/gh/goldfire/howler.js@master/examples/player/audio/rave_digger.mp3', cover: 'https://placehold.co/500x500.png', hint: 'futuristic skyline' },
    { id: 2, title: '8-Bit Sonar', artist: 'Visager', duration: '3:15', src: 'https://cdn.jsdelivr.net/gh/goldfire/howler.js@master/examples/player/audio/8-bit-sonar.mp3', cover: 'https://placehold.co/500x500.png', hint: 'abstract digital art' },
    { id: 3, title: 'Classic Vybe', artist: 'Visager', duration: '3:01', src: 'https://cdn.jsdelivr.net/gh/goldfire/howler.js@master/examples/player/audio/classic-vybe.mp3', cover: 'https://placehold.co/500x500.png', hint: 'neon race' },
    { id: 4, title: 'Sending My Love', artist: 'Visager', duration: '3:24', src: 'https://cdn.jsdelivr.net/gh/goldfire/howler.js@master/examples/player/audio/sending-my-love.mp3', cover: 'https://placehold.co/500x500.png', hint: 'cyberpunk car' },
    { id: 5, title: 'The Great Mission', artist: 'Visager', duration: '3:00', src: 'https://cdn.jsdelivr.net/gh/goldfire/howler.js@master/examples/player/audio/the-great-mission.mp3', cover: 'https://placehold.co/500x500.png', hint: 'synthwave sunset' },
];

type Track = typeof playlist[0];

type MusicPlayerContextType = {
    playlist: Track[];
    currentTrack: Track;
    isPlaying: boolean;
    isMuted: boolean;
    progress: number;
    duration: number;
    currentTime: number;
    togglePlayPause: () => void;
    selectTrack: (track: Track) => void;
    skipNext: () => void;
    skipPrev: () => void;
    seek: (value: number) => void;
    toggleMute: () => void;
};

const MusicPlayerContext = createContext<MusicPlayerContextType | undefined>(undefined);

export function MusicPlayerProvider({ children }: { children: ReactNode }) {
    const [currentTrack, setCurrentTrack] = useState<Track>(playlist[0]);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isMuted, setIsMuted] = useState(false);
    const [progress, setProgress] = useState(0);
    const [duration, setDuration] = useState(0);
    const [currentTime, setCurrentTime] = useState(0);
    const audioRef = useRef<HTMLAudioElement>(null);

    const skipNext = useCallback(() => {
        const currentIndex = playlist.findIndex(t => t.id === currentTrack.id);
        const nextIndex = (currentIndex + 1) % playlist.length;
        setCurrentTrack(playlist[nextIndex]);
    }, [currentTrack.id]);
    
    useEffect(() => {
        const audio = audioRef.current;
        if (!audio) return;
    
        const updateProgress = () => {
            if (audio.duration && isFinite(audio.duration)) {
                const newProgress = (audio.currentTime / audio.duration) * 100;
                setProgress(newProgress);
                setCurrentTime(audio.currentTime);
            }
        }
        const handleMetadata = () => {
            if (audio.duration && isFinite(audio.duration)) {
                setDuration(audio.duration);
            }
        }
        const handleEnd = () => skipNext();
    
        audio.addEventListener('timeupdate', updateProgress);
        audio.addEventListener('loadedmetadata', handleMetadata);
        audio.addEventListener('ended', handleEnd);
        return () => {
          audio.removeEventListener('timeupdate', updateProgress);
          audio.removeEventListener('loadedmetadata', handleMetadata);
          audio.removeEventListener('ended', handleEnd);
        };
      }, [currentTrack.id, skipNext]);

    useEffect(() => {
        if (audioRef.current) {
            if (isPlaying) {
                audioRef.current.play().catch(e => console.error("Audio play failed:", e));
            } else {
                audioRef.current.pause();
            }
        }
    }, [isPlaying, currentTrack.src]);

    const togglePlayPause = () => {
        setIsPlaying(prev => !prev);
    };
    
    const selectTrack = (track: Track) => {
        setCurrentTrack(track);
    };
    
    const skipPrev = () => {
        if (audioRef.current && audioRef.current.currentTime > 3) {
            audioRef.current.currentTime = 0;
            return;
        }
        const currentIndex = playlist.findIndex(t => t.id === currentTrack.id);
        const prevIndex = (currentIndex - 1 + playlist.length) % playlist.length;
        setCurrentTrack(playlist[prevIndex]);
    };

    const seek = (value: number) => {
        if (audioRef.current && isFinite(audioRef.current.duration)) {
            audioRef.current.currentTime = (value / 100) * audioRef.current.duration;
        }
    };

    const toggleMute = () => {
        setIsMuted(prev => !prev);
    };

    return (
        <MusicPlayerContext.Provider value={{
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
            toggleMute
        }}>
            <audio ref={audioRef} src={currentTrack.src} muted={isMuted} onPlay={() => setIsPlaying(true)} onPause={() => setIsPlaying(false)} />
            {children}
        </MusicPlayerContext.Provider>
    );
}

export function useMusicPlayer() {
    const context = useContext(MusicPlayerContext);
    if (context === undefined) {
        throw new Error('useMusicPlayer must be used within a MusicPlayerProvider');
    }
    return context;
}
