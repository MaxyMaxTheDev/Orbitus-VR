
"use client";

import { Bar, BarChart, CartesianGrid, Area, AreaChart, Tooltip, XAxis, YAxis } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { Heart, BedDouble, Footprints, BrainCircuit } from 'lucide-react';
import { useState, useEffect, useMemo } from 'react';
import { Progress } from '@/components/ui/progress';
import { useSettings } from '@/contexts/settings-context';


// Helper function to create a seed from a string (like a username)
const createSeed = (str: string) => {
  let seed = 0;
  for (let i = 0; i < str.length; i++) {
    seed = (seed << 5) - seed + str.charCodeAt(i);
    seed |= 0; // Convert to 32bit integer
  }
  return seed;
};

// Simple pseudo-random number generator
const mulberry32 = (seed: number) => {
  return () => {
    let t = seed += 0x6D2B79F5;
    t = Math.imul(t ^ t >>> 15, t | 1);
    t ^= t + Math.imul(t ^ t >>> 7, t | 61);
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  }
};

const activityChartConfig = {
    steps: {
        label: "Steps",
        color: "hsl(var(--accent))",
    },
};

export function Wellness() {
    const { username } = useSettings();
    const [heartRate, setHeartRate] = useState(72);

    // Generate personalized data based on the username
    const personalizedData = useMemo(() => {
        const seed = createSeed(username);
        const random = mulberry32(seed);

        const sleepTotalMinutes = 400 + Math.floor(random() * 120); // 6h40m to 8h40m
        const deepRatio = 0.15 + random() * 0.1;
        const lightRatio = 0.5 + random() * 0.1;
        const remRatio = 0.2 + random() * 0.05;

        const deepMinutes = Math.floor(sleepTotalMinutes * deepRatio);
        const lightMinutes = Math.floor(sleepTotalMinutes * lightRatio);
        const remMinutes = Math.floor(sleepTotalMinutes * remRatio);
        const awakeMinutes = Math.max(0, sleepTotalMinutes - deepMinutes - lightMinutes - remMinutes);

        const sleep = {
            totalHours: Math.floor(sleepTotalMinutes / 60),
            totalMinutes: sleepTotalMinutes % 60,
            deepHours: Math.floor(deepMinutes / 60),
            deepMinutes: deepMinutes % 60,
            lightHours: Math.floor(lightMinutes / 60),
            lightMinutes: lightMinutes % 60,
            remHours: Math.floor(remMinutes / 60),
            remMinutes: remMinutes % 60,
            awakeMinutes: awakeMinutes,
        };
        
        const activityData = [
            { day: 'Mon', steps: 4000 + Math.floor(random() * 5000) },
            { day: 'Tue', steps: 4000 + Math.floor(random() * 5000) },
            { day: 'Wed', steps: 4000 + Math.floor(random() * 5000) },
            { day: 'Thu', steps: 4000 + Math.floor(random() * 5000) },
            { day: 'Fri', steps: 4000 + Math.floor(random() * 8000) },
            { day: 'Sat', steps: 4000 + Math.floor(random() * 10000) },
            { day: 'Sun', steps: 4000 + Math.floor(random() * 4000) },
        ];
        
        const baseHeartRate = 60 + Math.floor(random() * 15);
        const heartRateData = Array.from({ length: 15 }, (_, i) => ({
            time: i,
            bpm: baseHeartRate + (random() - 0.5) * 10
        }));

        const dailyMinutes = 5 + Math.floor(random() * 15);
        const weeklyDays = 1 + Math.floor(random() * 6);
        const mindfulness = {
            dailyProgress: Math.min(100, Math.floor((dailyMinutes / 10) * 100)),
            dailyMinutes: dailyMinutes,
            weeklyProgress: Math.floor((weeklyDays / 7) * 100),
            weeklyDays: weeklyDays
        };

        return { sleep, activityData, heartRateData, mindfulness, baseHeartRate };
    }, [username]);

    const [heartRateData, setHeartRateData] = useState(personalizedData.heartRateData);

    // Simulate live heart rate updates
    useEffect(() => {
        const interval = setInterval(() => {
            setHeartRate(Math.floor(personalizedData.baseHeartRate + (Math.random() - 0.5) * 8));
            setHeartRateData(prevData => {
                const lastTime = prevData.length > 0 ? prevData[prevData.length - 1].time : 0;
                const newDataPoint = {
                    time: lastTime + 1,
                    bpm: personalizedData.baseHeartRate + (Math.random() - 0.5) * 10
                };
                // Keep the array at a fixed size
                return [...prevData.slice(1), newDataPoint];
            });
        }, 2000);
        return () => clearInterval(interval);
    }, [personalizedData.baseHeartRate]);

    return (
        <div className="h-full w-full p-4 sm:p-6 overflow-y-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                
                <Card className="lg:col-span-2 bg-card/50 border-border">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-accent">HEART RATE</CardTitle>
                        <Heart className="w-4 h-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-4xl font-bold text-foreground flex items-baseline gap-2">
                            {heartRate} <span className="text-xl font-normal text-muted-foreground">BPM</span>
                        </div>
                        <div className="h-[100px] w-full mt-2">
                            <ChartContainer config={{bpm: { label: 'BPM', color: 'hsl(var(--primary))'}}}>
                                <AreaChart data={heartRateData} margin={{ top: 5, right: 0, left: 0, bottom: 0 }}>
                                    <defs>
                                        <linearGradient id="colorBpm" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.4}/>
                                            <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                                        </linearGradient>
                                    </defs>
                                    <Tooltip
                                        cursor={false}
                                        content={<ChartTooltipContent indicator="line" hideLabel />}
                                    />
                                    <Area type="monotone" dataKey="bpm" strokeWidth={2} stroke="hsl(var(--primary))" fillOpacity={1} fill="url(#colorBpm)" />
                                </AreaChart>
                            </ChartContainer>
                        </div>
                    </CardContent>
                </Card>

                <Card className="lg:col-span-2 bg-card/50 border-border">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-accent">SLEEP ANALYSIS</CardTitle>
                        <BedDouble className="w-4 h-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                         <div className="text-4xl font-bold text-foreground">{personalizedData.sleep.totalHours}<span className="text-xl font-normal text-muted-foreground">h</span> {personalizedData.sleep.totalMinutes}<span className="text-xl font-normal text-muted-foreground">m</span></div>
                        <p className="text-xs text-muted-foreground">Last night's sleep</p>
                        <div className="mt-4 space-y-2">
                           <div className="flex items-center justify-between">
                               <span className="text-sm">Deep</span>
                               <span className="font-mono">{personalizedData.sleep.deepHours}h {personalizedData.sleep.deepMinutes}m</span>
                           </div>
                           <div className="flex items-center justify-between">
                               <span className="text-sm">Light</span>
                               <span className="font-mono">{personalizedData.sleep.lightHours}h {personalizedData.sleep.lightMinutes}m</span>
                           </div>
                           <div className="flex items-center justify-between">
                               <span className="text-sm">REM</span>
                               <span className="font-mono">{personalizedData.sleep.remHours}h {personalizedData.sleep.remMinutes}m</span>
                           </div>
                           <div className="flex items-center justify-between">
                               <span className="text-sm">Awake</span>
                               <span className="font-mono">{personalizedData.sleep.awakeMinutes}m</span>
                           </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="lg:col-span-4 bg-card/50 border-border">
                    <CardHeader>
                        <div className="flex justify-between items-center">
                            <div>
                                <CardTitle className="text-sm font-medium text-accent">WEEKLY ACTIVITY</CardTitle>
                                <CardDescription>Steps taken per day</CardDescription>
                            </div>
                           <Footprints className="w-4 h-4 text-muted-foreground" />
                        </div>
                    </CardHeader>
                    <CardContent className="h-[200px] w-full">
                       <ChartContainer config={activityChartConfig}>
                            <BarChart data={personalizedData.activityData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                <CartesianGrid vertical={false} strokeDasharray="3 3" />
                                <XAxis dataKey="day" tickLine={false} tickMargin={10} axisLine={false} />
                                 <YAxis tickLine={false} axisLine={false} width={40}/>
                                <Tooltip cursor={false} content={<ChartTooltipContent indicator="dot" />} />
                                <Bar dataKey="steps" fill="hsl(var(--accent))" radius={4} />
                            </BarChart>
                        </ChartContainer>
                    </CardContent>
                </Card>

                 <Card className="lg:col-span-4 bg-card/50 border-border">
                    <CardHeader>
                        <div className="flex justify-between items-center">
                            <CardTitle className="text-sm font-medium text-accent">MINDFULNESS GOALS</CardTitle>
                            <BrainCircuit className="w-4 h-4 text-muted-foreground" />
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <div className="flex justify-between text-sm mb-1">
                                <span>Daily Session</span>
                                <span>{personalizedData.mindfulness.dailyMinutes} / 10 min</span>
                            </div>
                             <Progress value={personalizedData.mindfulness.dailyProgress} />
                        </div>
                        <div>
                            <div className="flex justify-between text-sm mb-1">
                                <span>Weekly Streak</span>
                                <span>{personalizedData.mindfulness.weeklyDays} / 7 days</span>
                            </div>
                            <Progress value={personalizedData.mindfulness.weeklyProgress} />
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
