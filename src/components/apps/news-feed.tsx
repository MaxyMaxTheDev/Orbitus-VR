"use client";

import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Loader2, Newspaper, RefreshCw, ArrowLeft, ExternalLink } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { AnimatePresence, motion } from 'framer-motion';

type RealNewsItem = {
  title: string;
  source: string;
  timestamp: string;
  content: string;
  link: string;
};

export function NewsFeedApp() {
  const [feed, setFeed] = useState<RealNewsItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedArticle, setSelectedArticle] = useState<RealNewsItem | null>(null);
  const { toast } = useToast();

  const fetchFeed = useCallback(async () => {
    setIsLoading(true);
    setSelectedArticle(null);
    try {
      // Using a public RSS to JSON converter for Google News
      const response = await fetch('https://api.rss2json.com/v1/api.json?rss_url=https://news.google.com/rss');
      if (!response.ok) throw new Error('Failed to fetch real news.');
      
      const data = await response.json();
      
      const newsItems: RealNewsItem[] = data.items.map((item: any) => ({
        title: item.title,
        source: item.author || 'Google News',
        timestamp: new Date(item.pubDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        content: item.description.replace(/<[^>]*>?/gm, ''), // Basic HTML cleaning
        link: item.link
      }));

      setFeed(newsItems);
    } catch (error: any) {
      console.error('Error fetching news feed:', error);
      toast({
        variant: 'destructive',
        title: 'Network Error',
        description: 'Failed to connect to the news server.',
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchFeed();
  }, [fetchFeed]);

  const renderArticleList = () => {
    if (isLoading) {
      return (
        <div className="flex flex-col items-center justify-center h-full text-muted-foreground gap-4">
          <Loader2 className="w-12 h-12 animate-spin text-accent" />
          <p className="font-headline tracking-widest uppercase">Syncing Real-Time Feed...</p>
        </div>
      );
    }

    if (feed.length === 0) {
      return (
        <div className="flex items-center justify-center h-full text-muted-foreground">
          <p>No headlines available at this time.</p>
        </div>
      );
    }

    return (
      <div className="space-y-4">
        {feed.map((article, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
            onClick={() => setSelectedArticle(article)}
            className="p-4 rounded-lg bg-black/20 border border-primary/10 hover:border-accent transition-all duration-200 cursor-pointer hover:bg-black/30 group"
          >
            <h3 className="font-semibold text-foreground mb-1 group-hover:text-accent transition-colors">{article.title}</h3>
            <div className="flex justify-between items-center text-xs text-muted-foreground">
              <span className="font-bold uppercase tracking-wider">{article.source}</span>
              <span>{article.timestamp}</span>
            </div>
          </motion.div>
        ))}
      </div>
    );
  };
  
  const renderArticleDetail = () => {
    if (!selectedArticle) return null;

    return (
      <div className="flex flex-col">
        <div className="flex-shrink-0 mb-4 flex justify-between items-center">
          <Button variant="ghost" onClick={() => setSelectedArticle(null)} className="text-muted-foreground hover:text-foreground">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Feed
          </Button>
          <Button variant="outline" asChild className="border-accent text-accent hover:bg-accent hover:text-accent-foreground">
            <a href={selectedArticle.link} target="_blank" rel="noopener noreferrer">
                Read Full Story <ExternalLink className="ml-2 h-4 w-4" />
            </a>
          </Button>
        </div>
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-accent">{selectedArticle.title}</h2>
          <div className="flex justify-between items-center text-sm text-muted-foreground border-b border-primary/20 pb-2">
            <span>Source: {selectedArticle.source}</span>
            <span>{selectedArticle.timestamp}</span>
          </div>
          <div className="prose prose-invert prose-sm max-w-none text-foreground/90 leading-relaxed">
            {selectedArticle.content || "Click 'Read Full Story' to view the article on the official news site."}
          </div>
        </div>
      </div>
    );
  };

  const Content = () => {
    if (isLoading && !selectedArticle) {
      return renderArticleList();
    }
    return (
      <AnimatePresence mode="wait">
        <motion.div
          key={selectedArticle ? 'article' : 'list'}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          {selectedArticle ? renderArticleDetail() : renderArticleList()}
        </motion.div>
      </AnimatePresence>
    );
  }

  return (
    <div className="h-full w-full p-4 flex flex-col">
      <Card className="w-full flex-1 flex flex-col bg-transparent border-primary/30 shadow-2xl">
        <CardHeader className="flex flex-row items-center justify-between border-b border-primary/10">
          <CardTitle className="text-accent text-xl tracking-wider flex items-center gap-2 font-headline">
            <Newspaper />
            GLOBAL NEWS FEED
          </CardTitle>
          <Button variant="ghost" size="icon" onClick={fetchFeed} disabled={isLoading} className="hover:bg-accent/20">
            <RefreshCw className={isLoading ? 'animate-spin' : ''} />
          </Button>
        </CardHeader>
        <CardContent className="flex-1 overflow-hidden p-4">
          <ScrollArea className="h-full w-full pr-4">
            <Content />
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
}
