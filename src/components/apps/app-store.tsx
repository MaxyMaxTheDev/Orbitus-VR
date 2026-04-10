"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { get, set } from '@/lib/idb';
import { 
    Blocks, Download, Trash2, Loader2, CheckCircle, 
    BrainCircuit, User, Gamepad, Bird, Hash, 
    Hexagon, Layers, Ghost 
} from 'lucide-react';
import Image from 'next/image';
import { ScrollArea } from '../ui/scroll-area';
import { generateAppBanner } from '@/ai/flows/generate-app-banner-flow';
import type { UserApp } from './xenova-dev';
import type { LucideIcon } from 'lucide-react';

type FeaturedApp = {
    id: string;
    name: string;
    description: string;
    icon: LucideIcon;
};

const featuredApps: FeaturedApp[] = [
    {
        id: 'minecraft',
        name: 'Minecraft',
        description: 'The classic block-building adventure. Explore infinite worlds and build everything from the simplest of homes to the grandest of castles.',
        icon: Blocks,
    },
    {
        id: 'geometry dash',
        name: 'Geometry Dash',
        description: 'Jump and fly your way through danger in this rhythm-based action platformer! Prepare for a near impossible challenge in the world of Geometry Dash.',
        icon: Gamepad,
    },
    {
        id: 'hextris',
        name: 'Hextris',
        description: 'A fast-paced hexagonal puzzle game inspired by Tetris. Rotate the hexagon to match colored blocks and prevent them from reaching the outer edge.',
        icon: Hexagon,
    },
    {
        id: 'pac-man',
        name: 'PAC-MAN',
        description: 'Relive the golden age of arcade gaming. Navigate the maze, eat all the pellets, and avoid the ghosts in this faithful recreation.',
        icon: Ghost,
    },
    {
        id: 'flappy bird',
        name: 'Flappy Bird',
        description: 'The legendary bird-flapping challenge. Simple to play, impossible to master. Can you beat your friends\' high scores?',
        icon: Bird,
    },
    {
        id: '2048',
        name: '2048',
        description: 'The classic addictive number puzzle game. Join the numbers and get to the 2048 tile!',
        icon: Hash,
    },
    {
        id: 'xenovadev',
        name: 'XenovaDEV',
        description: 'Create your own apps for XenovaVR using AI or by writing code, and publish them to the App Store for everyone to use.',
        icon: BrainCircuit,
    }
];

function FeaturedAppBanner({ appName, description }: { appName: string; description: string }) {
    const [bannerUrl, setBannerUrl] = useState('');
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchBanner = async () => {
            const cacheKey = `store-banner-${appName}`;
            const cached = await get<string>(cacheKey);
            
            if (cached) {
                setBannerUrl(cached);
                setIsLoading(false);
                return;
            }

            try {
                const result = await generateAppBanner({ appName, description });
                setBannerUrl(result.imageUrl);
                await set(cacheKey, result.imageUrl);
            } catch (e) {
                console.error("Failed to generate store banner:", e);
            } finally {
                setIsLoading(false);
            }
        };
        fetchBanner();
    }, [appName, description]);

    if (isLoading) {
        return (
            <div className="w-full h-full flex items-center justify-center bg-black/20 rounded-md">
                <Loader2 className="w-8 h-8 animate-spin text-accent/50" />
            </div>
        );
    }

    return (
        <div className="relative w-full h-full">
            <Image
                src={bannerUrl}
                alt={appName}
                fill
                className="rounded-md object-cover"
            />
        </div>
    );
}

export function AppStore() {
  const [installedApps, setInstalledApps] = useState<string[]>([]);
  const [installingAppId, setInstallingAppId] = useState<string | null>(null);
  const [installProgress, setInstallProgress] = useState(0);
  const [isLoadingState, setIsLoadingState] = useState(true);
  const [publishedApps, setPublishedApps] = useState<UserApp[]>([]);

  const { toast } = useToast();
  
  useEffect(() => {
    const checkInstallationStatus = async () => {
      setIsLoadingState(true);
      try {
        const installed = await get<string[]>('installed-apps');
        if (installed) {
          setInstalledApps(installed);
        }
        const apps = await get<UserApp[]>('published-apps');
        if (apps) {
          setPublishedApps(apps);
        }
      } catch (e) {
        console.error("Failed to load app store data", e);
      } finally {
        setIsLoadingState(false);
      }
    };
    checkInstallationStatus();
  }, []);

  const handleInstall = (app: {id: string, name: string}) => {
    setInstallingAppId(app.id);
    setInstallProgress(0);

    const interval = setInterval(() => {
      setInstallProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          
          const newInstalledApps = [...installedApps, app.id];
          setInstalledApps(newInstalledApps);
          set('installed-apps', newInstalledApps);

          setInstallingAppId(null);
          
          setTimeout(() => {
            toast({
              icon: <CheckCircle className="h-5 w-5 text-green-500" />,
              title: "Installation Complete",
              description: `${app.name} has been added to your app library.`,
            });
          }, 0);

          return 100;
        }
        return prev + 10;
      });
    }, 200);
  };

  const handleUninstall = (app: {id: string, name: string}) => {
    const newInstalledApps = installedApps.filter(id => id !== app.id);
    setInstalledApps(newInstalledApps);
    set('installed-apps', newInstalledApps);

    toast({
      icon: <Trash2 className="h-5 w-5" />,
      title: "Uninstalled",
      description: `${app.name} has been removed from your app library.`,
      variant: "destructive"
    });
  };

  const isInstalling = (appId: string) => installingAppId === appId;
  const isInstalled = (appId: string) => installedApps.includes(appId);

  const FeaturedAppCard = ({ app }: { app: FeaturedApp }) => {
    const AppIcon = app.icon;
    const installableApp = { id: app.id, name: app.name };
    
    return (
        <Card className="bg-transparent border-primary/30 grid grid-cols-1 md:grid-cols-3 overflow-hidden shadow-lg shadow-black/20 min-h-[300px]">
            <div className="md:col-span-1 bg-black/20 p-4 flex items-center justify-center aspect-video md:aspect-auto">
                <FeaturedAppBanner appName={app.name} description={app.description} />
            </div>
            <div className="md:col-span-2 p-6 flex flex-col justify-between">
                <div>
                    <CardHeader className="p-0">
                        <CardTitle className="text-2xl font-bold flex items-center gap-3"><AppIcon/> {app.name}</CardTitle>
                    </CardHeader>
                    <CardContent className="p-0 mt-4">
                        <CardDescription className="text-base text-foreground/80">
                            {app.description}
                        </CardDescription>
                    </CardContent>
                </div>

                <div className="mt-6">
                    {isInstalling(installableApp.id) ? (
                        <div className="space-y-2">
                            <Progress value={installProgress} className="w-full" />
                            <p className="text-sm text-center text-accent">Installing...</p>
                        </div>
                    ) : isInstalled(installableApp.id) ? (
                        <Button onClick={() => handleUninstall(installableApp)} size="lg" variant="outline" className="w-full hover:bg-destructive/20 hover:text-destructive hover:border-destructive">
                            <Trash2 className="mr-2" />
                            Uninstall
                        </Button>
                    ) : (
                        <Button onClick={() => handleInstall(installableApp)} size="lg" className="w-full bg-accent hover:bg-accent/80">
                            <Download className="mr-2" />
                            Install
                        </Button>
                    )}
                </div>
            </div>
        </Card>
    );
  }

  return (
    <div className="h-full w-full p-4 sm:p-6 flex justify-center bg-black/20">
      <ScrollArea className="h-full w-full max-w-4xl">
        <div className="space-y-8 pr-4">
          <h1 className="text-3xl font-bold text-center font-headline tracking-wider text-accent">App Store</h1>
          
          {isLoadingState ? (
              <div className="flex justify-center items-center h-64">
                  <Loader2 className="w-8 h-8 animate-spin text-accent" />
              </div>
          ) : (
            <div className="space-y-8">
              {featuredApps.map(app => <FeaturedAppCard key={app.id} app={app} />)}

              {publishedApps.length > 0 && (
                <div className="space-y-4">
                    <h2 className="text-2xl font-bold text-center font-headline tracking-wider text-accent mt-12">Community Apps</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {publishedApps.map(app => {
                          const communityApp = { id: app.name.toLowerCase(), name: app.name };
                          return (
                            <Card key={app.name} className="bg-transparent border-primary/30 flex flex-col justify-between shadow-lg shadow-black/20">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-3"><BrainCircuit/> {app.name}</CardTitle>
                                    <CardDescription className="flex items-center gap-2 pt-1 text-xs"><User className="w-3 h-3"/> by {app.creator}</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-sm text-foreground/80">{app.description}</p>
                                </CardContent>
                                <div className="p-6 pt-2">
                                    {isInstalling(communityApp.id) ? (
                                        <div className="space-y-2">
                                            <Progress value={installProgress} className="w-full" />
                                            <p className="text-sm text-center text-accent">Installing...</p>
                                        </div>
                                    ) : isInstalled(communityApp.id) ? (
                                        <Button onClick={() => handleUninstall(communityApp)} variant="outline" className="w-full hover:bg-destructive/20 hover:text-destructive hover:border-destructive">
                                            <Trash2 className="mr-2" />
                                            Uninstall
                                        </Button>
                                    ) : (
                                        <Button onClick={() => handleInstall(communityApp)} className="w-full bg-accent hover:bg-accent/80">
                                            <Download className="mr-2" />
                                            Install
                                        </Button>
                                    )}
                                </div>
                            </Card>
                          )
                      })}
                    </div>
                </div>
              )}
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
