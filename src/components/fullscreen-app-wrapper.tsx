"use client";

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from './ui/button';
import { X, Keyboard } from 'lucide-react';
import type { App } from '@/lib/apps-config';

type FullscreenAppWrapperProps = {
    app: App;
    onClose: () => void;
    children: React.ReactNode;
}

export function FullscreenAppWrapper({ app, onClose, children }: FullscreenAppWrapperProps) {
    const [isHovering, setIsHovering] = useState(false);

    // Keyboard and Cursor Management
    useEffect(() => {
        // Restore native cursor for fullscreen apps (cross-origin iframes freeze custom cursor)
        document.documentElement.classList.add('native-cursor');

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                onClose();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        
        return () => {
            document.documentElement.classList.remove('native-cursor');
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [onClose]);

    return (
        <motion.div
            key={app.name}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-40 flex flex-col bg-black"
            onMouseLeave={() => setIsHovering(false)}
        >
            {/* Extended Trigger Zone */}
            <div 
                className="absolute top-0 left-0 right-0 h-16 z-50 cursor-pointer"
                onMouseEnter={() => setIsHovering(true)}
            />

            <motion.header 
                className="absolute top-0 left-0 right-0 z-[60] flex items-center justify-between p-3 pl-5 bg-card/90 backdrop-blur-md border-b border-border shadow-2xl"
                initial={{ y: '-100%' }}
                animate={{ y: isHovering ? 0 : '-100%' }}
                transition={{ duration: 0.3, ease: 'easeInOut' }}
            >
                <div className="flex items-center gap-6">
                    <div className="flex items-center gap-3">
                        <app.icon className="w-5 h-5 text-accent" />
                        <span className="font-bold text-foreground">{app.name}</span>
                    </div>
                    <div className="hidden sm:flex items-center gap-2 px-3 py-1 bg-black/20 rounded-full text-[10px] text-muted-foreground uppercase tracking-widest font-bold border border-white/5">
                        <Keyboard className="w-3 h-3"/>
                        Press ESC to Exit
                    </div>
                </div>
                <Button variant="ghost" size="icon" className="w-10 h-10 rounded-full hover:bg-destructive/20 hover:text-destructive" onClick={onClose}>
                    <X className="w-6 h-6" />
                </Button>
            </motion.header>

            <main className="flex-1 w-full h-full overflow-hidden bg-black">
                {children}
            </main>
        </motion.div>
    );
}
