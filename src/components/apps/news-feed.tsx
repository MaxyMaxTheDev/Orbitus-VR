"use client";

import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { getNewsFeed, NewsFeedOutput } from '@/ai/flows/news-feed-flow';
import { Loader2, Newspaper, RefreshCw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export function NewsFeedApp() {
  const [feed, setFeed] = useState<NewsFeedOutput | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const fetchFeed = useCallback(async () => {
    setIsLoading(true);
    try {
      const newsFeed = await getNewsFeed();
      setFeed(newsFeed);
    } catch (error: any) {
      console.error('Error fetching news feed:', error);
      const description = error.message?.includes('429') 
        ? 'AI quota exceeded. Please try again later.'
        : 'Failed to fetch the latest news feed.';
      toast({
        variant: 'destructive',
        title: 'Error',
        description,
      });
      // Set a fallback error state for the UI
      setFeed({
        articles: [{ title: 'HoloNet Signal Lost', source: 'System', timestamp: 'Now', description: 'Could not retrieve data from the news stream.' }]
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchFeed();
  }, [fetchFeed]);

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex items-center justify-center h-full text-muted-foreground gap-2">
          <Loader2 className="w-8 h-8 animate-spin text-accent" />
          <p className="font-headline">Fetching HoloNet News...</p>
        </div>
      );
    }

    if (!feed || feed.articles.length === 0) {
      return (
        <div className="flex items-center justify-center h-full text-muted-foreground">
          <p>No news available at this time.</p>
        </div>
      );
    }

    return (
      <ScrollArea className="h-full">
        <div className="space-y-4">
          {feed.articles.map((article, index) => (
            <div key={index} className="p-4 rounded-lg bg-black/20 border border-primary/10 hover:border-primary/30 transition-colors">
              <h3 className="font-semibold text-foreground mb-1">{article.title}</h3>
              <div className="flex justify-between items-center text-xs text-muted-foreground">
                <span>{article.source}</span>
                <span>{article.timestamp}</span>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    );
  };
  
  return (
    <div className="h-full w-full p-4 flex flex-col">
      <Card className="w-full flex-1 flex flex-col bg-transparent border-primary/30">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-accent text-xl tracking-wider flex items-center gap-2">
            <Newspaper />
            HoloNet News
          </CardTitle>
          <Button variant="ghost" size="icon" onClick={fetchFeed} disabled={isLoading}>
            <RefreshCw className={isLoading ? 'animate-spin' : ''} />
          </Button>
        </CardHeader>
        <CardContent className="flex-1 overflow-hidden p-4 pt-0">
          {renderContent()}
        </CardContent>
      </Card>
    </div>
  );
}
