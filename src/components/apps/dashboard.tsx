
"use client";

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getQuote, QuoteOutput } from '@/ai/flows/quote-flow';
import { get, set } from '@/lib/idb';
import { Calendar, Bot, Loader2, User, Newspaper, ArrowRight } from 'lucide-react';
import { useSettings } from '@/contexts/settings-context';
import { getNewsFeed } from '@/ai/flows/news-feed-flow';
import type { NewsItem } from '@/ai/flows/news-feed-flow';
import { useDesktopActions } from '@/contexts/desktop-actions-context';

export function Dashboard() {
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [quote, setQuote] = useState<QuoteOutput | null>(null);
  const [isQuoteLoading, setIsQuoteLoading] = useState(true);
  const { username } = useSettings();
  const [news, setNews] = useState<NewsItem[]>([]);
  const [isNewsLoading, setIsNewsLoading] = useState(true);
  const { openApp } = useDesktopActions();

  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date();
      setDate(now.toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' }));
      setTime(now.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' }));
    };
    
    updateDateTime();
    const timerId = setInterval(updateDateTime, 1000 * 60); 

    return () => clearInterval(timerId);
  }, []);

  useEffect(() => {
    const fetchQuote = async () => {
        setIsQuoteLoading(true);
        const cacheKey = 'daily-quote';
    
        try {
            const cachedData = await get<{ quote: QuoteOutput; timestamp: number }>(cacheKey);
            const now = new Date().getTime();
            
            if (cachedData && (now - cachedData.timestamp < 12 * 60 * 60 * 1000)) {
                setQuote(cachedData.quote);
                return;
            }
    
            const newQuote = await getQuote();
            setQuote(newQuote);
            await set(cacheKey, { quote: newQuote, timestamp: now });
    
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
  }, []);

  useEffect(() => {
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
  }, []);

  return (
    <div className="h-full w-full p-4 sm:p-6 overflow-y-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        
        <Card className="bg-card/50 border-border">
           <CardHeader className="p-3">
            <CardTitle className="text-xs font-medium text-accent">WELCOME</CardTitle>
          </CardHeader>
          <CardContent className="p-3 pt-0">
            <div className="flex items-center gap-2">
              <User className="w-5 h-5 text-muted-foreground" />
              <div>
                <p className="text-base font-bold text-foreground truncate">{username}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card/50 border-border">
          <CardHeader className="flex flex-row items-center justify-between p-3 pb-1">
            <CardTitle className="text-xs font-medium text-accent">AI INSIGHT</CardTitle>
            <Bot className="w-3 h-3 text-muted-foreground" />
          </CardHeader>
          <CardContent className="p-3 pt-0 min-h-[4rem] flex items-center">
            {isQuoteLoading ? (
                <div className="flex items-center gap-2 text-muted-foreground h-full">
                    <Loader2 className="w-3 h-3 animate-spin" />
                    <span className="text-xs">Generating...</span>
                </div>
            ) : (
                <p className="text-xs font-medium text-foreground">"{quote?.quote}"</p>
            )}
          </CardContent>
        </Card>
        
        <Card className="bg-card/50 border-border">
          <CardHeader className="flex flex-row items-center justify-between p-3 pb-1">
            <CardTitle className="text-xs font-medium text-accent">SYSTEM TIME</CardTitle>
            <Calendar className="w-3 h-3 text-muted-foreground" />
          </CardHeader>
          <CardContent className="p-3 pt-0">
            <div className="text-lg font-bold text-foreground text-center">{time}</div>
            <p className="text-[10px] text-muted-foreground text-center truncate">{date}</p>
          </CardContent>
        </Card>

        <Card className="md:col-span-2 xl:col-span-3 bg-card/50 border-border">
            <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-sm font-medium text-accent flex items-center gap-2">
                    <Newspaper className="w-4 h-4" /> HOLONET NEWS
                </CardTitle>
                <button onClick={() => openApp('News Feed')} className="text-xs text-accent hover:underline flex items-center gap-1">
                    View All <ArrowRight className="w-3 h-3" />
                </button>
            </CardHeader>
            <CardContent>
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

      </div>
    </div>
  );
}
