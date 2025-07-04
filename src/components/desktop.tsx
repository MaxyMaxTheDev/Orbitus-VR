
"use client";

import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

import { AppLauncher } from '@/components/app-launcher';
import { Dock } from '@/components/dock';
import { Dashboard } from './apps/dashboard';
import { Button } from './ui/button';
import { X } from 'lucide-react';

import { allApps, type App } from '@/lib/apps-config';
import { SettingsProvider } from '@/contexts/settings-context';

export function Desktop() {
    const [selectedApp, setSelectedApp] = useState<App | null>(null);
    const [isLibraryOpen, setLibraryOpen] = useState(false);

    const openApp = (appName: string) => {
        const app = allApps.find(app => app.name === appName);
        if (app) {
            setSelectedApp(app);
            setLibraryOpen(false);
        }
    }

    const closeApp = () => {
        setSelectedApp(null);
    };

    const AppWindow = () => {
        if (!selectedApp) return null;

        const AppContent = selectedApp.component;

        return (
            <motion.div
                key={selectedApp.name}
                initial={{ opacity: 0, scale: 0.95, y: 50 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 50 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="absolute inset-0 w-full h-full flex items-center justify-center p-8 md:p-16 z-20"
            >
                <div className="w-full h-full flex flex-col bg-card/80 backdrop-blur-lg border border-border rounded-2xl shadow-2xl shadow-black/30">
                    <header className="flex items-center justify-between p-3 pl-5 border-b border-border bg-card/50 rounded-t-2xl flex-shrink-0">
                        <div className="flex items-center gap-3">
                            <selectedApp.icon className="w-5 h-5 text-accent" />
                            <span className="font-bold text-foreground">{selectedApp.name}</span>
                        </div>
                        <Button variant="ghost" size="icon" className="w-8 h-8 rounded-full hover:bg-white/10" onClick={closeApp}>
                            <X className="w-5 h-5" />
                        </Button>
                    </header>
                    <main className="flex-1 bg-black/10 overflow-hidden rounded-b-2xl">
                        <AppContent />
                    </main>
                </div>
            </motion.div>
        )
    };

    return (
        <SettingsProvider>
            <div className="flex-1 flex flex-col items-center justify-center">
                {/* Main Content Area */}
                <div className="flex-1 w-full relative">
                    <AnimatePresence>
                        {selectedApp ? <AppWindow /> : <Dashboard />}
                    </AnimatePresence>
                </div>

                {/* App Library Overlay */}
                <AnimatePresence>
                    {isLibraryOpen && (
                        <AppLauncher
                            onSelectApp={openApp}
                            onClose={() => setLibraryOpen(false)}
                        />
                    )}
                </AnimatePresence>

                {/* Dock */}
                <Dock
                    onToggleLibrary={() => setLibraryOpen(!isLibraryOpen)}
                    onOpenApp={openApp}
                />
            </div>
        </SettingsProvider>
    );
}
