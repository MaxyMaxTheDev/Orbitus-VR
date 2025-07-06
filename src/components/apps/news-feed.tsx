
"use client";

import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { getNewsFeed } from '@/ai/flows/news-feed-flow';
import type { NewsFeedOutput, NewsItem } from '@/ai/flows/news-feed-flow';
import { Loader2, Newspaper, RefreshCw, ArrowLeft } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { AnimatePresence, motion } from 'framer-motion';

export function NewsFeedApp() {
  const [feed, setFeed] = useState<NewsFeedOutput | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedArticle, setSelectedArticle] = useState<NewsItem | null>(null);
  const { toast } = useToast();

  const fetchFeed = useCallback(async () => {
    setIsLoading(true);
    setSelectedArticle(null); // Return to list view on refresh
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
      setFeed({
        articles: [{ title: 'HoloNet Signal Lost', source: 'System', timestamp: 'Now', content: 'Could not retrieve data from the news stream. Please check your connection or AI API key and try again.' }]
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
      <div className="space-y-4">
        {feed.articles.map((article, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
            onClick={() => setSelectedArticle(article)}
            className="p-4 rounded-lg bg-black/20 border border-primary/10 hover:border-primary/30 transition-all duration-200 cursor-pointer hover:bg-black/30"
          >
            <h3 className="font-semibold text-foreground mb-1">{article.title}</h3>
            <div className="flex justify-between items-center text-xs text-muted-foreground">
              <span>{article.source}</span>
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
        <div className="flex-shrink-0 mb-4">
          <Button variant="ghost" onClick={() => setSelectedArticle(null)} className="text-muted-foreground hover:text-foreground">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Feed
          </Button>
        </div>
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-accent">{selectedArticle.title}</h2>
          <div className="flex justify-between items-center text-sm text-muted-foreground border-b border-primary/20 pb-2">
            <span>From: {selectedArticle.source}</span>
            <span>{selectedArticle.timestamp}</span>
          </div>
          <div className="prose prose-invert prose-sm max-w-none text-foreground/90 whitespace-pre-wrap">
            {selectedArticle.content}
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
          <ScrollArea className="h-full w-full pr-4">
            <Content />
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
}
