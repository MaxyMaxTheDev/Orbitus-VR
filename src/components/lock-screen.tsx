"use client";

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from './ui/button';
import { ArrowUp, LogIn } from 'lucide-react';
import { getTip, TipOutput } from '@/ai/flows/tip-flow';
import { get, set } from '@/lib/idb';
import Image from 'next/image';

type LockScreenProps = {
    onUnlock: () => void;
};

function Clock() {
    const [time, setTime] = useState('');
    const [date, setDate] = useState('');

    useEffect(() => {
        const updateDateTime = () => {
            const now = new Date();
            setTime(now.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' }));
            setDate(now.toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' }));
        };
        updateDateTime();
        const timerId = setInterval(updateDateTime, 1000 * 30);
        return () => clearInterval(timerId);
    }, []);

    return (
        <div className="text-center text-white [text-shadow:_0_2px_8px_rgb(0_0_0_/_50%)]">
            <h1 className="text-7xl md:text-8xl font-bold tracking-tighter">{time}</h1>
            <p className="text-xl md:text-2xl font-medium text-white/80">{date}</p>
        </div>
    );
}

function TipOfTheDay() {
    const [tip, setTip] = useState<TipOutput | null>(null);

    useEffect(() => {
        const fetchTip = async () => {
            const cacheKey = 'daily-tip';
            const cached = await get<{ tip: TipOutput; timestamp: number }>('daily-tip');
            const now = new Date().getTime();
            
            if (cached && (now - cached.timestamp < 12 * 60 * 60 * 1000)) {
                setTip(cached.tip);
            } else {
                const newTip = await getTip();
                setTip(newTip);
                await set('daily-tip', { tip: newTip, timestamp: now });
            }
        };
        fetchTip().catch(console.error);
    }, []);

    return (
        <div className="max-w-md text-center [text-shadow:_0_1px_4px_rgb(0_0_0_/_50%)]">
            <p className="font-semibold text-white/90">{tip?.tip || 'Loading tip...'}</p>
        </div>
    );
}

export function LockScreen({ onUnlock }: LockScreenProps) {
    return (
        <motion.div
            className="absolute inset-0 z-50 flex flex-col items-center justify-between p-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
        >
            <Image
                alt="A grassy hill under a blue sky"
                src="https://picsum.photos/seed/green-hill/1920/1080"
                layout="fill"
                objectFit="cover"
                data-ai-hint="grassy hill blue sky"
                className="z-0 filter brightness-150 saturate-150"
            />
            
            {/* Spacer */}
            <div className="relative z-20" />

            {/* Main Content */}
            <div className="relative z-20 flex flex-col items-center gap-12">
                <Clock />
                <TipOfTheDay />
            </div>
            
            {/* Unlock control */}
            <motion.div
                drag="y"
                dragConstraints={{ top: -100, bottom: 0 }}
                dragElastic={{ top: 0.8, bottom: 0 }}
                onDragEnd={(_, info) => {
                    if (info.offset.y < -50) {
                        onUnlock();
                    }
                }}
                className="relative z-20 flex flex-col items-center gap-4"
            >
                <motion.div 
                    className="flex flex-col items-center gap-1 text-white/80 [text-shadow:_0_1px_4px_rgb(0_0_0_/_50%)]"
                    animate={{ y: [0, -5, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
                >
                    <ArrowUp />
                    <p className="font-semibold">Swipe up to unlock</p>
                </motion.div>
                <Button
                    size="lg"
                    variant="secondary"
                    onClick={onUnlock}
                    className="bg-white/10 hover:bg-white/20 text-white backdrop-blur-lg"
                >
                    <LogIn className="mr-2" />
                    Sign In
                </Button>
            </motion.div>
        </motion.div>
    );
}
