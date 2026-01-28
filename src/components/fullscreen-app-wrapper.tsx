
"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from './ui/button';
import { X } from 'lucide-react';
import type { App } from '@/lib/apps-config';

type FullscreenAppWrapperProps = {
    app: App;
    onClose: () => void;
    children: React.ReactNode;
}

export function FullscreenAppWrapper({ app, onClose, children }: FullscreenAppWrapperProps) {
    const [isHovering, setIsHovering] = useState(false);

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
            <div 
                className="absolute top-0 left-0 right-0 h-12"
                onMouseEnter={() => setIsHovering(true)}
            />
            <motion.header 
                className="absolute top-0 left-0 right-0 z-10 flex items-center justify-between p-3 pl-5 bg-card/80 backdrop-blur-md"
                initial={{ y: '-100%' }}
                animate={{ y: isHovering ? 0 : '-100%' }}
                transition={{ duration: 0.3, ease: 'easeInOut' }}
            >
                <div className="flex items-center gap-3">
                    <app.icon className="w-5 h-5 text-accent" />
                    <span className="font-bold text-foreground">{app.name}</span>
                </div>
                <Button variant="ghost" size="icon" className="w-8 h-8 rounded-full hover:bg-white/10" onClick={onClose}>
                    <X className="w-5 h-5" />
                </Button>
            </motion.header>
            <main className="flex-1 w-full h-full overflow-hidden">
                {children}
            </main>
        </motion.div>
    );
}
