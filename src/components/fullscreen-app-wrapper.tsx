
"use client";

import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';
import type { App } from '@/lib/apps-config';
import { useToast } from '@/hooks/use-toast';
import { Button } from './ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';

type FullscreenAppWrapperProps = {
    app: App;
    onClose: () => void;
    children: React.ReactNode;
}

export function FullscreenAppWrapper({ app, onClose, children }: FullscreenAppWrapperProps) {
    const { toast } = useToast();

    // Keyboard Management
    useEffect(() => {
        // Restore native cursor for fullscreen apps (cross-origin iframes freeze custom cursor)
        document.documentElement.classList.add('native-cursor');

        // Show reminder toast
        toast({
            title: "Fullscreen Mode",
            description: "Press ESC or click the X in the corner to exit.",
        });

        const handleKeyDown = (e: KeyboardEvent) => {
            // Note: Games often capture focus, so this might not always fire.
            // The floating button acts as the primary reliable exit.
            if (e.key === 'Escape') {
                onClose();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        
        return () => {
            document.documentElement.classList.remove('native-cursor');
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [onClose, toast]);

    return (
        <motion.div
            key={app.name}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-40 flex flex-col bg-black"
        >
            {/* Floating Exit Button (Emergency Escape) */}
            <div className="absolute top-4 right-4 z-50">
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button 
                                variant="ghost" 
                                size="icon" 
                                onClick={onClose}
                                className="w-12 h-12 rounded-full bg-black/20 hover:bg-destructive text-white/40 hover:text-white backdrop-blur-md transition-all border border-white/10"
                            >
                                <X className="w-6 h-6" />
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent side="left">
                            <p>Exit Fullscreen</p>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            </div>

            <main className="flex-1 w-full h-full overflow-hidden bg-black">
                {children}
            </main>
        </motion.div>
    );
}
