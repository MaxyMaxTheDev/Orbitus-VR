
"use client";

import { useState } from 'react';
import type { LucideIcon } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
    Clapperboard, 
    Globe, 
    LayoutGrid, 
    Mail, 
    Music, 
    Settings,
    View,
    Users,
    BoxSelect,
    Gamepad2,
    Heart,
    Briefcase,
    Palette,
    Code,
    Bot,
    X,
} from "lucide-react";
import { AIAssistant } from './apps/ai-assistant';

const apps = [
    { name: "Dashboard", icon: LayoutGrid },
    { name: "Browser", icon: Globe },
    { name: "Media Player", icon: Clapperboard },
    { name: "VR Chat", icon: Users },
    { name: "360 Gallery", icon: View },
    { name: "SculptVR", icon: BoxSelect },
    { name: "Game Hub", icon: Gamepad2 },
    { name: "Wellness", icon: Heart },
    { name: "Workspace", icon: Briefcase },
    { name: "Theme Studio", icon: Palette },
    { name: "DevKit", icon: Code },
    { name: "AI Assistant", icon: Bot },
    { name: "Mail", icon: Mail },
    { name: "Music", icon: Music },
    { name: "Settings", icon: Settings },
];

type App = {
    name: string;
    icon: LucideIcon;
}

export function AppLauncher() {
    const [selectedApp, setSelectedApp] = useState<App | null>(null);
    const [isClosing, setIsClosing] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleAppClick = (app: App) => {
        setSelectedApp(app);
        setIsLoading(true);
        setTimeout(() => {
            setIsLoading(false);
        }, 1500); // Simulate loading time
    };

    const handleCloseApp = () => {
        setIsClosing(true);
        setTimeout(() => {
            setSelectedApp(null);
            setIsClosing(false);
        }, 300); // Corresponds to zoom-out animation duration
    };

    const AppGrid = () => (
        <div className="flex justify-center animate-fade-in">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {apps.map((app) => (
                <Button
                key={app.name}
                variant="ghost"
                onClick={() => handleAppClick(app)}
                className="flex flex-col items-center justify-center h-32 w-32 gap-2 text-foreground/80 hover:text-accent hover:bg-primary/20 transition-all duration-300 rounded-full group"
                >
                <app.icon className="w-12 h-12 transition-transform duration-300 group-hover:scale-110" />
                <span className="font-body text-sm">{app.name}</span>
                </Button>
            ))}
            </div>
        </div>
    );

    const LoadingScreen = () => (
        <div className="flex flex-col items-center justify-center h-[400px] animate-fade-in">
            <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin-slow border-accent mb-4"></div>
            <p className="text-lg text-accent animate-pulse">Loading {selectedApp?.name}...</p>
        </div>
    );
    
    const AppWindow = () => {
        if (!selectedApp) return null;
        
        const renderContent = () => {
            switch(selectedApp.name) {
                case "AI Assistant":
                    return <AIAssistant />;
                default:
                    return (
                        <div className="flex items-center justify-center h-full">
                            <p className="text-muted-foreground">Application content for {selectedApp.name} would be here.</p>
                        </div>
                    );
            }
        }

        return (
            <div className={`w-full max-w-3xl h-[70vh] flex flex-col rounded-2xl overflow-hidden bg-card/80 backdrop-blur-xl border-primary/30 shadow-2xl shadow-primary/20 ${isClosing ? 'animate-zoom-out' : 'animate-zoom-in'}`}>
                <header className="flex items-center justify-between p-2 pl-4 border-b border-primary/30 bg-black/20 cursor-grab">
                    <div className="flex items-center gap-3">
                        <selectedApp.icon className="w-5 h-5 text-accent" />
                        <span className="font-bold text-foreground">{selectedApp.name}</span>
                    </div>
                    <Button variant="ghost" size="icon" className="w-8 h-8 rounded-full hover:bg-white/20" onClick={handleCloseApp}>
                        <X className="w-4 h-4" />
                    </Button>
                </header>
                <main className="flex-1 bg-black/20">
                    {renderContent()}
                </main>
            </div>
        )
    };
    
  return (
    <Card className="w-full max-w-5xl bg-card/60 backdrop-blur-lg border-primary/20 shadow-2xl shadow-primary/20 transition-all duration-500 ease-in-out">
      <CardHeader>
        <CardTitle className="text-center text-2xl font-headline text-accent tracking-widest">
          APP LAUNCHER
        </CardTitle>
      </CardHeader>
      <CardContent className="min-h-[75vh] flex items-center justify-center transition-all duration-300">
        {!selectedApp ? <AppGrid /> : (
            isLoading ? <LoadingScreen /> : <AppWindow />
        )}
      </CardContent>
    </Card>
  );
}
