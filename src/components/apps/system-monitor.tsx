
"use client";

import { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid } from 'recharts';
import { Cpu, MemoryStick, Video, Network } from 'lucide-react';
import { useSettings } from '@/contexts/settings-context';

const createInitialData = (length: number, max: number, random: () => number) => {
    return Array.from({ length }, (_, i) => ({
        time: i,
        usage: random() * max,
    }));
};

// Simple pseudo-random number generator for consistent data based on username
const mulberry32 = (seed: number) => {
    return () => {
        let t = seed += 0x6D2B79F5;
        t = Math.imul(t ^ t >>> 15, t | 1);
        t ^= t + Math.imul(t ^ t >>> 7, t | 61);
        return ((t ^ t >>> 14) >>> 0) / 4294967296;
    }
};

const createSeed = (str: string) => {
  let seed = 0;
  for (let i = 0; i < str.length; i++) {
    seed = (seed << 5) - seed + str.charCodeAt(i);
    seed |= 0;
  }
  return seed;
};

export function SystemMonitor() {
    const { username } = useSettings();
    const dataLength = 20;

    const { baselines, random } = useMemo(() => {
        const seed = createSeed(username + new Date().toLocaleDateString());
        const randomFunc = mulberry32(seed);
        const a = {
            cpu: 20 + randomFunc() * 30,
            gpu: 30 + randomFunc() * 40,
            mem: 40 + randomFunc() * 20,
            net: 5 + randomFunc() * 15,
        };
        return { baselines: a, random: randomFunc };
    }, [username]);

    const [cpuData, setCpuData] = useState(() => createInitialData(dataLength, baselines.cpu, random));
    const [gpuData, setGpuData] = useState(() => createInitialData(dataLength, baselines.gpu, random));
    const [memData, setMemData] = useState(() => createInitialData(dataLength, baselines.mem, random));
    const [netData, setNetData] = useState(() => createInitialData(dataLength, baselines.net, random));

    useEffect(() => {
        const interval = setInterval(() => {
            const updateData = (data: {time: number, usage: number}[], baseline: number) => {
                const newData = [...data.slice(1)];
                const lastTime = data[data.length - 1].time;
                newData.push({
                    time: lastTime + 1,
                    usage: Math.max(0, Math.min(100, baseline + (Math.random() - 0.5) * 20)),
                });
                return newData;
            };

            setCpuData(d => updateData(d, baselines.cpu));
            setGpuData(d => updateData(d, baselines.gpu));
            setMemData(d => updateData(d, baselines.mem));
            setNetData(d => updateData(d, baselines.net));
        }, 1500);

        return () => clearInterval(interval);
    }, [baselines]);

    const chartConfig = {
        usage: { label: "Usage", color: "hsl(var(--accent))" },
    };

    const renderChart = (data: any[], title: string, description: string, Icon: React.ElementType, unit: string) => (
        <Card className="bg-card/50 border-border">
            <CardHeader>
                <div className="flex justify-between items-start">
                    <div>
                        <CardTitle className="text-sm font-medium text-accent flex items-center gap-2">
                           <Icon className="w-4 h-4" /> {title}
                        </CardTitle>
                        <CardDescription>{description}</CardDescription>
                    </div>
                    <div className="text-2xl font-bold text-foreground">
                        {data[data.length - 1].usage.toFixed(1)}
                        <span className="text-sm font-normal text-muted-foreground">{unit}</span>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="h-[120px] w-full pb-0">
                <ChartContainer config={chartConfig}>
                    <AreaChart
                        data={data}
                        margin={{ top: 5, right: 10, left: 10, bottom: 0 }}
                    >
                        <defs>
                            <linearGradient id={`${title}-color`} x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="hsl(var(--accent))" stopOpacity={0.8} />
                                <stop offset="95%" stopColor="hsl(var(--accent))" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <ChartTooltip
                            cursor={false}
                            content={<ChartTooltipContent indicator="line" labelFormatter={(value, payload) => `${payload?.[0]?.payload.usage.toFixed(1)}${unit}`} hideLabel />}
                        />
                        <Area
                            dataKey="usage"
                            type="monotone"
                            stroke="hsl(var(--accent))"
                            strokeWidth={2}
                            fillOpacity={1}
                            fill={`url(#${title}-color)`}
                        />
                    </AreaChart>
                </ChartContainer>
            </CardContent>
        </Card>
    );

    return (
        <div className="h-full w-full p-4 sm:p-6 overflow-y-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {renderChart(cpuData, "CPU", "Core Processing Unit Load", Cpu, "%")}
                {renderChart(gpuData, "GPU", "Graphics Processing Unit Load", Video, "%")}
                {renderChart(memData, "Memory", "System RAM Usage", MemoryStick, "%")}
                {renderChart(netData, "Network", "Data Throughput", Network, " Mbps")}
            </div>
        </div>
    );
}
