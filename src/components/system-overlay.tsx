
"use client";

import { motion } from 'framer-motion';
import { Power, RefreshCw } from 'lucide-react';

type SystemOverlayProps = {
    action: 'shutdown' | 'restart';
};

export function SystemOverlay({ action }: SystemOverlayProps) {
    const messages = {
        shutdown: {
            icon: <Power className="w-16 h-16" />,
            text: "Shutting Down..."
        },
        restart: {
            icon: <RefreshCw className="w-16 h-16" />,
            text: "Restarting..."
        }
    };

    const currentMessage = messages[action];

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[9998] bg-black/90 flex flex-col items-center justify-center gap-4 text-foreground"
        >
            <div className="animate-pulse">
                {currentMessage.icon}
            </div>
            <p className="text-2xl font-headline tracking-widest">{currentMessage.text}</p>
        </motion.div>
    );
}
