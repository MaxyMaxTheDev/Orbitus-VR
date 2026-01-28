
"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from './ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';
import { LogOut, Power, RefreshCw } from 'lucide-react';
import { useSettings } from '@/contexts/settings-context';
import { MusicControls } from './music-controls';
import { useMusicPlayer } from '@/contexts/music-player-context';

type SystemBarProps = {
    onSignOut: () => void;
    onRestart: () => void;
    onShutdown: () => void;
};

export function SystemBar({ onSignOut, onRestart, onShutdown }: SystemBarProps) {
    const { username } = useSettings();
    const [isHovering, setIsHovering] = useState(false);
    const { hasPlayed } = useMusicPlayer();

    return (
        <TooltipProvider>
            {/* Invisible trigger zone at the top-center of the screen */}
            <div
                className="fixed top-0 left-1/2 -translate-x-1/2 h-2 w-32 z-50"
                onMouseEnter={() => setIsHovering(true)}
            />
            
            {/* The container for the menu, which hides it when the mouse leaves */}
            <div
                className="fixed top-0 left-0 right-0 flex justify-center pointer-events-none"
                onMouseLeave={() => setIsHovering(false)}
            >
                <motion.div
                    className="absolute top-0 pointer-events-auto"
                    initial={{ y: '-100%', opacity: 0 }}
                    animate={{ y: isHovering ? 0 : '-100%', opacity: isHovering ? 1 : 0 }}
                    transition={{ duration: 0.3, ease: 'easeInOut' }}
                >
                    <div className="grid grid-cols-[minmax(0,_1fr)_auto_minmax(0,_1fr)] items-center gap-8 bg-card/80 backdrop-blur-xl border border-border rounded-b-2xl p-2 px-6 shadow-2xl shadow-black/20">
                        <div className="flex justify-end">
                            {hasPlayed && <MusicControls />}
                        </div>
                        
                        <div className="flex flex-col items-center">
                            <span className="text-sm font-bold text-foreground/80">{username}</span>
                            <div className="flex items-center gap-2">
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Button variant="ghost" size="icon" onClick={onSignOut} className="w-10 h-10 rounded-full text-foreground/80 hover:bg-primary/20 hover:text-primary">
                                            <LogOut />
                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p>Sign Out</p>
                                    </TooltipContent>
                                </Tooltip>

                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Button variant="ghost" size="icon" onClick={onRestart} className="w-10 h-10 rounded-full text-foreground/80 hover:bg-primary/20 hover:text-primary">
                                            <RefreshCw />
                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p>Restart</p>
                                    </TooltipContent>
                                </Tooltip>

                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Button variant="ghost" size="icon" onClick={onShutdown} className="w-10 h-10 rounded-full text-foreground/80 hover:bg-destructive/20 hover:text-destructive">
                                            <Power />
                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p>Power Off</p>
                                    </TooltipContent>
                                </Tooltip>
                            </div>
                        </div>

                        <div></div>
                    </div>
                </motion.div>
            </div>
        </TooltipProvider>
    );
}
