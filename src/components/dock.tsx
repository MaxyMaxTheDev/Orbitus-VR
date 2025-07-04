"use client";

import { Button } from './ui/button';
import { VirtualClock } from './virtual-clock';
import { LayoutGrid, Globe, Settings, X } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';
import type { App } from '@/lib/apps-config';

type DockProps = {
    onToggleLibrary: () => void;
    onOpenApp: (appName: string) => void;
    selectedApp: App | null;
    onCloseApp: () => void;
}

const pinnedApps = [
    { name: 'Browser', icon: Globe },
    { name: 'Settings', icon: Settings },
];

export function Dock({ onToggleLibrary, onOpenApp, selectedApp, onCloseApp }: DockProps) {
    return (
        <TooltipProvider delayDuration={100}>
            <div className="flex items-center gap-2 bg-card/60 backdrop-blur-xl border border-border rounded-full p-2 shadow-2xl shadow-black/20">
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button variant="ghost" size="icon" className="w-14 h-14 rounded-full text-foreground/80 hover:bg-primary/20 hover:text-primary" onClick={onToggleLibrary}>
                            <LayoutGrid className="w-7 h-7" />
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                        <p>App Library</p>
                    </TooltipContent>
                </Tooltip>

                {selectedApp && (
                     <Tooltip>
                        <TooltipTrigger asChild>
                            <Button variant="ghost" size="icon" className="w-14 h-14 rounded-full text-foreground/80 hover:bg-destructive/20 hover:text-destructive" onClick={onCloseApp}>
                                <X className="w-7 h-7" />
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>Close {selectedApp.name}</p>
                        </TooltipContent>
                    </Tooltip>
                )}

                {pinnedApps.map(app => (
                    <Tooltip key={app.name}>
                        <TooltipTrigger asChild>
                            <Button variant="ghost" size="icon" className="w-14 h-14 rounded-full text-foreground/80 hover:bg-primary/20 hover:text-primary" onClick={() => onOpenApp(app.name)}>
                                <app.icon className="w-7 h-7" />
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>{app.name}</p>
                        </TooltipContent>
                    </Tooltip>
                ))}
                
                <div className="px-4">
                    <VirtualClock />
                </div>
            </div>
        </TooltipProvider>
    )
}
