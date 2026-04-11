"use client";

import { useState, useMemo, useEffect, useCallback } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Globe2, Loader2, FileText, ServerCrash, Zap, ShieldCheck, ChevronLeft, ChevronRight, RefreshCw } from 'lucide-react';
import { summarizeUrl } from '@/ai/flows/summarize-url-flow';
import { browseUrl } from '@/ai/flows/browse-url-flow';
import type { SummarizeUrlInput, BrowseUrlOutput } from '@/ai/schemas';
import { SummarizeUrlInputSchema } from '@/ai/schemas';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/hooks/use-toast';
import { Tooltip, TooltipProvider, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';

enum ViewMode {
  Idle,
  Browsing,
  AI_Portal,
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

  const establishPortal = useCallback(async (targetUrl: string) => {
    const userUrl = normalizeUrl(targetUrl);
    if (!userUrl) return;
    
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
  }, [setValue, toast]);

  const handlePortalForm: SubmitHandler<SummarizeUrlInput> = (data) => {
    establishPortal(data.url);
  };

  // Listen for navigation messages from the projected site's interceptor
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
        if (event.data?.type === 'PORTAL_NAVIGATE' && event.data?.url) {
            establishPortal(event.data.url);
        }
    };
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [establishPortal]);

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

  const portalHtml = useMemo(() => {
    if (viewMode !== ViewMode.AI_Portal || typeof viewContent === 'string') return '';
    const data = viewContent as BrowseUrlOutput;
    return data?.fullHtml || '';
  }, [viewContent, viewMode]);

  const renderContent = () => {
    switch (viewMode) {
      case ViewMode.Loading:
        return (
            <div className="flex flex-col items-center justify-center h-full text-muted-foreground gap-4 bg-black">
              <Loader2 className="w-16 h-16 animate-spin text-accent" />
              <p className="text-lg font-headline tracking-widest text-accent animate-pulse uppercase">Establishing Projection...</p>
              <p className="text-[10px] opacity-50 uppercase tracking-tighter text-center">Bypassing security headers & re-routing assets</p>
            </div>
        );
      case ViewMode.AI_Portal:
        return (
            <div className="flex flex-col h-full w-full bg-white relative overflow-hidden">
                <div className="absolute top-2 left-1/2 -translate-x-1/2 z-10 bg-black/80 backdrop-blur-md px-3 py-1 rounded-full border border-white/10 flex items-center gap-2 pointer-events-none shadow-2xl transition-opacity duration-1000">
                    <ShieldCheck className="w-3 h-3 text-green-400" />
                    <span className="text-[10px] font-mono text-white/60 tracking-widest uppercase">Live Virtual Projection Active</span>
                </div>
                <iframe
                    srcDoc={portalHtml}
                    className="w-full h-full border-0 flex-1"
                    sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
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
          <div className="flex flex-col items-center justify-center h-full text-destructive-foreground gap-2 bg-destructive/20 p-4 rounded-lg m-2">
            <ServerCrash className="w-24 h-24" strokeWidth={1}/>
            <h3 className="text-xl font-bold font-headline">Projection Failure</h3>
            <p className="text-center max-w-md">The remote host is blocking virtual connections or the projection engine failed.</p>
            <div className="mt-2 text-xs font-mono p-2 bg-black/30 rounded w-full text-center truncate">{currentUrl}</div>
          </div>
        )
      case ViewMode.Idle:
      default:
        return (
          <div className="flex flex-col items-center justify-center h-full text-muted-foreground gap-2 bg-black">
            <Globe2 className="w-24 h-24 text-primary/10" strokeWidth={0.5}/>
            <p className="font-headline text-lg tracking-widest uppercase opacity-50">Web Browser</p>
            <p className="text-xs">Enter a URL to establish a virtual projection.</p>
          </div>
        )
    }
  }

  return (
    <TooltipProvider>
      <div className="flex flex-col h-full w-full bg-black overflow-hidden">
        <div className="p-2 border-b border-primary/20 bg-card/30 backdrop-blur-md flex-shrink-0 flex items-center gap-2">
          
          <div className="flex items-center gap-1 px-2">
             <Button variant="ghost" size="icon" className="w-8 h-8 rounded-full" disabled><ChevronLeft className="w-4 h-4"/></Button>
             <Button variant="ghost" size="icon" className="w-8 h-8 rounded-full" disabled><ChevronRight className="w-4 h-4"/></Button>
             <Button variant="ghost" size="icon" className="w-8 h-8 rounded-full" onClick={() => establishPortal(currentUrl)}><RefreshCw className="w-4 h-4"/></Button>
          </div>

          <form onSubmit={handleSubmit(handlePortalForm)} className="flex-1 flex items-center gap-2">
            <div className="relative flex-1 group">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-accent transition-colors" />
                <Input
                {...register('url')}
                placeholder="search the nexus..."
                autoComplete="off"
                className="pl-10 bg-black/30 border-primary/30 focus:ring-accent h-9 rounded-full text-xs"
                />
            </div>
            
            <Tooltip>
              <TooltipTrigger asChild>
                <Button type="submit" size="icon" className="bg-accent hover:bg-accent/80 text-accent-foreground w-9 h-9 rounded-full">
                  <Zap className="w-4 h-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent><p>Establish Live Virtual Projection</p></TooltipContent>
            </Tooltip>

            <div className="w-px h-6 bg-border mx-1" />

            <Tooltip>
              <TooltipTrigger asChild>
                <Button type="button" onClick={handleSummarize} size="icon" variant="ghost" className="w-9 h-9 rounded-full text-muted-foreground hover:text-accent">
                  <FileText className="w-4 h-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent><p>Summarize Page with AI</p></TooltipContent>
            </Tooltip>
          </form>
        </div>
        <div className="flex-1 overflow-hidden relative">
          {renderContent()}
        </div>
      </div>
    </TooltipProvider>
  );
}
