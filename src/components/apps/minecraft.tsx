
"use client";

import { Button } from '@/components/ui/button';
import { ExternalLink } from 'lucide-react';
import Image from 'next/image';

export function MinecraftApp() {
  const openInNewTab = () => {
    window.open('https://mcraft.fun', '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="w-full h-full bg-black/50 flex flex-col items-center justify-center p-8 text-center gap-6">
        <div className="relative w-48 h-48">
            <Image 
                src="https://placehold.co/500x500.png"
                alt="Minecraft"
                layout="fill"
                objectFit="cover"
                className="rounded-2xl"
                data-ai-hint="minecraft block"
            />
        </div>
        <h2 className="text-3xl font-bold text-foreground font-headline tracking-wider">Minecraft</h2>
        <p className="text-muted-foreground max-w-md">
            This game's website has security settings that prevent it from being played inside another app.
        </p>
        <p className="text-muted-foreground max-w-md">
            Click the button below to open it in a new browser tab instead.
        </p>
        <Button size="lg" onClick={openInNewTab}>
            <ExternalLink className="mr-3" />
            Launch Minecraft in New Tab
        </Button>
    </div>
  );
}
