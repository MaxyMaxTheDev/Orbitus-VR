
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
import { cn } from '@/lib/utils';
import { Browser } from './apps/browser';
import { SystemBar } from './system-bar';
import { SystemOverlay } from './system-overlay';
import { LoginScreen } from './login-screen';

function DesktopContent() {
    const [selectedApp, setSelectedApp] = useState<App | null>(null);
    const [isLibraryOpen, setLibraryOpen] = useState(false);
    const [isSetupComplete, setIsSetupComplete] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [progress, setProgress] = useState(0);
    const { uiScale } = useSettings();
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [systemAction, setSystemAction] = useState<'shutdown' | 'restart' | null>(null);
    const [showLoginScreen, setShowLoginScreen] = useState(false);

    useEffect(() => {
        const checkSystemState = async () => {
            const setupFlag = await get<boolean>('xenova-vr-setup-complete');
            
            setTimeout(() => {
                if (setupFlag) {
                    setIsSetupComplete(true);
                    // If setup is done, default to showing the login screen.
                    setShowLoginScreen(true);
                }
                setIsLoading(false);
            }, 1500);
        };
        checkSystemState();
    }, []);

    useEffect(() => {
        if (!isLoading) return;
        const interval = setInterval(() => {
            setProgress(prev => {
                if (prev >= 100) {
                    clearInterval(interval);
                    return 100;
                }
                return prev + 100 / (1500 / 50); 
            });
        }, 50);
        return () => clearInterval(interval);
    }, [isLoading]);

    const handleSetupComplete = async () => {
        await set('xenova-vr-setup-complete', true);
        setIsSetupComplete(true);
        setIsLoggedIn(true);
    };

    const handleLoginSuccess = async () => {
        setIsLoggedIn(true);
    };
    
    const handleSignOut = async () => {
        setIsLoggedIn(false);
        setShowLoginScreen(true); // Always go to login screen on sign out.
    };

    const handleRestart = () => {
        setSystemAction('restart');
        setTimeout(() => window.location.reload(), 1500);
    };

    const handleShutdown = () => {
        setSystemAction('shutdown');
        setTimeout(() => window.close(), 1500);
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
        
        if (selectedApp.name === "Browser") {
            return null;
        }

        return (
            <motion.div
                key={selectedApp.name}
                initial={{ opacity: 0, scale: 0.95, y: 50 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 50 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="w-full h-full"
            >
                <div className="w-full h-full flex flex-col bg-card/80 backdrop-blur-lg border border-border shadow-2xl shadow-black/30 rounded-2xl">
                    <header className="flex items-center justify-between p-3 pl-5 border-b border-border bg-card/50 flex-shrink-0 rounded-t-2xl">
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
    
    if (!isSetupComplete || !isLoggedIn) {
        if (showLoginScreen) {
             return <LoginScreen onLoginSuccess={handleLoginSuccess} onSwitchToSignUp={() => setShowLoginScreen(false)} />;
        }
        return <OsSetup onComplete={handleSetupComplete} onSwitchToLogin={() => setShowLoginScreen(true)} />;
    }
    
    const isBrowserOpen = selectedApp?.name === "Browser";

    return (
        <DesktopActionsProvider openApp={openApp}>
            <AnimatePresence>
                {systemAction && <SystemOverlay action={systemAction} />}
            </AnimatePresence>
            
            <SystemBar onSignOut={handleSignOut} onRestart={handleRestart} onShutdown={handleShutdown} />

             <AnimatePresence>
                {isBrowserOpen && selectedApp && (
                     <motion.div
                        key="browser-fullscreen"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="fixed inset-0 z-40 flex flex-col bg-card"
                    >
                        <header className="flex items-center justify-between p-3 pl-5 border-b border-border bg-card/50 flex-shrink-0">
                            <div className="flex items-center gap-3">
                                <selectedApp.icon className="w-5 h-5 text-accent" />
                                <span className="font-bold text-foreground">{selectedApp.name}</span>
                            </div>
                            <Button variant="ghost" size="icon" className="w-8 h-8 rounded-full hover:bg-white/10" onClick={closeApp}>
                                <X className="w-5 h-5" />
                            </Button>
                        </header>
                        <main className="flex-1 bg-black/10 overflow-hidden">
                           <Browser />
                        </main>
                    </motion.div>
                )}
             </AnimatePresence>

             <div className="h-full w-full flex flex-col items-stretch p-2 pb-0" >
                <Toaster />
                <div 
                    className="flex-1 w-full relative"
                >
                    <div className="absolute inset-0" style={{ transform: `scale(${uiScale / 100})`, transformOrigin: 'center center', transition: 'transform 0.3s ease-out' }}>
                         <AnimatePresence>
                            {selectedApp && !isBrowserOpen ? <AppWindow /> : <Dashboard />}
                        </AnimatePresence>
                    </div>
                </div>
                <AnimatePresence>
                    {isLibraryOpen && (
                        <AppLauncher
                            onSelectApp={openApp}
                            onClose={() => setLibraryOpen(false)}
                        />
                    )}
                </AnimatePresence>
                <div className="flex-shrink-0 relative z-30 h-24 flex items-center justify-center">
                     <AnimatePresence>
                        {(!isLibraryOpen && !isBrowserOpen) && (
                            <motion.div
                                className="w-full flex justify-center"
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
            </div>
        </DesktopActionsProvider>
    );
}

export function Desktop() {
    return (
        <DesktopContent />
    );
}
