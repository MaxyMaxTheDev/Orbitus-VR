
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
    const [bannerUrl, setBannerUrl] = useState<string | null>(null);
    const [isBannerLoading, setIsBannerLoading] = useState(false);
    
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
        setTimeout(() => setIsLoading(false), 500); // Shorter loading time
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
      <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-8 gap-x-8 gap-y-12 p-8 animate-in fade-in duration-500">
        {apps.map((app) => (
          <div
            key={app.name}
            className="flex flex-col items-center gap-3 text-center cursor-pointer group"
            onClick={() => handleAppClick(app)}
          >
            <div className="w-24 h-24 rounded-2xl bg-black/30 border-2 border-primary/20 group-hover:border-accent group-hover:bg-accent/10 flex items-center justify-center transition-all duration-300 group-hover:scale-110 shadow-lg">
              <app.icon className="w-12 h-12 text-foreground/80 group-hover:text-accent transition-colors" />
            </div>
            <span className="font-body text-sm text-foreground/90 group-hover:text-accent transition-colors">{app.name}</span>
          </div>
        ))}
      </div>
    );

    const LoadingScreen = () => (
      <div className="flex flex-col items-center justify-center h-full animate-fade-in">
          <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin-slow border-accent mb-4"></div>
          <p className="text-lg text-accent animate-pulse font-headline tracking-widest">LOADING: {selectedApp?.name}...</p>
      </div>
    );
    
    const AppWindow = () => {
        if (!selectedApp) return null;
        
        const AppContent = selectedApp.component;

        return (
            <div className={`w-full max-w-6xl mx-auto h-[85vh] flex flex-col bg-card/80 backdrop-blur-xl border border-border rounded-xl shadow-2xl shadow-primary/20 transition-all duration-300 ${isClosing ? 'animate-out fade-out ' : 'animate-in fade-in'}`}>
                <header className="flex items-center justify-between p-2 pl-4 border-b border-border bg-card/50 cursor-grab rounded-t-xl">
                    <div className="flex items-center gap-3">
                        <selectedApp.icon className="w-5 h-5 text-accent" />
                        <span className="font-bold font-headline tracking-wider text-foreground">{selectedApp.name}</span>
                    </div>
                    <Button variant="ghost" size="icon" className="w-8 h-8 rounded-full hover:bg-accent hover:text-accent-foreground" onClick={handleCloseApp}>
                        <X className="w-4 h-4" />
                    </Button>
                </header>

                <div className="w-full h-40 bg-black/20 border-b border-border relative flex-shrink-0">
                    {isBannerLoading ? (
                        <Skeleton className="w-full h-full" />
                    ) : bannerUrl ? (
                        <Image src={bannerUrl} alt={`${selectedApp.name} Banner`} layout="fill" objectFit="cover" />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center bg-black/10" />
                    )}
                </div>

                <main className="flex-1 bg-black/20 overflow-hidden rounded-b-xl">
                    <AppContent />
                </main>
            </div>
        )
    };
    
    return (
      <div className="w-full min-h-[85vh] flex items-center justify-center transition-all duration-500 ease-in-out p-4">
        {!selectedApp ? <AppGrid /> : (
            isLoading ? <LoadingScreen /> : <AppWindow />
        )}
      </div>
    );
}
