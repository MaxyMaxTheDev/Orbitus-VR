"use client";

import { motion } from 'framer-motion';
import { allApps } from '@/lib/apps-config';

type AppLibraryProps = {
    onSelectApp: (appName: string) => void;
    onClose: () => void;
}

export function AppLauncher({ onSelectApp, onClose }: AppLibraryProps) {
    return (
        <>
            {/* Backdrop */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-black/50 z-20"
                onClick={onClose}
            />

            {/* Library Panel */}
            <motion.div
                initial={{ y: "100%", opacity: 0.8 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: "100%", opacity: 0.8 }}
                transition={{ duration: 0.3, ease: 'easeInOut' }}
                className="absolute bottom-0 left-0 right-0 w-full h-[70vh] max-w-7xl mx-auto z-30 flex flex-col items-center"
            >
                <div className="w-full h-full bg-card/80 backdrop-blur-2xl border-t border-x border-border rounded-t-2xl p-8">
                    <h2 className="text-2xl font-bold text-foreground/90 mb-6 px-4">App Library</h2>
                    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-6">
                        {allApps.map((app) => (
                            <div
                                key={app.name}
                                className="flex flex-col items-center gap-2 group"
                                onClick={() => onSelectApp(app.name)}
                            >
                                <div className="w-20 h-20 rounded-2xl bg-secondary group-hover:bg-primary transition-colors flex items-center justify-center">
                                    <app.icon className="w-10 h-10 text-foreground/80 group-hover:text-primary-foreground" />
                                </div>
                                <span className="text-sm text-foreground/80 truncate">{app.name}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </motion.div>
        </>
    );
}
