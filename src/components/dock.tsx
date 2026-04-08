"use client";

import { Button } from './ui/button';
import { VirtualClock } from './virtual-clock';
import { LayoutGrid, Globe, Settings } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';

type DockProps = {
    onToggleLibrary: () => void;
    onOpenApp: (appName: string) => void;
}

const pinnedApps = [
    { name: 'Browser', icon: Globe },
    { name: 'Settings', icon: Settings },
];

export function Dock({ onToggleLibrary, onOpenApp }: DockProps) {
    return (
        <TooltipProvider delayDuration={100}>
            <div 
                className="flex items-center gap-2 bg-card/60 border border-border rounded-full p-2 shadow-2xl shadow-black/20 transition-[backdrop-filter] duration-300"
                style={{ backdropFilter: 'blur(var(--ui-blur))' }}
            >
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
