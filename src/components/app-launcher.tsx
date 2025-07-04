
"use client";

import { useState, useEffect } from 'react';
import type { LucideIcon } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { 
    Clapperboard, Globe, LayoutGrid, Mail, Music, Settings,
    View, Users, BoxSelect, Gamepad2, Heart, Briefcase, Palette,
    Code, Bot, X, Loader2,
} from "lucide-react";
import Image from 'next/image';
import { generateAppBanner } from '@/ai/flows/generate-app-banner-flow';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

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

const AppIconWithBanner = ({ app, onClick }: { app: App; onClick: (app: App) => void }) => {
    const [bannerUrl, setBannerUrl] = useState<string | null>(null);
    const [isBannerLoading, setIsBannerLoading] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsBannerLoading(true);
            generateAppBanner({ appName: app.name })
                .then(result => setBannerUrl(result.imageUrl))
                .catch(err => {
                    console.error(`Failed to generate banner for ${app.name}:`, err);
                    setBannerUrl('https://placehold.co/400x225.png'); // Fallback placeholder
                })
                .finally(() => setIsBannerLoading(false));
        }, Math.random() * 500);

        return () => clearTimeout(timer);
    }, [app.name]);

    return (
        <Card
            className="w-full bg-black/30 border-2 border-primary/20 hover:border-accent group transition-all duration-300 overflow-hidden cursor-pointer shadow-lg hover:shadow-accent/20"
            onClick={() => onClick(app)}
        >
            <CardContent className="p-0">
                <div className="relative aspect-video bg-secondary">
                    {isBannerLoading ? (
                        <div className="w-full h-full flex items-center justify-center">
                            <Loader2 className="w-8 h-8 text-accent animate-spin" />
                        </div>
                    ) : (
                        bannerUrl && (
                            <Image
                                src={bannerUrl}
                                alt={`${app.name} banner`}
                                layout="fill"
                                objectFit="cover"
                                className="group-hover:scale-105 transition-transform duration-300 animate-in fade-in"
                                data-ai-hint="futuristic abstract"
                            />
                        )
                    )}
                </div>
                <div className={cn("p-3 flex items-center gap-3", {
                    "opacity-0": isBannerLoading,
                    "animate-in fade-in": !isBannerLoading,
                })}>
                     <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center border border-primary/20 group-hover:bg-accent/20 transition-colors flex-shrink-0">
                        <app.icon className="w-6 h-6 text-foreground/80 group-hover:text-accent transition-colors" />
                     </div>
                    <span className="font-headline text-base text-foreground/90 group-hover:text-accent transition-colors truncate">{app.name}</span>
                </div>
            </CardContent>
        </Card>
    );
};


export function AppLauncher() {
    const [selectedApp, setSelectedApp] = useState<App | null>(null);
    const [isClosing, setIsClosing] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    
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
        }, 300);
    };

    const AppGrid = () => (
      <div className="w-full max-w-7xl mx-auto flex flex-col items-center animate-in fade-in duration-500 p-8">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {apps.map((app) => (
                <AppIconWithBanner key={app.name} app={app} onClick={handleAppClick} />
            ))}
        </div>
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
