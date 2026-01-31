
"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { get, set } from '@/lib/idb';
import { Blocks, Download, Trash2, Loader2, CheckCircle, BrainCircuit, User } from 'lucide-react';
import Image from 'next/image';
import { ScrollArea } from '../ui/scroll-area';
import type { UserApp } from './xenova-dev';

type InstallableApp = {
    id: string;
    name: string;
};

export function AppStore() {
  const [installedApps, setInstalledApps] = useState<string[]>([]);
  const [installingAppId, setInstallingAppId] = useState<string | null>(null);
  const [installProgress, setInstallProgress] = useState(0);
  const [isLoadingState, setIsLoadingState] = useState(true);
  const [publishedApps, setPublishedApps] = useState<UserApp[]>([]);

  const { toast } = useToast();

  const minecraftApp: InstallableApp = { id: 'minecraft', name: 'Minecraft' };
  
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

  const handleInstall = (app: InstallableApp) => {
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

  const handleUninstall = (app: InstallableApp) => {
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
            <>
              <Card className="bg-transparent border-primary/30 grid grid-cols-1 md:grid-cols-3 overflow-hidden shadow-lg shadow-black/20">
                  <div className="md:col-span-1 bg-black/20 p-4 flex items-center justify-center">
                      <Image
                          src="https://placehold.co/400x500.png"
                          alt="Minecraft"
                          width={400}
                          height={500}
                          className="rounded-md object-cover"
                          data-ai-hint="minecraft landscape"
                      />
                  </div>
                  <div className="md:col-span-2 p-6 flex flex-col justify-between">
                      <div>
                          <CardHeader className="p-0">
                              <CardTitle className="text-2xl font-bold flex items-center gap-3"><Blocks/> Minecraft</CardTitle>
                          </CardHeader>
                          <CardContent className="p-0 mt-4">
                              <CardDescription className="text-base text-foreground/80">
                                  The classic block-building adventure. Explore infinite worlds and build everything from the simplest of homes to the grandest of castles.
                              </CardDescription>
                          </CardContent>
                      </div>

                      <div className="mt-6">
                          {isInstalling(minecraftApp.id) ? (
                              <div className="space-y-2">
                                  <Progress value={installProgress} className="w-full" />
                                  <p className="text-sm text-center text-accent">Installing...</p>
                              </div>
                          ) : isInstalled(minecraftApp.id) ? (
                              <Button onClick={() => handleUninstall(minecraftApp)} size="lg" variant="outline" className="w-full hover:bg-destructive/20 hover:text-destructive hover:border-destructive">
                                  <Trash2 className="mr-2" />
                                  Uninstall
                              </Button>
                          ) : (
                              <Button onClick={() => handleInstall(minecraftApp)} size="lg" className="w-full bg-accent hover:bg-accent/80">
                                  <Download className="mr-2" />
                                  Install
                              </Button>
                          )}
                      </div>
                  </div>
              </Card>

              {publishedApps.length > 0 && (
                <div className="space-y-4">
                    <h2 className="text-2xl font-bold text-center font-headline tracking-wider text-accent mt-12">Community Apps</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {publishedApps.map(app => {
                          const communityApp = { id: app.name, name: app.name };
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
            </>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
