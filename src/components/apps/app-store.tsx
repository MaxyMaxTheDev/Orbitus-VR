
"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { ArrowLeft } from 'lucide-react';
import Image from 'next/image';

const storeApps = [
    {
        id: 'minecraft',
        name: 'Minecraft',
        description: 'The classic block-building adventure. Fully playable in the browser.',
        imageUrl: 'https://placehold.co/400x300.png',
        imageHint: 'minecraft grass block',
        embedUrl: 'https://mcraft.fun'
    }
];

export function AppStore() {
    const [selectedAppId, setSelectedAppId] = useState<string | null>(null);

    const selectedApp = storeApps.find(app => app.id === selectedAppId);

    if (selectedApp) {
        return (
            <div className="h-full w-full flex flex-col">
                <div className="p-2 border-b border-primary/30 flex-shrink-0">
                    <Button variant="ghost" onClick={() => setSelectedAppId(null)}>
                        <ArrowLeft className="mr-2" />
                        Back to App Store
                    </Button>
                </div>
                <div className="flex-1 w-full h-full bg-black">
                    <iframe
                        src={selectedApp.embedUrl}
                        frameBorder="0"
                        className="w-full h-full"
                        allowFullScreen
                    ></iframe>
                </div>
            </div>
        );
    }

    return (
        <div className="h-full w-full p-4 sm:p-6 overflow-y-auto">
            <h1 className="text-3xl font-bold text-accent mb-6 font-headline tracking-wider">App Store</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {storeApps.map((app) => (
                    <Card key={app.id} className="bg-card/50 border-border hover:border-accent transition-colors flex flex-col">
                        <CardHeader>
                            <div className="relative aspect-video mb-4 rounded-lg overflow-hidden">
                                <Image src={app.imageUrl} alt={app.name} layout="fill" objectFit="cover" data-ai-hint={app.imageHint} />
                            </div>
                            <CardTitle>{app.name}</CardTitle>
                            <CardDescription>{app.description}</CardDescription>
                        </CardHeader>
                        <CardContent className="mt-auto">
                            <Button className="w-full" onClick={() => setSelectedAppId(app.id)}>
                                Launch
                            </Button>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}
