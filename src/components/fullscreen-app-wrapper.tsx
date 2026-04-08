
"use client";

import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Keyboard } from 'lucide-react';
import type { App } from '@/lib/apps-config';
import { useToast } from '@/hooks/use-toast';

type FullscreenAppWrapperProps = {
    app: App;
    onClose: () => void;
    children: React.ReactNode;
}

export function FullscreenAppWrapper({ app, onClose, children }: FullscreenAppWrapperProps) {
    const { toast } = useToast();

    // Keyboard and Cursor Management
    useEffect(() => {
        // Restore native cursor for fullscreen apps (cross-origin iframes freeze custom cursor)
        document.documentElement.classList.add('native-cursor');

        // Show reminder toast
        toast({
            title: "Fullscreen Mode",
            description: "Press ESC to exit fullscreen apps.",
        });

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
            <main className="flex-1 w-full h-full overflow-hidden bg-black">
                {children}
            </main>
        </motion.div>
    );
}
