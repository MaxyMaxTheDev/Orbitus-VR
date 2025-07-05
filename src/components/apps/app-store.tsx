
"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { get, set } from '@/lib/idb';
import { Blocks, Download, Rocket, Trash2, Loader2, ArrowLeft, CheckCircle } from 'lucide-react';
import Image from 'next/image';

export function AppStore() {
  const [isInstalled, setIsInstalled] = useState(false);
  const [isInstalling, setIsInstalling] = useState(false);
  const [installProgress, setInstallProgress] = useState(0);
  const [isLoadingState, setIsLoadingState] = useState(true);

  const { toast } = useToast();

  useEffect(() => {
    const checkInstallationStatus = async () => {
      setIsLoadingState(true);
      const installedStatus = await get<boolean>('minecraft-installed');
      if (installedStatus) {
        setIsInstalled(true);
      }
      setIsLoadingState(false);
    };
    checkInstallationStatus();
  }, []);

  const handleInstall = () => {
    setIsInstalling(true);
    setInstallProgress(0);

    const interval = setInterval(() => {
      setInstallProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsInstalling(false);
          setIsInstalled(true);
          set('minecraft-installed', true);
          
          setTimeout(() => {
            toast({
              icon: <CheckCircle className="h-5 w-5 text-green-500" />,
              title: "Installation Complete",
              description: "Minecraft has been added to your app library.",
            });
          }, 0);

          return 100;
        }
        return prev + 10;
      });
    }, 200);
  };

  const handleUninstall = () => {
    setIsInstalled(false);
    set('minecraft-installed', false);
    toast({
      icon: <Trash2 className="h-5 w-5" />,
      title: "Uninstalled",
      description: "Minecraft has been removed from your app library.",
      variant: "destructive"
    });
  };

  return (
    <div className="h-full w-full p-4 sm:p-6 overflow-y-auto flex items-center justify-center bg-black/20">
      <div className="w-full max-w-4xl space-y-8">
        <h1 className="text-3xl font-bold text-center font-headline tracking-wider text-accent">App Store</h1>
        
        {isLoadingState ? (
            <div className="flex justify-center items-center h-64">
                <Loader2 className="w-8 h-8 animate-spin text-accent" />
            </div>
        ) : (
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
                        {isInstalling ? (
                            <div className="space-y-2">
                                <Progress value={installProgress} className="w-full" />
                                <p className="text-sm text-center text-accent">Installing...</p>
                            </div>
                        ) : isInstalled ? (
                            <Button onClick={handleUninstall} size="lg" variant="outline" className="w-full hover:bg-destructive/20 hover:text-destructive hover:border-destructive">
                                <Trash2 className="mr-2" />
                                Uninstall
                            </Button>
                        ) : (
                            <Button onClick={handleInstall} size="lg" className="w-full bg-accent hover:bg-accent/80">
                                <Download className="mr-2" />
                                Install
                            </Button>
                        )}
                    </div>
                </div>
            </Card>
        )}
      </div>
    </div>
  );
}
