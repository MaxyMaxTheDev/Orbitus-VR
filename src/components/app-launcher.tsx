
"use client";

import { useState, useEffect } from 'react';
import type { LucideIcon } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { 
    Clapperboard, Globe, LayoutGrid, Mail, Music, Settings,
    View, Users, BoxSelect, Gamepad2, Heart, Briefcase, Palette,
    Code, Bot, X,
} from "lucide-react";
import Image from 'next/image';
import { generateAppBanner } from '@/ai/flows/generate-app-banner-flow';
import { Skeleton } from '@/components/ui/skeleton';

import { AIAssistant } from './apps/ai-assistant';
import { ThemeStudio } from './apps/theme-studio';
import { MediaPlayer } from './apps/media-player';
import { Gallery360 } from './apps/360-gallery';
import { Workspace } from './apps/workspace';
import { Wellness } from './apps/wellness';
import { Dashboard } from './apps/dashboard';
import { Browser } from './apps/browser';
import { VRChat } from './apps/vr-chat';
import { SculptVR } from './apps/sculpt-vr';
import { GameHub } from './apps/game-hub';
import { DevKit } from './apps/devkit';
import { MailApp } from './apps/mail';
import { MusicPlayer } from './apps/music-player';
import { SettingsApp } from './apps/settings-app';

const apps = [
    { name: "Dashboard", icon: LayoutGrid, component: Dashboard },
    { name: "Browser", icon: Globe, component: Browser },
    { name: "Media Player", icon: Clapperboard, component: MediaPlayer },
    { name: "VR Chat", icon: Users, component: VRChat },
    { name: "360 Gallery", icon: View, component: Gallery360 },
    { name: "SculptVR", icon: BoxSelect, component: SculptVR },
    { name: "Game Hub", icon: Gamepad2, component: GameHub },
    { name: "Wellness", icon: Heart, component: Wellness },
    { name: "Workspace", icon: Briefcase, component: Workspace },
    { name: "Theme Studio", icon: Palette, component: ThemeStudio },
    { name: "DevKit", icon: Code, component: DevKit },
    { name: "AI Assistant", icon: Bot, component: AIAssistant },
    { name: "Mail", icon: Mail, component: MailApp },
    { name: "Music Player", icon: Music, component: MusicPlayer },
    { name: "Settings", icon: Settings, component: SettingsApp },
];

type App = {
    name: string;
    icon: LucideIcon;
    component: React.FC;
}

export function AppLauncher() {
    const [selectedApp, setSelectedApp] = useState<App | null>(null);
    const [isClosing, setIsClosing] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [appPositions, setAppPositions] = useState<{ x: number, y: number }[]>([]);
    const [bannerUrl, setBannerUrl] = useState<string | null>(null);
    const [isBannerLoading, setIsBannerLoading] = useState(false);

    useEffect(() => {
        const positions = apps.map((_, index) => {
            const angle = (index / apps.length) * 2 * Math.PI;
            const radius = 200;
            const x = Math.cos(angle) * radius;
            const y = Math.sin(angle) * radius;
            return { x, y };
        });
        setAppPositions(positions);
    }, []);

    useEffect(() => {
        if (selectedApp && !isLoading) {
            setIsBannerLoading(true);
            setBannerUrl(null);
            generateAppBanner({ appName: selectedApp.name })
                .then(result => setBannerUrl(result.imageUrl))
                .catch(err => {
                    console.error("Failed to generate banner:", err);
                    setBannerUrl('https://placehold.co/1024x200.png'); 
                })
                .finally(() => setIsBannerLoading(false));
        }
    }, [selectedApp, isLoading]);


    const handleAppClick = (app: App) => {
        setIsLoading(true);
        setSelectedApp(app);
        setTimeout(() => setIsLoading(false), 1000);
    };

    const handleCloseApp = () => {
        setIsClosing(true);
        setTimeout(() => {
            setSelectedApp(null);
            setIsClosing(false);
            setBannerUrl(null);
        }, 300);
    };

    const AppGrid = () => (
      <div className="relative w-[500px] h-[500px] flex items-center justify-center animate-fade-in">
        {appPositions.length > 0 && apps.map((app, index) => {
          const position = appPositions[index];
          return (
            <Button
              key={app.name}
              variant="ghost"
              onClick={() => handleAppClick(app)}
              className="absolute flex flex-col items-center justify-center h-28 w-28 text-foreground/80 hover:text-accent hover:bg-transparent transition-all duration-300 group"
              style={{
                transform: `translate(${position.x}px, ${position.y}px)`,
              }}
            >
              <div className="w-20 h-20 rounded-full bg-black/30 border-2 border-primary/30 group-hover:border-accent group-hover:bg-accent/10 flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:animate-pulse">
                <app.icon className="w-10 h-10 transition-transform duration-300" />
              </div>
              <span className="font-body text-sm text-center mt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">{app.name}</span>
            </Button>
          );
        })}
        <div className="w-48 h-48 rounded-full bg-black/20 border-2 border-primary/10 flex items-center justify-center text-center font-headline text-primary/50">
          NEXUS OS
        </div>
      </div>
    );

    const LoadingScreen = () => (
      <div className="flex flex-col items-center justify-center h-full animate-fade-in">
          <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin-slow border-accent mb-4"></div>
          <p className="text-lg text-accent animate-pulse font-headline tracking-widest">INITIATING: {selectedApp?.name}...</p>
      </div>
    );
    
    const AppWindow = () => {
        if (!selectedApp) return null;
        
        const AppContent = selectedApp.component;

        return (
            <div className={`w-full max-w-5xl h-[80vh] flex flex-col bg-black/50 backdrop-blur-xl border border-primary/30 shadow-2xl shadow-primary/20 transition-all duration-300 ${isClosing ? 'animate-glitch-out' : 'animate-glitch-in'}`} style={{clipPath: 'polygon(0 0, 100% 0, 100% calc(100% - 30px), calc(100% - 30px) 100%, 0 100%)'}}>
                <header className="flex items-center justify-between p-2 pl-4 border-b border-primary/30 bg-black/20 cursor-grab">
                    <div className="flex items-center gap-3">
                        <selectedApp.icon className="w-5 h-5 text-accent animate-pulse" />
                        <span className="font-bold font-headline tracking-wider text-foreground">{selectedApp.name}</span>
                    </div>
                    <Button variant="ghost" size="icon" className="w-8 h-8 rounded-full hover:bg-accent hover:text-accent-foreground" onClick={handleCloseApp}>
                        <X className="w-4 h-4" />
                    </Button>
                </header>

                <div className="w-full h-32 bg-black/20 border-b border-primary/30 relative flex-shrink-0">
                    {isBannerLoading ? (
                        <Skeleton className="w-full h-full" />
                    ) : bannerUrl ? (
                        <Image src={bannerUrl} alt={`${selectedApp.name} Banner`} layout="fill" objectFit="cover" />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center bg-black/10" />
                    )}
                </div>

                <main className="flex-1 bg-black/20 overflow-hidden">
                    <AppContent />
                </main>
            </div>
        )
    };
    
    return (
      <div className="w-full max-w-6xl min-h-[85vh] flex items-center justify-center transition-all duration-500 ease-in-out">
        {!selectedApp ? <AppGrid /> : (
            isLoading ? <LoadingScreen /> : <AppWindow />
        )}
      </div>
    );
}
