
"use client";

import { motion } from 'framer-motion';
import { allApps, App } from '@/lib/apps-config';
import { generateAppBanner } from '@/ai/flows/generate-app-banner-flow';
import { useToast } from '@/hooks/use-toast';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useSettings } from '@/contexts/settings-context';

type AppLibraryProps = {
    onSelectApp: (appName: string) => void;
    onClose: () => void;
}

function AppCardWithBanner({ app, onSelectApp }: { app: App; onSelectApp: (appName: string) => void; }) {
    const [bannerUrl, setBannerUrl] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const { toast } = useToast();

    useEffect(() => {
        const fetchBanner = async () => {
            setIsLoading(true);
            try {
                const result = await generateAppBanner({ appName: app.name, description: app.description });
                setBannerUrl(result.imageUrl);
            } catch (error) {
                console.error(`Failed to generate banner for ${app.name}:`, error);
                const description = error instanceof Error ? error.message : 'The AI failed to generate the banner.';
                toast({
                    variant: 'destructive',
                    title: `Banner Error: ${app.name}`,
                    description,
                });
            } finally {
                setIsLoading(false);
            }
        };
        fetchBanner();
    }, [app.name, app.description, toast]);

    return (
        <div
            className="group bg-secondary/50 rounded-2xl border border-border hover:border-accent transition-all duration-300 flex flex-col overflow-hidden"
            onClick={() => onSelectApp(app.name)}
        >
            <div className={cn("relative w-full aspect-video bg-black/20 flex items-center justify-center transition-opacity duration-500",
                (isLoading || !bannerUrl) ? "opacity-100" : "opacity-0"
            )}>
                <Loader2 className="w-6 h-6 text-accent animate-spin" />
            </div>

            {bannerUrl && (
                <div className={cn("relative w-full aspect-video -mt-[100%] transition-opacity duration-1000",
                    !isLoading ? 'opacity-100' : 'opacity-0'
                )}>
                    <Image src={bannerUrl} alt={`${app.name} banner`} layout="fill" objectFit="cover" />
                </div>
            )}

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
            <div
                className="relative w-full h-full p-8 overflow-y-auto"
                onClick={stopPropagation}
            >
                <h2 className="text-3xl font-bold text-foreground/90 mb-8 px-4 text-center">App Library</h2>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6 max-w-7xl mx-auto">
                    {allApps.map((app) =>
                        showAppBanners ? (
                            <AppCardWithBanner key={app.name} app={app} onSelectApp={onSelectApp} />
                        ) : (
                            <SimpleAppIcon key={app.name} app={app} onSelectApp={onSelectApp} />
                        )
                    )}
                </div>
            </div>
        </motion.div>
    );
}
