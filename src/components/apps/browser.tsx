
"use client";

import { useState, useEffect } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Globe2, Loader2, FileText, ServerCrash, ShieldAlert } from 'lucide-react';
import { summarizeUrl } from '@/ai/flows/summarize-url-flow';
import { browseUrl } from '@/ai/flows/browse-url-flow';
import type { SummarizeUrlInput, BrowseUrlInput } from '@/ai/schemas';
import { SummarizeUrlInputSchema } from '@/ai/schemas';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/hooks/use-toast';

enum ViewMode {
  Idle,
  Browsing,
  Summarizing,
  Summary,
  Error,
  IframeBlocked,
}

export function Browser() {
  const [viewContent, setViewContent] = useState('');
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

  const handleNavigation: SubmitHandler<SummarizeUrlInput> = async (data) => {
    const userUrl = normalizeUrl(data.url);
    if (!userUrl) {
      setError('url', { type: 'manual', message: 'Please enter a valid URL.' });
      setViewMode(ViewMode.Error);
      return;
    }
    
    setValue('url', userUrl);
    setCurrentUrl(userUrl);
    setViewContent('');
    setViewMode(ViewMode.Browsing);
    
    try {
        const result = await browseUrl({ url: userUrl });
        setViewContent(result.html);
        // This is a heuristic: if we get content but it's very small, it might be an error page.
        // A better check is to see if the iframe loads.
        if (result.html.length < 200 && result.html.includes("Error")) {
          setViewMode(ViewMode.Error);
        }
    } catch (e: any) {
         toast({
            variant: 'destructive',
            title: 'Browsing Failed',
            description: e.message || 'The server could not load the URL.',
        });
        setViewContent(`<h1>Failed to load page</h1><p>${e.message}</p>`);
        setViewMode(ViewMode.Error);
    }
  };
  
  const handleSummarize = async () => {
    const data = getValues();
    const userUrl = normalizeUrl(data.url);

    if (!userUrl) {
      setError('url', { type: 'manual', message: 'Please enter a URL to summarize.' });
      setViewMode(ViewMode.Error);
      return;
    }
    
    setValue('url', userUrl);
    setCurrentUrl(userUrl);
    setViewMode(ViewMode.Summarizing);
    setViewContent('');

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

  useEffect(() => {
    if (viewMode !== ViewMode.Browsing || !viewContent) return;

    // Heuristic to detect if the iframe was blocked by X-Frame-Options.
    // We set a timeout. If the iframe's content hasn't loaded (and it's still blank),
    // we assume it was blocked.
    const timer = setTimeout(() => {
      // A truly blank iframe loaded via srcDoc will have a body but no other elements.
      // This is a rough check.
      if (document.querySelector('iframe')?.contentDocument?.body?.childElementCount === 0) {
        setViewMode(ViewMode.IframeBlocked);
      }
    }, 2000); // 2-second timeout

    return () => clearTimeout(timer);
  }, [viewContent, viewMode]);
  
  const handleFixConnection = () => {
    const userAgent = navigator.userAgent.toLowerCase();
    let url = '';

    if (userAgent.includes("firefox")) {
      url = 'https://addons.mozilla.org/en-US/firefox/addon/ignore-x-frame-options-header/';
    } else { // Assume Chrome or other Chromium-based browsers
      url = 'https://chromewebstore.google.com/detail/ignore-x-frame-headers/gleekbfjekiniecknbkamfmkohkpodhe';
    }

    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const renderContent = () => {
    switch (viewMode) {
      case ViewMode.Browsing:
        return (
          viewContent 
          ? <iframe
              srcDoc={viewContent}
              className="w-full h-full flex-1 bg-white"
              sandbox="allow-forms allow-same-origin allow-popups allow-scripts" // allow-scripts for sites that need it
              title="Browser"
            />
          : <div className="flex flex-col items-center justify-center h-full text-muted-foreground gap-4">
              <Loader2 className="w-16 h-16 animate-spin text-accent" />
              <p className="text-lg font-headline tracking-widest text-accent">CONNECTING TO SERVER...</p>
            </div>
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
            <ScrollArea className="h-full border border-primary/30 rounded-lg p-4 bg-black/20">
                <div className="prose prose-invert prose-sm max-w-none text-foreground whitespace-pre-wrap">
                    {viewContent}
                </div>
            </ScrollArea>
        );
      case ViewMode.IframeBlocked:
        return (
          <div className="flex flex-col items-center justify-center h-full text-foreground gap-4 bg-destructive/10 rounded-lg p-4 text-center">
            <ShieldAlert className="w-24 h-24 text-destructive" strokeWidth={1}/>
            <h3 className="text-xl font-bold font-headline">Connection Refused</h3>
            <p className="max-w-md">The website at <span className="font-mono text-accent bg-black/20 p-1 rounded">{currentUrl}</span> is preventing it from being displayed here.</p>
            <p className="text-sm text-muted-foreground">This is often due to a security setting called 'X-Frame-Options'. You can install a browser extension to bypass this for browsing within XenovaVR.</p>
            <Button onClick={handleFixConnection} className='mt-4'>
                <Download className="mr-2 h-4 w-4" />
                Get Browser Extension
            </Button>
          </div>
        );
      case ViewMode.Error:
         return (
          <div className="flex flex-col items-center justify-center h-full text-destructive-foreground gap-2 bg-destructive/20 rounded-lg p-4">
            <ServerCrash className="w-24 h-24" strokeWidth={1}/>
            <h3 className="text-xl font-bold font-headline">Connection Error</h3>
            <p className="text-center">The requested URL could not be loaded by the server.</p>
            <div className="mt-2 text-xs font-mono p-2 bg-black/30 rounded w-full text-center truncate">{currentUrl}</div>
          </div>
        )
      case ViewMode.Idle:
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
