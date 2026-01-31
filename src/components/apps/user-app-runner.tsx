'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Loader2, ServerCrash } from 'lucide-react';
import { runCode } from '@/ai/flows/run-code-flow';
import type { UserApp } from './xenova-dev';

type UserAppRunnerProps = {
    app: UserApp;
}

export function UserAppRunner({ app }: UserAppRunnerProps) {
    const [imageUrl, setImageUrl] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const executeCode = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const result = await runCode({ code: app.code, prompt: app.aiPrompt });
                setImageUrl(result.imageUrl);
            } catch (e: any) {
                setError(e.message || 'The AI failed to run this application.');
            } finally {
                setIsLoading(false);
            }
        };
        executeCode();
    }, [app]);

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center h-full text-muted-foreground gap-4">
                <Loader2 className="w-16 h-16 animate-spin text-accent" />
                <p className="text-lg font-headline tracking-widest text-accent">EXECUTING...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center h-full text-destructive-foreground gap-2 bg-destructive/20 rounded-b-lg p-4">
                <ServerCrash className="w-24 h-24" strokeWidth={1}/>
                <h3 className="text-xl font-bold font-headline">Execution Failed</h3>
                <p className="text-center max-w-md">{error}</p>
            </div>
        );
    }

    if (imageUrl) {
        return (
            <div className="relative w-full h-full bg-black">
                <Image src={imageUrl} alt={`Screenshot of ${app.name}`} layout="fill" objectFit="contain" />
            </div>
        );
    }

    return null;
}
