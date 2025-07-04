"use client";

import { useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Loader2, Search, ServerCrash } from 'lucide-react';
import { summarizeUrl } from '@/ai/flows/summarize-url-flow';
import { useToast } from '@/hooks/use-toast';
import type { SummarizeUrlInput } from '@/ai/schemas';
import { SummarizeUrlInputSchema } from '@/ai/schemas';

export function Browser() {
  const [summary, setSummary] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SummarizeUrlInput>({
    resolver: zodResolver(SummarizeUrlInputSchema),
  });

  const onSubmit: SubmitHandler<SummarizeUrlInput> = async (data) => {
    setIsLoading(true);
    setSummary('');
    try {
      const result = await summarizeUrl(data);
      setSummary(result.summary);
    } catch (error) {
      console.error('Error summarizing URL:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to summarize the URL. The page might be inaccessible or the format is not supported.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full w-full">
      <div className="p-4 border-b border-primary/30">
        <form onSubmit={handleSubmit(onSubmit)} className="flex items-center gap-2">
          <Input
            {...register('url')}
            placeholder="https://example.com"
            autoComplete="off"
            className="flex-1 bg-black/30 border-primary/50 focus:ring-accent"
            disabled={isLoading}
          />
          <Button type="submit" size="icon" disabled={isLoading} className="bg-accent hover:bg-accent/80">
            {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
          </Button>
        </form>
        {errors.url && <p className="text-destructive text-xs mt-1">{errors.url.message}</p>}
      </div>
      <ScrollArea className="flex-1 p-4">
        {isLoading && (
          <div className="flex flex-col items-center justify-center h-full text-muted-foreground gap-2">
            <Loader2 className="w-8 h-8 animate-spin text-accent" />
            <p>Summarizing page...</p>
          </div>
        )}
        {summary && (
          <div className="prose prose-invert prose-sm max-w-none text-foreground">
            <h3 className="text-accent">Summary</h3>
            <p>{summary}</p>
          </div>
        )}
        {!isLoading && !summary && (
          <div className="flex flex-col items-center justify-center h-full text-muted-foreground gap-2">
            <Search className="w-16 h-16 text-primary/30" strokeWidth={1}/>
            <p>Enter a URL to get an AI-powered summary.</p>
          </div>
        )}
      </ScrollArea>
    </div>
  );
}
