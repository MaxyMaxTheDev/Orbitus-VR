
"use client";

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { getQuote, QuoteOutput } from '@/ai/flows/quote-flow';
import { get, set } from '@/lib/idb';
import { Bot, Loader2, Newspaper, ArrowRight, Bell, ListChecks, HardDrive } from 'lucide-react';
import { useSettings } from '@/contexts/settings-context';
import { getNewsFeed } from '@/ai/flows/news-feed-flow';
import type { NewsItem } from '@/ai/flows/news-feed-flow';
import { useDesktopActions } from '@/contexts/desktop-actions-context';
import { Progress } from '@/components/ui/progress';

export function Dashboard() {
  const [dateTime, setDateTime] = useState({ date: '', time: '' });
  const [quote, setQuote] = useState<QuoteOutput | null>(null);
  const [isQuoteLoading, setIsQuoteLoading] = useState(true);
  const { username, dashboardWidgets } = useSettings();
  const [news, setNews] = useState<NewsItem[]>([]);
  const [isNewsLoading, setIsNewsLoading] = useState(true);
  const { openApp } = useDesktopActions();

  // --- State for storage widget ---
  const usedStorage = 178.2;
  const totalStorage = 256.0;
  const storagePercentage = (usedStorage / totalStorage) * 100;

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

  useEffect(() => {
    if (!dashboardWidgets.includes('insight')) return;
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
    
        } catch (err: any) {
            console.error("Failed to load new quote:", err);
            const cachedData = await get<{ quote: QuoteOutput; timestamp: number }>(cacheKey);
            if (cachedData) {
                setQuote(cachedData.quote);
            } else if (err.message?.includes('429')) {
                setQuote({quote: "Daily AI insight quota reached. A new one will be available tomorrow.", author: "System"});
            } else {
                setQuote({quote: "Could not retrieve AI insight at this time.", author: "System"});
            }
        } finally {
            setIsQuoteLoading(false);
        }
    };
    fetchQuote();
  }, [dashboardWidgets]);

  useEffect(() => {
    if (!dashboardWidgets.includes('news')) return;
    const fetchNews = async () => {
        setIsNewsLoading(true);
        try {
            const newsFeed = await getNewsFeed();
            setNews(newsFeed.articles.slice(0, 3));
        } catch (error) {
            console.error('Error fetching news for dashboard:', error);
            setNews([{ title: 'HoloNet Signal Lost', source: 'System', timestamp: 'Now', content: 'Could not retrieve news headlines.' }]);
        } finally {
            setIsNewsLoading(false);
        }
    };
    fetchNews();
  }, [dashboardWidgets]);

  // Fake data for overview card
  const unreadNotifications = 2;
  const pendingTasks = 1;
  
  const visibleWidgets = ['insight', 'overview', 'storage', 'news'].filter(w => dashboardWidgets.includes(w as any));

  return (
    <div className="h-full w-full p-6 sm:p-8 overflow-y-auto space-y-8">
      {/* New Header */}
      <div>
        <h1 className="text-4xl lg:text-5xl font-bold text-foreground">Welcome back, <span className="text-primary">{username}</span></h1>
        <p className="text-lg text-muted-foreground mt-1">{dateTime.date} &bull; {dateTime.time}</p>
      </div>

      {visibleWidgets.length === 0 ? (
          <Card className="bg-card/50 border-border text-center p-8">
              <CardTitle>Dashboard is Empty</CardTitle>
              <CardContent className="p-0 pt-4">
                  <p className="text-muted-foreground">Enable widgets in the Settings app to customize your dashboard.</p>
                  <Button onClick={() => openApp('Settings')} className="mt-4">Go to Settings</Button>
              </CardContent>
          </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          
          {dashboardWidgets.includes('insight') && (
            <Card className="bg-card/50 border-border">
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
          )}

          {dashboardWidgets.includes('overview') && (
            <Card className="bg-card/50 border-border">
              <CardHeader className="p-4 pb-2">
                <CardTitle className="text-sm font-medium text-accent">OVERVIEW</CardTitle>
              </CardHeader>
              <CardContent className="p-4 pt-0 grid gap-4">
                <Button variant="ghost" className="w-full justify-start p-0 h-auto" onClick={() => openApp('Notifications')}>
                    <div className="flex items-center gap-3">
                        <Bell className="w-5 h-5 text-muted-foreground"/>
                        <div>
                            <p className="font-semibold text-foreground text-left">{unreadNotifications} Unread Notifications</p>
                        </div>
                    </div>
                </Button>
                 <Button variant="ghost" className="w-full justify-start p-0 h-auto" onClick={() => openApp('Workspace')}>
                    <div className="flex items-center gap-3">
                        <ListChecks className="w-5 h-5 text-muted-foreground"/>
                        <div>
                             <p className="font-semibold text-foreground text-left">{pendingTasks} Pending Task</p>
                        </div>
                    </div>
                </Button>
              </CardContent>
            </Card>
          )}

          {dashboardWidgets.includes('storage') && (
            <Card className="bg-card/50 border-border">
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
                            <Progress value={storagePercentage} className="h-2"/>
                            <div className="flex justify-between text-xs text-muted-foreground mt-1">
                                <span>{usedStorage.toFixed(1)} GB used</span>
                                <span>{totalStorage} GB</span>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
          )}

          {dashboardWidgets.includes('news') && (
            <Card className="md:col-span-2 lg:col-span-3 bg-card/50 border-border">
                <CardHeader className="flex flex-row items-center justify-between p-4">
                    <CardTitle className="text-sm font-medium text-accent flex items-center gap-2">
                        <Newspaper className="w-4 h-4" /> HOLONET NEWS
                    </CardTitle>
                    <Button variant="ghost" onClick={() => openApp('News Feed')} className="text-xs text-accent hover:underline flex items-center gap-1 h-auto p-0">
                        View All <ArrowRight className="w-3 h-3" />
                    </Button>
                </CardHeader>
                <CardContent className="px-4 pb-4">
                    {isNewsLoading ? (
                        <div className="flex items-center gap-2 text-muted-foreground"><Loader2 className="w-4 h-4 animate-spin" /><span>Loading headlines...</span></div>
                    ) : (
                        <div className="space-y-4">
                            {news.map((item, index) => (
                                <div key={index} className="group cursor-pointer" onClick={() => openApp('News Feed')}>
                                    <p className="font-semibold text-foreground truncate group-hover:text-accent transition-colors">{item.title}</p>
                                    <p className="text-xs text-muted-foreground">{item.source} - {item.timestamp}</p>
                                </div>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  );
}
