
"use client";

import { useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Globe2, Loader2, FileText } from 'lucide-react';
import { summarizeUrl } from '@/ai/flows/summarize-url-flow';
import type { SummarizeUrlInput } from '@/ai/schemas';
import { SummarizeUrlInputSchema } from '@/ai/schemas';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/hooks/use-toast';

enum ViewMode {
  Idle,
  Browsing,
  Summarizing,
  Summary,
  Error,
}

export function Browser() {
  const [displayUrl, setDisplayUrl] = useState('');
  const [summary, setSummary] = useState('');
  const [viewMode, setViewMode] = useState<ViewMode>(ViewMode.Idle);
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    setError,
    getValues,
    formState: { errors },
  } = useForm<SummarizeUrlInput>({
    resolver: zodResolver(SummarizeUrlInputSchema),
  });

  const handleNavigation: SubmitHandler<SummarizeUrlInput> = async (data) => {
    setViewMode(ViewMode.Browsing);
    let userUrl = data.url.trim();
    if (!/^(https?:\/\/)/i.test(userUrl)) {
      userUrl = `https://${userUrl}`;
    }

    try {
      // Validate the final URL format
      new URL(userUrl);
      setDisplayUrl(userUrl);
    } catch (error) {
      setError('url', {
        type: 'manual',
        message: 'Please enter a valid URL.',
      });
      setDisplayUrl('');
      setViewMode(ViewMode.Error);
    }
  };
  
  const handleSummarize = async () => {
    const data = getValues();
    if (!data.url) {
      setError('url', { type: 'manual', message: 'Please enter a URL to summarize.' });
      setViewMode(ViewMode.Error);
      return;
    }
    
    setViewMode(ViewMode.Summarizing);
    setSummary('');

    try {
      const result = await summarizeUrl({ url: data.url });
      setSummary(result.summary);
      setViewMode(ViewMode.Summary);
    } catch (e: any) {
        toast({
            variant: 'destructive',
            title: 'Summarization Failed',
            description: e.message || 'The AI could not summarize the URL.',
        });
        setViewMode(ViewMode.Idle);
    }
  }
  
  const renderContent = () => {
    switch (viewMode) {
      case ViewMode.Browsing:
        return (
          <>
            <p className="text-xs text-muted-foreground text-center flex-shrink-0">
              Note: For security reasons, many websites block being embedded. If the page below is blank, please try another URL or the Summarize function.
            </p>
            <iframe
              src={displayUrl}
              className="w-full h-full flex-1 rounded-lg border-2 border-primary/30"
              title="Browser"
              sandbox="allow-scripts allow-same-origin allow-forms"
            />
          </>
        );
      case ViewMode.Summarizing:
        return (
            <div className="flex flex-col items-center justify-center h-full text-muted-foreground gap-4">
              <Loader2 className="w-16 h-16 animate-spin text-accent" />
              <p className="text-lg font-headline tracking-widest text-accent">AI IS SUMMARIZING...</p>
            </div>
        );
      case ViewMode.Summary:
        return (
            <ScrollArea className="h-full">
                <div className="prose prose-invert prose-sm max-w-none text-foreground whitespace-pre-wrap p-4">
                    {summary}
                </div>
            </ScrollArea>
        );
      case ViewMode.Idle:
      case ViewMode.Error:
      default:
        return (
          <div className="flex flex-col items-center justify-center h-full text-muted-foreground gap-2">
            <Globe2 className="w-24 h-24 text-primary/10" strokeWidth={0.5}/>
            <p className="font-headline text-lg">Web Browser</p>
            <p>Enter a URL to browse or summarize.</p>
          </div>
        )
    }
  }

  return (
    <div className="flex flex-col h-full w-full">
      <div className="p-4 border-b border-primary/30">
        <form onSubmit={handleSubmit(handleNavigation)} className="flex items-center gap-2">
          <Input
            {...register('url')}
            placeholder="example.com"
            autoComplete="off"
            className="flex-1 bg-black/30 border-primary/50 focus:ring-accent"
          />
          <Button type="submit" size="icon" className="bg-accent hover:bg-accent/80 text-accent-foreground" title="Browse URL">
            <Search className="w-4 h-4" />
          </Button>
          <Button type="button" onClick={handleSummarize} size="icon" variant="secondary" title="Summarize URL with AI">
            <FileText className="w-4 h-4" />
          </Button>
        </form>
        {errors.url && <p className="text-destructive text-xs mt-1">{errors.url.message}</p>}
      </div>
      <div className="flex-1 p-4 flex flex-col gap-4 overflow-hidden">
        {renderContent()}
      </div>
    </div>
  );
}
