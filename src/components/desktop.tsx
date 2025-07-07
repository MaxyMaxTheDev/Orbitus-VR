
"use client";

import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

import { AppLauncher } from '@/components/app-launcher';
import { Dock } from '@/components/dock';
import { Dashboard } from './apps/dashboard';
import { Button } from './ui/button';
import { X } from 'lucide-react';

import { allApps, type App } from '@/lib/apps-config';
import { useSettings } from '@/contexts/settings-context';
import { OsSetup } from './os-setup';
import { get, set } from '@/lib/idb';
import { XenovaVRLogo } from './icons/logo';
import { Progress } from './ui/progress';
import { Toaster } from './ui/toaster';
import { DesktopActionsProvider } from '@/contexts/desktop-actions-context';

function DesktopContent() {
    const [selectedApp, setSelectedApp] = useState<App | null>(null);
    const [isLibraryOpen, setLibraryOpen] = useState(false);
    const [isSetupComplete, setIsSetupComplete] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        const checkSetupStatus = async () => {
            const setupFlag = await get<boolean>('xenova-vr-setup-complete');
            // Add a small delay to make the boot screen visible
            setTimeout(() => {
                if (setupFlag === true) {
                    setIsSetupComplete(true);
                }
                setIsLoading(false);
            }, 1500);
        };
        checkSetupStatus();
    }, []);

    useEffect(() => {
        if (!isLoading) return;
        const interval = setInterval(() => {
            setProgress(prev => {
                if (prev >= 100) {
                    clearInterval(interval);
                    return 100;
                }
                // Update progress to fill up in 1.5 seconds
                return prev + 100 / (1500 / 50); 
            });
        }, 50);
        return () => clearInterval(interval);
    }, [isLoading]);

    const handleSetupComplete = async () => {
        await set('xenova-vr-setup-complete', true);
        setIsSetupComplete(true);
    };

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
                className="absolute inset-0 w-full h-full flex items-center justify-center z-20"
            >
                <div className="w-[98%] h-[95%] flex flex-col bg-card/80 backdrop-blur-lg border border-border rounded-2xl shadow-2xl shadow-black/30">
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
    
    if (isLoading) {
        return (
            <div className="flex-1 flex flex-col items-center justify-center h-screen w-screen bg-background">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, ease: "easeInOut" }}
                    className="flex flex-col items-center gap-6 w-full max-w-xs"
                >
                    <XenovaVRLogo className="w-24 h-24 text-primary" />
                    <Progress value={progress} className="w-full h-2" />
                </motion.div>
            </div>
        );
    }
    
    if (!isSetupComplete) {
        return <OsSetup onComplete={handleSetupComplete} />;
    }

    return (
        <DesktopActionsProvider openApp={openApp}>
            <div className="flex-1 flex flex-col items-center justify-center">
                <Toaster />
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
                <AnimatePresence>
                    {!isLibraryOpen && (
                        <motion.div
                            className="w-full flex justify-center p-3 mb-5 z-30"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 20 }}
                            transition={{ duration: 0.2 }}
                        >
                            <Dock
                                onToggleLibrary={() => setLibraryOpen(!isLibraryOpen)}
                                onOpenApp={openApp}
                            />
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </DesktopActionsProvider>
    );
}

export function Desktop() {
    return (
        <DesktopContent />
    );
}
