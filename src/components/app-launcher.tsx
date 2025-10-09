
"use client";

import { motion } from 'framer-motion';
import { allApps, App } from '@/lib/apps-config';
import { generateAppBanner } from '@/ai/flows/generate-app-banner-flow';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import { Loader2, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useSettings } from '@/contexts/settings-context';
import { Button } from './ui/button';
import { get, set } from '@/lib/idb';

type AppLibraryProps = {
    onSelectApp: (appName: string) => void;
    onClose: () => void;
}

const SCULPT_VR_BANNER_URL = "https://storage.googleapis.com/aifire-app-files-public/images/sculpt-vr-banner.png";

function AppCardWithBanner({ app, onSelectApp }: { app: App; onSelectApp: (appName: string) => void; }) {
    const [bannerUrl, setBannerUrl] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchBanner = async () => {
            // Special case for SculptVR to use the static banner
            if (app.name === 'SculptVR') {
                setBannerUrl(SCULPT_VR_BANNER_URL);
                setIsLoading(false);
                return;
            }

            const cacheKey = `banner-${app.name}`;
            
            // 1. Check cache first
            const cachedUrl = await get<string>(cacheKey);
            if (cachedUrl) {
                setBannerUrl(cachedUrl);
                setIsLoading(false);
                return; // Found in cache, no need to generate
            }

            // 2. If not in cache, start loading and generate
            setIsLoading(true);
            setError(null);
            try {
                const result = await generateAppBanner({ appName: app.name, description: app.description });
                setBannerUrl(result.imageUrl);

                // 3. Save to cache for next time
                await set(cacheKey, result.imageUrl);
                
            } catch (e: any) {
                setError(e.message || 'The AI failed to generate the banner.');
            } finally {
                setIsLoading(false);
            }
        };
        fetchBanner();
    }, [app.name, app.description]);

    return (
        <div
            className="group bg-secondary/50 rounded-2xl border border-border hover:border-accent transition-all duration-300 flex flex-col overflow-hidden"
            onClick={() => onSelectApp(app.name)}
        >
            <div className="relative w-full aspect-video bg-black/20 flex items-center justify-center text-center">
                {/* Loading State */}
                <div className={cn(
                    "absolute inset-0 flex items-center justify-center transition-opacity duration-500",
                    isLoading ? "opacity-100" : "opacity-0 pointer-events-none"
                )}>
                    <Loader2 className="w-6 h-6 text-accent animate-spin" />
                </div>

                {/* Banner Image State */}
                {bannerUrl && (
                    <div className={cn(
                        "absolute inset-0 transition-opacity duration-1000",
                        !isLoading ? "opacity-100" : "opacity-0 pointer-events-none"
                    )}>
                        <Image src={bannerUrl} alt={`${app.name} banner`} layout="fill" objectFit="cover" />
                    </div>
                )}

                {/* Error State (only shows if there's no bannerUrl) */}
                {error && !bannerUrl && (
                     <div className={cn(
                        "absolute inset-0 flex items-center justify-center p-4 transition-opacity duration-1000",
                        !isLoading ? "opacity-100" : "opacity-0 pointer-events-none"
                    )}>
                        <p className="text-xs bg-destructive text-destructive-foreground p-2 rounded-md">{error}</p>
                    </div>
                )}
            </div>

            <div className="flex items-center gap-4 p-4">
                <div className="w-12 h-12 rounded-lg bg-black/30 flex items-center justify-center flex-shrink-0">
                    <app.icon className="w-6 h-6 text-foreground/80" />
                </div>
                <span className="font-bold text-foreground/90 truncate">{app.name}</span>
            </div>
        </div>
    );
}

function SimpleAppIcon({ app, onSelectApp }: { app: App; onSelectApp: (appName: string) => void; }) {
    return (
        <div
            className="flex flex-col items-center justify-center gap-3 group cursor-pointer aspect-square bg-secondary/50 rounded-2xl border border-border hover:border-accent transition-all duration-300"
            onClick={() => onSelectApp(app.name)}
        >
            <div className="w-20 h-20 rounded-2xl bg-black/20 group-hover:bg-primary transition-colors flex items-center justify-center border border-transparent group-hover:border-accent">
                <app.icon className="w-10 h-10 text-foreground/80 group-hover:text-primary-foreground" />
            </div>
            <span className="text-sm text-foreground/80 truncate">{app.name}</span>
        </div>
    );
}

export function AppLauncher({ onSelectApp, onClose }: AppLibraryProps) {
    const { showAppBanners } = useSettings();
    const [displayedApps, setDisplayedApps] = useState<App[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    // This effect runs when the launcher is opened to check which apps are installed.
    useEffect(() => {
        const loadInstallableApps = async () => {
            const isMinecraftInstalled = await get<boolean>('minecraft-installed');
            
            const filteredApps = allApps.filter(app => {
                // If an app is installable, only show it if its flag is true in the DB.
                if (app.isInstallable) {
                    if (app.name === 'Minecraft') {
                        return isMinecraftInstalled;
                    }
                    return false; // Hide other potential installable apps by default
                }
                // Always show regular, non-installable apps.
                return true; 
            });

            setDisplayedApps(filteredApps);
            setIsLoading(false);
        };

        loadInstallableApps();
    }, []);

    const stopPropagation = (e: React.MouseEvent) => {
        e.stopPropagation();
    }

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="absolute inset-0 z-20 bg-card/90 backdrop-blur-2xl"
            onClick={onClose}
        >
             <Button variant="ghost" size="icon" className="absolute top-4 right-4 z-30 w-12 h-12 rounded-full hover:bg-white/10" onClick={onClose}>
                <X className="w-8 h-8" />
            </Button>

            <div
                className="relative w-full h-full p-8 overflow-y-auto"
                onClick={stopPropagation}
            >
                <h2 className="text-3xl font-bold text-foreground/90 mb-8 px-4 text-center">App Library</h2>
                 {isLoading ? (
                    <div className="flex justify-center items-center h-64">
                        <Loader2 className="w-8 h-8 animate-spin text-accent" />
                    </div>
                 ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6 max-w-7xl mx-auto">
                        {displayedApps.map((app) =>
                            showAppBanners ? (
                                <AppCardWithBanner key={app.name} app={app} onSelectApp={onSelectApp} />
                            ) : (
                                <SimpleAppIcon key={app.name} app={app} onSelectApp={onSelectApp} />
                            )
                        )}
                    </div>
                 )}
            </div>
        </motion.div>
    );
}
