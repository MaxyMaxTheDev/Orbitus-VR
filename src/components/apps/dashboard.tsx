
"use client";

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getQuote, QuoteOutput } from '@/ai/flows/quote-flow';
import { get, set } from '@/lib/idb';
import { Calendar, Bot, Loader2, User } from 'lucide-react';
import { useSettings } from '@/contexts/settings-context';

export function Dashboard() {
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [quote, setQuote] = useState<QuoteOutput | null>(null);
  const [isQuoteLoading, setIsQuoteLoading] = useState(true);
  const { username } = useSettings();

  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date();
      setDate(now.toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }));
      setTime(now.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' }));
    };
    
    updateDateTime();
    const timerId = setInterval(updateDateTime, 1000 * 60); 

    const fetchQuote = async () => {
        setIsQuoteLoading(true);
        const cacheKey = 'daily-quote';
    
        try {
            const cachedData = await get<{ quote: QuoteOutput; timestamp: number }>(cacheKey);
            const now = new Date().getTime();
            
            // Cache is valid for 12 hours.
            if (cachedData && (now - cachedData.timestamp < 12 * 60 * 60 * 1000)) {
                setQuote(cachedData.quote);
                return;
            }
    
            // If cache is stale or doesn't exist, fetch a new one.
            const newQuote = await getQuote();
            setQuote(newQuote);
            await set(cacheKey, { quote: newQuote, timestamp: now });
    
        } catch (err: any) {
            console.error("Failed to load new quote:", err);
            // On error, try to use a stale quote from cache if available.
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

    return () => clearInterval(timerId);
  }, []);

  return (
    <div className="h-full w-full p-4 sm:p-6 overflow-y-auto">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        <Card className="bg-card/50 border-border lg:col-span-1">
           <CardHeader>
            <CardTitle className="text-sm font-medium text-accent">WELCOME</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-3">
              <User className="w-8 h-8 text-muted-foreground" />
              <div>
                <p className="text-lg font-bold text-foreground">{username}</p>
                <p className="text-xs text-muted-foreground">Virtual space ready.</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2 bg-card/50 border-border">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-accent">AI INSIGHT</CardTitle>
            <Bot className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="h-20">
            {isQuoteLoading ? (
                <div className="flex items-center gap-2 text-muted-foreground h-full">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Generating insight...</span>
                </div>
            ) : (
                <div>
                  <p className="text-base font-medium text-foreground">"{quote?.quote}"</p>
                  <p className="text-xs text-muted-foreground text-right mt-1">- {quote?.author}</p>
                </div>
            )}
          </CardContent>
        </Card>
        
        <Card className="bg-card/50 border-border lg:col-span-1">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-accent">SYSTEM TIME</CardTitle>
            <Calendar className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground text-center">{time}</div>
            <p className="text-xs text-muted-foreground text-center truncate">{date}</p>
          </CardContent>
        </Card>

      </div>
    </div>
  );
}
