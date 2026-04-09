"use client";

import { useEffect, useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { getQuote, QuoteOutput } from '@/ai/flows/quote-flow';
import { get, set } from '@/lib/idb';
import { Bot, Loader2, Newspaper, ArrowRight, Bell, ListChecks, HardDrive, X, GripVertical, Check, Plus, Heart, Music, CheckSquare } from 'lucide-react';
import { useSettings, type WidgetName } from '@/contexts/settings-context';
import { useDesktopActions } from '@/contexts/desktop-actions-context';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import { Switch } from '../ui/switch';
import { ScrollArea } from '../ui/scroll-area';
import { MusicControls } from '../music-controls';
import type { LucideIcon } from 'lucide-react';

// --- WIDGET COMPONENTS ---

const InsightWidget = () => {
    const [quote, setQuote] = useState<QuoteOutput | null>(null);
    const [isQuoteLoading, setIsQuoteLoading] = useState(true);

    useEffect(() => {
        const fetchQuote = async () => {
            setIsQuoteLoading(true);
            const cacheKey = 'daily-quote';
            try {
                const cachedData = await get<{ quote: QuoteOutput; timestamp: number }>(cacheKey);
                const now = new Date().getTime();
                if (cachedData && (now - cachedData.timestamp < 12 * 60 * 60 * 1000)) {
                    setQuote(cachedData.quote);
                } else {
                    const newQuote = await getQuote();
                    setQuote(newQuote);
                    await set(cacheKey, { quote: newQuote, timestamp: now });
                }
            } catch (err) {
                setQuote({ quote: "Could not retrieve AI insight.", author: "System" });
            } finally {
                setIsQuoteLoading(false);
            }
        };
        fetchQuote();
    }, []);

    return (
        <Card className="bg-card/50 border-border h-full">
            <CardHeader className="flex flex-row items-center justify-between p-4 pb-2">
                <CardTitle className="text-sm font-medium text-accent">AI INSIGHT</CardTitle>
                <Bot className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent className="p-4 pt-0 min-h-[6rem] flex items-center">
                {isQuoteLoading ? (
                    <div className="flex items-center gap-2 text-muted-foreground h-full">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span className="text-sm">Generating...</span>
                    </div>
                ) : (
                    <p className="text-sm font-medium text-foreground">"{quote?.quote}"</p>
                )}
            </CardContent>
        </Card>
    );
};

const OverviewWidget = () => {
    const { openApp } = useDesktopActions();
    const unreadNotifications = 2; // Mock data
    const pendingTasks = 1; // Mock data

    return (
        <Card className="bg-card/50 border-border h-full">
            <CardHeader className="p-4 pb-2">
                <CardTitle className="text-sm font-medium text-accent">OVERVIEW</CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-0 grid gap-4">
                <Button variant="ghost" className="w-full justify-start p-0 h-auto" onClick={() => openApp('Notifications')}>
                    <div className="flex items-center gap-3">
                        <Bell className="w-5 h-5 text-muted-foreground" />
                        <p className="font-semibold text-foreground text-left">{unreadNotifications} Unread Notifications</p>
                    </div>
                </Button>
                <Button variant="ghost" className="w-full justify-start p-0 h-auto" onClick={() => openApp('Workspace')}>
                    <div className="flex items-center gap-3">
                        <ListChecks className="w-5 h-5 text-muted-foreground" />
                        <p className="font-semibold text-foreground text-left">{pendingTasks} Pending Task</p>
                    </div>
                </Button>
            </CardContent>
        </Card>
    );
};

const StorageWidget = () => {
    const { openApp } = useDesktopActions();
    const usedStorage = 178.2;
    const totalStorage = 256.0;
    const storagePercentage = (usedStorage / totalStorage) * 100;

    return (
        <Card className="bg-card/50 border-border h-full">
            <CardHeader className="p-4 pb-2 flex flex-row items-center justify-between">
                <CardTitle className="text-sm font-medium text-accent">STORAGE</CardTitle>
                <Button variant="ghost" size="sm" className="p-0 h-auto text-xs text-accent" onClick={() => openApp('File Explorer')}>Manage</Button>
            </CardHeader>
            <CardContent className="p-4 pt-0">
                <div className="flex items-center gap-3">
                    <HardDrive className="w-5 h-5 text-muted-foreground" />
                    <div className="w-full">
                        <div className="flex justify-between items-baseline mb-1">
                            <p className="text-sm font-semibold text-foreground">Virtual Drive</p>
                            <p className="text-lg font-bold font-mono text-primary">{storagePercentage.toFixed(0)}%</p>
                        </div>
                        <Progress value={storagePercentage} className="h-2" />
                        <div className="flex justify-between text-xs text-muted-foreground mt-1">
                            <span>{usedStorage.toFixed(1)} GB used</span>
                            <span>{totalStorage} GB</span>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

const NewsWidget = () => {
    const [news, setNews] = useState<any[]>([]);
    const [isNewsLoading, setIsNewsLoading] = useState(true);
    const { openApp } = useDesktopActions();

    useEffect(() => {
        const fetchNews = async () => {
            setIsNewsLoading(true);
            try {
                const response = await fetch('https://api.rss2json.com/v1/api.json?rss_url=https://news.google.com/rss');
                const data = await response.json();
                setNews(data.items.slice(0, 3));
            } catch (error) {
                setNews([]);
            } finally {
                setIsNewsLoading(false);
            }
        };
        fetchNews();
    }, []);

    return (
        <Card className="bg-card/50 border-border h-full">
            <CardHeader className="flex flex-row items-center justify-between p-4">
                <CardTitle className="text-sm font-medium text-accent flex items-center gap-2">
                    <Newspaper className="w-4 h-4" /> LIVE HEADLINES
                </CardTitle>
                <Button variant="ghost" onClick={() => openApp('News Feed')} className="text-xs text-accent hover:underline flex items-center gap-1 h-auto p-0">
                    View All <ArrowRight className="w-3 h-3" />
                </Button>
            </CardHeader>
            <CardContent className="px-4 pb-4">
                {isNewsLoading ? (
                    <div className="flex items-center gap-2 text-muted-foreground"><Loader2 className="w-4 h-4 animate-spin" /><span>Fetching headlines...</span></div>
                ) : (
                    <div className="space-y-4">
                        {news.map((item, index) => (
                            <div key={index} className="group cursor-pointer" onClick={() => openApp('News Feed')}>
                                <p className="font-semibold text-foreground truncate group-hover:text-accent transition-colors text-sm">{item.title}</p>
                                <p className="text-[10px] text-muted-foreground uppercase">{item.author || 'Google News'}</p>
                            </div>
                        ))}
                        {news.length === 0 && <p className="text-xs text-muted-foreground">Unable to load live news feed.</p>}
                    </div>
                )}
            </CardContent>
        </Card>
    );
};

const TasksWidget = () => {
    const tasks = [
        { id: 1, text: 'Connect real mail account', completed: false },
        { id: 2, text: 'Debug spatial audio glitches', completed: false },
    ];
    return (
        <Card className="bg-card/50 border-border h-full">
            <CardHeader className="p-4 pb-2">
                <CardTitle className="text-sm font-medium text-accent">TASKS</CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-0 space-y-2">
                {tasks.map(task => (
                    <div key={task.id} className="flex items-center gap-2">
                        <CheckSquare className="w-4 h-4 text-muted-foreground"/>
                        <p className="text-sm text-foreground truncate">{task.text}</p>
                    </div>
                ))}
            </CardContent>
        </Card>
    );
};

const MusicWidget = () => (
    <Card className="bg-card/50 border-border h-full p-4 flex flex-col justify-center">
        <MusicControls />
    </Card>
);

// --- WIDGET CONFIGURATION ---

const widgetComponentMap: Record<WidgetName, { component: React.FC, colSpan: string }> = {
    insight: { component: InsightWidget, colSpan: 'md:col-span-1' },
    overview: { component: OverviewWidget, colSpan: 'md:col-span-1' },
    storage: { component: StorageWidget, colSpan: 'md:col-span-1' },
    news: { component: NewsWidget, colSpan: 'md:col-span-2 lg:col-span-3' },
    wellness: { component: () => null, colSpan: 'hidden' }, // Removed
    tasks: { component: TasksWidget, colSpan: 'md:col-span-1' },
    music: { component: MusicWidget, colSpan: 'md:col-span-2' },
};

const allAvailableWidgets: { id: WidgetName; name: string; description: string; icon: LucideIcon }[] = [
    { id: 'insight', name: 'AI Insight', description: 'Displays a daily AI-generated quote.', icon: Bot },
    { id: 'overview', name: 'Overview', description: 'Shows notifications and task shortcuts.', icon: Bell },
    { id: 'storage', name: 'Storage', description: 'Monitors virtual drive capacity.', icon: HardDrive },
    { id: 'news', name: 'Live Headlines', description: 'Real-time feed of the latest world news.', icon: Newspaper },
    { id: 'tasks', name: 'Tasks', description: 'A quick view of your pending tasks.', icon: ListChecks },
    { id: 'music', name: 'Music Player', description: 'Controls for the music player.', icon: Music },
];

// --- EDITOR TRAY ---

function WidgetEditorTray({ onClose }: { onClose: () => void }) {
    const { dashboardWidgets, setDashboardWidgets } = useSettings();

    const toggleWidget = (widgetId: WidgetName) => {
        const isEnabled = dashboardWidgets.includes(widgetId);
        let newWidgets;
        if (isEnabled) {
            newWidgets = dashboardWidgets.filter(id => id !== widgetId);
        } else {
            newWidgets = [...dashboardWidgets, widgetId];
        }
        // Preserve a sensible order by sorting based on the master list
        const orderedWidgets = allAvailableWidgets.map(w => w.id).filter(id => newWidgets.includes(id));
        setDashboardWidgets(orderedWidgets);
    };

    return (
        <>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-black/60 z-30"
                onClick={onClose}
            />
            <motion.div
                initial={{ y: "100%" }}
                animate={{ y: 0 }}
                exit={{ y: "100%" }}
                transition={{ type: 'spring', damping: 25, stiffness: 150 }}
                className="absolute bottom-0 left-0 right-0 z-40 bg-card border-t border-border rounded-t-2xl shadow-2xl"
            >
                <div className="p-4 flex justify-between items-center border-b border-border">
                    <h2 className="text-lg font-bold">Edit Widgets</h2>
                    <Button onClick={onClose}><Check className="mr-2"/>Done</Button>
                </div>
                <ScrollArea className="h-[40vh]">
                    <div className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {allAvailableWidgets.map(widget => {
                            const isEnabled = dashboardWidgets.includes(widget.id);
                            return (
                                <Card key={widget.id} className={cn("flex flex-col justify-between", isEnabled ? 'bg-primary/10 border-primary' : 'bg-secondary/50')}>
                                    <CardHeader>
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <widget.icon className="w-5 h-5 text-accent"/>
                                                <CardTitle className="text-base font-semibold">{widget.name}</CardTitle>
                                            </div>
                                            <Switch checked={isEnabled} onCheckedChange={() => toggleWidget(widget.id)} />
                                        </div>
                                    </CardHeader>
                                    <CardContent>
                                        <p className="text-sm text-muted-foreground">{widget.description}</p>
                                    </CardContent>
                                </Card>
                            );
                        })}
                    </div>
                </ScrollArea>
            </motion.div>
        </>
    );
}

// --- MAIN DASHBOARD COMPONENT ---

export function Dashboard() {
    const [dateTime, setDateTime] = useState({ date: '', time: '' });
    const { username, dashboardWidgets, isEditingDashboard, setIsEditingDashboard } = useSettings();

    useEffect(() => {
        const updateDateTime = () => {
            const now = new Date();
            setDateTime({
                date: now.toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' }),
                time: now.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })
            });
        };
        updateDateTime();
        const timerId = setInterval(updateDateTime, 1000 * 60);
        return () => clearInterval(timerId);
    }, []);

    return (
        <div className="h-full w-full p-6 sm:p-8 overflow-y-auto space-y-8 relative">
            <div>
                <h1 className="text-4xl lg:text-5xl font-bold text-foreground">Welcome back, <span className="text-primary">{username}</span></h1>
                <p className="text-lg text-muted-foreground mt-1">{dateTime.date} &bull; {dateTime.time}</p>
            </div>

            {dashboardWidgets.length === 0 && !isEditingDashboard ? (
                <Card className="bg-card/50 border-border text-center p-8">
                    <CardTitle>Dashboard is Empty</CardTitle>
                    <CardContent className="p-0 pt-4">
                        <p className="text-muted-foreground">Enable widgets in the Settings app to customize your dashboard.</p>
                        <Button onClick={() => setIsEditingDashboard(true)} className="mt-4">Add Widgets</Button>
                    </CardContent>
                </Card>
            ) : (
                <div className={cn("grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6", isEditingDashboard && "opacity-50 pointer-events-none")}>
                    {dashboardWidgets.map((widgetId) => {
                        const widget = widgetComponentMap[widgetId];
                        if (!widget || widgetId === 'wellness') return null;
                        const WidgetComponent = widget.component;
                        return (
                            <div key={widgetId} className={cn(widget.colSpan)}>
                                <WidgetComponent />
                            </div>
                        )
                    })}
                </div>
            )}
             <AnimatePresence>
                {isEditingDashboard && <WidgetEditorTray onClose={() => setIsEditingDashboard(false)} />}
            </AnimatePresence>
        </div>
    );
}
