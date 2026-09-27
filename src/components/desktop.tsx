"use client";

import { useState, useEffect, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

import { AppLauncher } from '@/components/app-launcher';
import { Dock } from '@/components/dock';
import { Dashboard } from './apps/dashboard';
import { Button } from './ui/button';
import { X, BrainCircuit, RefreshCw } from 'lucide-react';

import { allApps, App, UserAppRunner } from '@/lib/apps-config';
import type { UserApp } from '@/components/apps/xenova-dev';
import { useSettings } from '@/contexts/settings-context';
import { OsSetup } from './os-setup';
import { get, set, del } from '@/lib/idb';
import { OrbitusVRLogo } from './icons/logo';
import { Progress } from './ui/progress';
import { Toaster } from './ui/toaster';
import { DesktopActionsProvider } from '@/contexts/desktop-actions-context';
import { UpdateProvider } from '@/contexts/update-context';
import {
  completeUpdate,
  getPendingBuildId,
  getUpdateDuration,
  getUpdateStartedAt,
  isUpdateInProgress,
  markUpdateAttemptStarted,
  resetUpdateAttempt,
  UPDATE_VERIFY_TIMEOUT_MS,
} from '@/lib/update-state';
import { FullscreenAppWrapper } from './fullscreen-app-wrapper';
import { SystemBar } from './system-bar';
import { SystemOverlay } from './system-overlay';
import { LoginScreen } from './login-screen';
import { LockScreen } from './lock-screen';
import { useAuth } from '@/contexts/auth-context';
import { signOut } from '@/lib/local-auth';

type SystemState = 'loading' | 'setup' | 'lock' | 'login' | 'desktop';
type BootPhase = 'checking' | 'normal' | 'updating' | 'failed';

function DesktopContent() {
    const [systemState, setSystemState] = useState<SystemState>('loading');
    const [selectedApp, setSelectedApp] = useState<App | null>(null);
    const [selectedCommunityApp, setSelectedCommunityApp] = useState<UserApp | null>(null);
    const [isLibraryOpen, setLibraryOpen] = useState(false);
    const { uiScale } = useSettings();
    const [systemAction, setSystemAction] = useState<'shutdown' | 'restart' | null>(null);
    const [progress, setProgress] = useState(0);
    const [bootPhase, setBootPhase] = useState<BootPhase>('checking');
    const [isVerifying, setIsVerifying] = useState(false);
    const { currentUser, isLoading: isAuthLoading } = useAuth();
    const { username, setUsername } = useSettings();

    // Local accounts live in this browser's IndexedDB, so identity resolves
    // from the session without any server round trip.
    const enterShell = useCallback(async () => {
        const setupFlag = await get<boolean>('orbitus-vr-setup-complete');
        setSystemState(setupFlag ? 'lock' : 'setup');
    }, []);

    useEffect(() => {
        if (isAuthLoading) return;
        enterShell();
    }, [isAuthLoading, enterShell]);

    // Adopt the account's display name until the user picks their own.
    useEffect(() => {
        if (currentUser && username === 'User') {
            setUsername(currentUser.displayName);
        }
    }, [currentUser, username, setUsername]);

    // Resolve whether this boot is a normal boot, the start of an update, or an
    // update that was interrupted by a refresh.
    useEffect(() => {
        if (!isUpdateInProgress()) {
            setBootPhase('normal');
            return;
        }
        if (getUpdateStartedAt() !== null) {
            setBootPhase('failed');
            return;
        }
        markUpdateAttemptStarted();
        setBootPhase('updating');
    }, []);

    useEffect(() => {
        if (bootPhase !== 'normal') return;
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
    }, [bootPhase]);

    useEffect(() => {
        if (bootPhase !== 'normal') return;
        const timeout = setTimeout(() => {
            enterShell();
        }, 1500);
        return () => clearTimeout(timeout);
    }, [bootPhase, enterShell]);

    useEffect(() => {
        if (bootPhase !== 'updating') return;

        const startedAt = getUpdateStartedAt() ?? Date.now();
        const duration = getUpdateDuration();

        const tick = () => {
            const elapsed = Date.now() - startedAt;
            if (elapsed >= duration) {
                setProgress(100);
                setIsVerifying(true);
                return;
            }
            setProgress((elapsed / duration) * 100);
        };

        tick();
        const interval = setInterval(tick, 250);
        return () => clearInterval(interval);
    }, [bootPhase]);

    // The timed window is a minimum, not a guarantee: keep waiting until the
    // target build is actually the one being served, so we never drop the user
    // into the desktop still running the old deployment.
    useEffect(() => {
        if (bootPhase !== 'updating' || !isVerifying) return;

        const targetBuildId = getPendingBuildId();
        // Nothing to verify against (non-Vercel host); the timed window suffices.
        if (!targetBuildId) {
            completeUpdate();
            enterShell();
            return;
        }

        let settled = false;
        const finish = () => {
            if (settled) return;
            settled = true;
            completeUpdate();
            enterShell();
        };
        const fail = () => {
            if (settled) return;
            settled = true;
            setBootPhase('failed');
        };

        const verify = async () => {
            try {
                const response = await fetch('/api/deployment', { cache: 'no-store' });
                if (!response.ok) return;
                const data: { buildId?: string | null } = await response.json();
                if (data.buildId?.trim() === targetBuildId) {
                    finish();
                }
            } catch {
                // Transient network failure; the next tick retries.
            }
        };

        verify();
        const interval = setInterval(verify, 5000);
        const timeout = setTimeout(fail, UPDATE_VERIFY_TIMEOUT_MS);
        return () => {
            clearInterval(interval);
            clearTimeout(timeout);
        };
    }, [bootPhase, isVerifying, enterShell]);

    const handleRetryUpdate = () => {
        resetUpdateAttempt();
        window.location.reload();
    };

    // Setup always runs, so finishing it hands off to the passcode gate: the
    const handleSetupComplete = async () => {
        await set('orbitus-vr-setup-complete', true);
        setSystemState('desktop');
    };

    // Signing in also counts as having been through setup, so the wizard does
    // not come back on the next refresh.
    const handleLoginSuccess = async () => {
        await set('orbitus-vr-setup-complete', true);
        setSystemState('desktop');
    };

    // Drops the local session and returns to the lockscreen, which is where a
    // refresh with a session also lands.
    const handleSignOut = async () => {
        await signOut();
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
        if (bootPhase === 'failed') {
            return (
                <div className="flex-1 flex flex-col items-center justify-center h-screen w-screen bg-background">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1, ease: "easeInOut" }}
                        className="flex flex-col items-center gap-6 w-full max-w-xs text-center"
                    >
                        <OrbitusVRLogo className="w-24 h-24 text-primary" />
                        <p className="text-xl font-headline tracking-wider text-destructive">
                            Update failed.
                        </p>
                        <p className="text-sm text-muted-foreground">
                            The update did not finish. It may have been interrupted, or the
                            new version is not available yet.
                        </p>
                        <Button size="lg" className="w-full" onClick={handleRetryUpdate}>
                            <RefreshCw className="mr-2" />
                            Retry
                        </Button>
                    </motion.div>
                </div>
            );
        }

        return (
            <div className="flex-1 flex flex-col items-center justify-center h-screen w-screen bg-background">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, ease: "easeInOut" }}
                    className="flex flex-col items-center gap-6 w-full max-w-xs"
                >
                    <OrbitusVRLogo className="w-24 h-24 text-primary" />
                    <Progress value={progress} className="w-full h-2" />
                    {bootPhase === 'updating' && (
                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="text-sm font-headline tracking-[0.3em] text-muted-foreground"
                        >
                            {isVerifying ? 'Finishing update...' : 'Updating...'}
                        </motion.p>
                    )}
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
    
    const fullscreenApps = ["Browser", "Minecraft", "Geometry Dash", "Flappy Bird", "2048", "Hextris", "PAC-MAN", "OrbitusVM"];
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
            <UpdateProvider>
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
            </UpdateProvider>
        </DesktopActionsProvider>
    );
}

export function Desktop() {
    return <DesktopContent />;
}
