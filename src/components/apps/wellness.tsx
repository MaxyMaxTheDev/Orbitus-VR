
"use client";

import { Bar, BarChart, CartesianGrid, Area, AreaChart } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { Heart, BedDouble, Footprints, BrainCircuit } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Progress } from '@/components/ui/progress';


const activityData = [
    { day: 'Mon', steps: 6000 },
    { day: 'Tue', steps: 8500 },
    { day: 'Wed', steps: 7200 },
    { day: 'Thu', steps: 9100 },
    { day: 'Fri', steps: 10500 },
    { day: 'Sat', steps: 12300 },
    { day: 'Sun', steps: 4500 },
];

const activityChartConfig = {
    steps: {
        label: "Steps",
        color: "hsl(var(--accent))",
    },
};

export function Wellness() {
    const [heartRate, setHeartRate] = useState(72);
    const [heartRateData, setHeartRateData] = useState(() => 
        Array.from({ length: 15 }, (_, i) => ({
            time: i,
            bpm: 65 + Math.random() * 15
        }))
    );

    // Simulate live heart rate updates
    useEffect(() => {
        const interval = setInterval(() => {
            setHeartRate(Math.floor(68 + Math.random() * 8));
            setHeartRateData(prevData => {
                const lastTime = prevData.length > 0 ? prevData[prevData.length - 1].time : 0;
                const newDataPoint = {
                    time: lastTime + 1,
                    bpm: 65 + Math.random() * 15
                };
                // Keep the array at a fixed size
                return [...prevData.slice(1), newDataPoint];
            });
        }, 2000);
        return () => clearInterval(interval);
    }, []);

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
                         <div className="text-4xl font-bold text-foreground">8<span className="text-xl font-normal text-muted-foreground">h</span> 32<span className="text-xl font-normal text-muted-foreground">m</span></div>
                        <p className="text-xs text-muted-foreground">Last night's sleep</p>
                        <div className="mt-4 space-y-2">
                           <div className="flex items-center justify-between">
                               <span className="text-sm">Deep</span>
                               <span className="font-mono">1h 45m</span>
                           </div>
                           <div className="flex items-center justify-between">
                               <span className="text-sm">Light</span>
                               <span className="font-mono">4h 55m</span>
                           </div>
                           <div className="flex items-center justify-between">
                               <span className="text-sm">REM</span>
                               <span className="font-mono">1h 22m</span>
                           </div>
                           <div className="flex items-center justify-between">
                               <span className="text-sm">Awake</span>
                               <span className="font-mono">0h 30m</span>
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
                            <BarChart data={activityData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
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
                                <span>15 / 10 min</span>
                            </div>
                             <Progress value={100} />
                        </div>
                        <div>
                            <div className="flex justify-between text-sm mb-1">
                                <span>Weekly Streak</span>
                                <span>4 / 7 days</span>
                            </div>
                            <Progress value={(4/7)*100} />
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
