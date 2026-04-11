"use client";

import { useState, useMemo } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Globe2, Loader2, FileText, ServerCrash, Zap, ExternalLink, ShieldCheck } from 'lucide-react';
import { summarizeUrl } from '@/ai/flows/summarize-url-flow';
import { browseUrl } from '@/ai/flows/browse-url-flow';
import type { SummarizeUrlInput, BrowseUrlOutput } from '@/ai/schemas';
import { SummarizeUrlInputSchema } from '@/ai/schemas';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/hooks/use-toast';
import { Tooltip, TooltipProvider, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

enum ViewMode {
  Idle,
  Browsing, // Standard Iframe
  AI_Portal, // Live Projection (Server-side fetch + Absoluteify)
  Loading,
  Summary,
  Error,
}

export function Browser() {
  const [viewContent, setViewContent] = useState<string | BrowseUrlOutput>('');
  const [currentUrl, setCurrentUrl] = useState('');
  const [viewMode, setViewMode] = useState<ViewMode>(ViewMode.Idle);
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    setError,
    getValues,
    setValue,
    formState: { errors },
  } = useForm<SummarizeUrlInput>({
    resolver: zodResolver(SummarizeUrlInputSchema),
  });
  
  const normalizeUrl = (url: string) => {
    let userUrl = url.trim();
    if (!userUrl) return null;

    if (!/^(https?:\/\/)/i.test(userUrl)) {
      userUrl = `https://${userUrl}`;
    }
    
    try {
      new URL(userUrl);
      return userUrl;
    } catch (error) {
      return null;
    }
  }

  const handlePortal: SubmitHandler<SummarizeUrlInput> = async (data) => {
    const userUrl = normalizeUrl(data.url);
    if (!userUrl) {
      setError('url', { type: 'manual', message: 'Please enter a valid URL.' });
      return;
    }
    
    setValue('url', userUrl);
    setCurrentUrl(userUrl);
    setViewMode(ViewMode.Loading);

    try {
      const result = await browseUrl({ url: userUrl });
      setViewContent(result);
      setViewMode(ViewMode.AI_Portal);
    } catch (e: any) {
        console.error("Portal Execution Error:", e);
        toast({
            variant: 'destructive',
            title: 'Projection Failure',
            description: e.message || 'System was unable to establish a projection.',
        });
        setViewMode(ViewMode.Error);
    }
  };

  const handleStandardBrowsing = async () => {
    const data = getValues();
    const userUrl = normalizeUrl(data.url);
    if (!userUrl) {
        setError('url', { type: 'manual', message: 'Enter a URL first.' });
        return;
    }
    setCurrentUrl(userUrl);
    setViewMode(ViewMode.Browsing);
  };
  
  const handleSummarize = async () => {
    const data = getValues();
    const userUrl = normalizeUrl(data.url);

    if (!userUrl) {
      setError('url', { type: 'manual', message: 'Please enter a URL to summarize.' });
      return;
    }
    
    setValue('url', userUrl);
    setViewMode(ViewMode.Loading);

    try {
      const result = await summarizeUrl({ url: userUrl });
      setViewContent(result.summary);
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

  // Memoize the HTML content to prevent unnecessary iframe reloads
  const portalHtml = useMemo(() => {
    if (viewMode !== ViewMode.AI_Portal || typeof viewContent === 'string') return '';
    const data = viewContent as BrowseUrlOutput;
    return data?.fullHtml || '';
  }, [viewContent, viewMode]);

  const renderContent = () => {
    switch (viewMode) {
      case ViewMode.Browsing:
        return (
            <iframe
              src={currentUrl}
              className="w-full h-full flex-1 bg-white"
              sandbox="allow-forms allow-same-origin allow-popups allow-scripts allow-popups-to-escape-sandbox"
              title="Browser"
              onError={() => setViewMode(ViewMode.Error)}
            />
        );
      case ViewMode.Loading:
        return (
            <div className="flex flex-col items-center justify-center h-full text-muted-foreground gap-4">
              <Loader2 className="w-16 h-16 animate-spin text-accent" />
              <p className="text-lg font-headline tracking-widest text-accent animate-pulse uppercase">Establishing Projection...</p>
              <p className="text-[10px] opacity-50 uppercase tracking-tighter text-center">Bypassing restrictions & absoluteifying assets</p>
            </div>
        );
      case ViewMode.AI_Portal:
        return (
            <div className="flex flex-col h-full w-full bg-white relative">
                <div className="absolute top-2 left-1/2 -translate-x-1/2 z-10 bg-black/80 backdrop-blur-md px-3 py-1 rounded-full border border-white/10 flex items-center gap-2 pointer-events-none">
                    <ShieldCheck className="w-3 h-3 text-green-400" />
                    <span className="text-[10px] font-mono text-white/60 tracking-widest uppercase">Live Projection Active</span>
                </div>
                <iframe
                    srcDoc={portalHtml}
                    className="w-full h-full border-0 flex-1"
                    sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-popups-to-escape-sandbox"
                    title="Live Site Projection"
                />
            </div>
        );
      case ViewMode.Summary:
        return (
            <ScrollArea className="h-full border border-primary/30 rounded-lg p-6 bg-black/20 m-2">
                <div className="prose prose-invert prose-sm max-w-none text-foreground whitespace-pre-wrap leading-loose">
                    <h2 className="text-accent font-headline tracking-widest uppercase mb-4 flex items-center gap-2">
                        <FileText className="w-5 h-5"/> Insight Summary
                    </h2>
                    {viewContent as string}
                </div>
            </ScrollArea>
        );
      case ViewMode.Error:
         return (
          <div className="flex flex-col items-center justify-center h-full text-destructive-foreground gap-2 bg-destructive/20 p-4 m-2 rounded-lg">
            <ServerCrash className="w-24 h-24" strokeWidth={1}/>
            <h3 className="text-xl font-bold font-headline">Projection Failure</h3>
            <p className="text-center max-w-md">The website is blocking portal connections or the server encountered a critical error.</p>
            <div className="mt-2 text-xs font-mono p-2 bg-black/30 rounded w-full text-center truncate">{currentUrl}</div>
          </div>
        )
      case ViewMode.Idle:
      default:
        return (
          <div className="flex flex-col items-center justify-center h-full text-muted-foreground gap-2">
            <Globe2 className="w-24 h-24 text-primary/10" strokeWidth={0.5}/>
            <p className="font-headline text-lg tracking-widest uppercase opacity-50">Web Browser</p>
            <p className="text-xs">Enter a URL to access the decentralized web.</p>
          </div>
        )
    }
  }

  return (
    <TooltipProvider>
      <div className="flex flex-col h-full w-full bg-black">
        <div className="p-4 border-b border-primary/30 bg-card/30 backdrop-blur-md flex-shrink-0">
          <form onSubmit={handleSubmit(handlePortal)} className="flex items-center gap-2">
            <div className="relative flex-1 group">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-accent transition-colors" />
                <Input
                {...register('url')}
                placeholder="search the nexus..."
                autoComplete="off"
                className="pl-10 bg-black/30 border-primary/50 focus:ring-accent h-10"
                />
            </div>
            
            <Tooltip>
              <TooltipTrigger asChild>
                <Button type="submit" size="icon" className="bg-accent hover:bg-accent/80 text-accent-foreground" title="Go (Live Projection)">
                  <Zap className="w-4 h-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent><p>Go: Establish Live Projection (Bypass Restrictions)</p></TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button type="button" onClick={handleStandardBrowsing} size="icon" variant="secondary" title="Standard Iframe Mode">
                  <Globe2 className="w-4 h-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent><p>Standard Mode (Direct Iframe)</p></TooltipContent>
            </Tooltip>

            <div className="w-px h-6 bg-border mx-1" />

            <Tooltip>
              <TooltipTrigger asChild>
                <Button type="button" onClick={handleSummarize} size="icon" variant="secondary" title="Summarize with AI">
                  <FileText className="w-4 h-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent><p>Summarize Page</p></TooltipContent>
            </Tooltip>
          </form>
          {errors.url && <p className="text-destructive text-xs mt-1">{errors.url.message}</p>}
        </div>
        <div className="flex-1 flex flex-col overflow-hidden">
          {renderContent()}
        </div>
      </div>
    </TooltipProvider>
  );
}
