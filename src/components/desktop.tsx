
"use client";

import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

import { AppLauncher } from '@/components/app-launcher';
import { Dock } from '@/components/dock';
import { Dashboard } from './apps/dashboard';
import { Button } from './ui/button';
import { X, BrainCircuit } from 'lucide-react';

import { allApps, App, UserAppRunner } from '@/lib/apps-config';
import type { UserApp } from '@/components/apps/xenova-dev';
import { useSettings } from '@/contexts/settings-context';
import { OsSetup } from './os-setup';
import { get, set } from '@/lib/idb';
import { NovaVRLogo } from './icons/logo';
import { Progress } from './ui/progress';
import { Toaster } from './ui/toaster';
import { DesktopActionsProvider } from '@/contexts/desktop-actions-context';
import { FullscreenAppWrapper } from './fullscreen-app-wrapper';
import { SystemBar } from './system-bar';
import { SystemOverlay } from './system-overlay';
import { LoginScreen } from './login-screen';
import { LockScreen } from './lock-screen';

type SystemState = 'loading' | 'setup' | 'lock' | 'login' | 'desktop';

function DesktopContent() {
    const [systemState, setSystemState] = useState<SystemState>('loading');
    const [selectedApp, setSelectedApp] = useState<App | null>(null);
    const [selectedCommunityApp, setSelectedCommunityApp] = useState<UserApp | null>(null);
    const [isLibraryOpen, setLibraryOpen] = useState(false);
    const { uiScale } = useSettings();
    const [systemAction, setSystemAction] = useState<'shutdown' | 'restart' | null>(null);
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        if (systemState !== 'loading') return;
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
    }, [systemState]);

    useEffect(() => {
        const checkSystemState = async () => {
            const setupFlag = await get<boolean>('nova-vr-setup-complete');
            setTimeout(() => {
                if (setupFlag) {
                    setSystemState('lock');
                } else {
                    setSystemState('setup');
                }
            }, 1500);
        };
        
        if (systemState === 'loading') {
            checkSystemState();
        }
    }, [systemState]);

    const handleSetupComplete = async () => {
        await set('nova-vr-setup-complete', true);
        setSystemState('desktop');
    };

    const handleLoginSuccess = async () => {
        await set('nova-vr-setup-complete', true);
        setSystemState('desktop');
    };
    
    const handleSignOut = () => {
        setSystemState('lock');
    };

    const handleRestart = () => {
        setSystemAction('restart');
        setTimeout(() => window.location.reload(), 1500);
    };

    const handleShutdown = () => {
        setSystemAction('shutdown');
        setTimeout(() => window.close(), 1500);
    };

    const openApp = async (appName: string) => {
        const app = allApps.find(app => app.name === appName);
        if (app) {
            setSelectedCommunityApp(null);
            setSelectedApp(app);
            setLibraryOpen(false);
        } else {
            const allPublished = await get<UserApp[]>('published-apps') || [];
            const communityApp = allPublished.find(app => app.name === appName);
            if (communityApp) {
                setSelectedApp(null);
                setSelectedCommunityApp(communityApp);
                setLibraryOpen(false);
            }
        }
    }

    const closeApp = () => {
        setSelectedApp(null);
        setSelectedCommunityApp(null);
    };

    if (systemState === 'loading') {
        return (
            <div className="flex-1 flex flex-col items-center justify-center h-screen w-screen bg-background">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, ease: "easeInOut" }}
                    className="flex flex-col items-center gap-6 w-full max-w-xs"
                >
                    <NovaVRLogo className="w-24 h-24 text-primary" />
                    <Progress value={progress} className="w-full h-2" />
                </motion.div>
            </div>
        );
    }
    
    if (systemState === 'setup') {
        return <OsSetup onComplete={handleSetupComplete} onSwitchToLogin={() => setSystemState('login')} />;
    }

    if (systemState === 'lock') {
        return <LockScreen onUnlock={() => setSystemState('login')} />;
    }

    if (systemState === 'login') {
        return <LoginScreen onLoginSuccess={handleLoginSuccess} onSwitchToSignUp={() => setSystemState('setup')} />;
    }
    
    const fullscreenApps = ["Browser", "Minecraft", "Geometry Dash", "Flappy Bird", "2048", "Hextris", "PAC-MAN", "NovaVM"];
    const isFullscreenApp = selectedApp && fullscreenApps.includes(selectedApp.name);

    const renderAppContent = () => {
        if (selectedApp && !isFullscreenApp) {
            const AppContent = selectedApp.component;
            return <AppContent />;
        }
        if (selectedCommunityApp) {
            return <UserAppRunner app={selectedCommunityApp} />;
        }
        return null;
    }

    const AppWindow = () => {
        const app = selectedApp || { 
            name: selectedCommunityApp?.name, 
            icon: BrainCircuit,
            description: selectedCommunityApp?.description 
        };
        if (!app?.name) return null;

        return (
            <motion.div
                key={app.name}
                initial={{ opacity: 0, scale: 0.95, y: 50 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 50 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="w-full h-full"
            >
                <div 
                    className="w-full h-full flex flex-col bg-card/80 border border-border shadow-2xl shadow-black/30 rounded-2xl transition-[backdrop-filter] duration-300"
                    style={{ backdropFilter: 'blur(var(--ui-blur))' }}
                >
                    <header className="flex items-center justify-between p-3 pl-5 border-b border-border bg-card/50 flex-shrink-0 rounded-t-2xl">
                        <div className="flex items-center gap-3">
                            <app.icon className="w-5 h-5 text-accent" />
                            <span className="font-bold text-foreground">{app.name}</span>
                        </div>
                        <Button variant="ghost" size="icon" className="w-8 h-8 rounded-full hover:bg-white/10" onClick={closeApp}>
                            <X className="w-5 h-5" />
                        </Button>
                    </header>
                    <main className="flex-1 bg-black/10 overflow-hidden rounded-b-2xl">
                        {renderAppContent()}
                    </main>
                </div>
            </motion.div>
        )
    };

    return (
        <DesktopActionsProvider openApp={openApp}>
            <AnimatePresence>
                {systemAction && <SystemOverlay action={systemAction} />}
            </AnimatePresence>
            
            <SystemBar onSignOut={handleSignOut} onRestart={handleRestart} onShutdown={handleShutdown} />

             <AnimatePresence>
                {isFullscreenApp && selectedApp && (
                     <FullscreenAppWrapper app={selectedApp} onClose={closeApp}>
                        <selectedApp.component />
                    </FullscreenAppWrapper>
                )}
             </AnimatePresence>

             <div className="h-full w-full flex flex-col items-stretch p-2 pb-0" >
                <Toaster />
                <div 
                    className="flex-1 w-full relative"
                >
                    <div className="absolute inset-0" style={{ transform: `scale(${uiScale / 100})`, transformOrigin: 'center center', transition: 'transform 0.3s ease-out' }}>
                         <AnimatePresence>
                            {(selectedApp && !isFullscreenApp) || selectedCommunityApp ? <AppWindow /> : <Dashboard />}
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
                        {(!isLibraryOpen && !isFullscreenApp) && (
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
    return <DesktopContent />;
}
