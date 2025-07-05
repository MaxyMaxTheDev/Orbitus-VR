
"use client";

import { useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Globe2 } from 'lucide-react';
import type { SummarizeUrlInput } from '@/ai/schemas';
import { SummarizeUrlInputSchema } from '@/ai/schemas';

export function Browser() {
  const [displayUrl, setDisplayUrl] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SummarizeUrlInput>({
    resolver: zodResolver(SummarizeUrlInputSchema),
  });

  const onSubmit: SubmitHandler<SummarizeUrlInput> = async (data) => {
    setDisplayUrl(data.url);
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
          />
          <Button type="submit" size="icon" className="bg-accent hover:bg-accent/80 text-accent-foreground">
            <Search className="w-4 h-4" />
          </Button>
        </form>
        {errors.url && <p className="text-destructive text-xs mt-1">{errors.url.message}</p>}
      </div>
      <div className="flex-1 p-4 flex flex-col gap-4">
        {displayUrl ? (
          <>
            <p className="text-xs text-muted-foreground text-center flex-shrink-0">
              Note: For security reasons, many websites block being embedded. If the page below is blank, please try another URL.
            </p>
            <iframe
              src={displayUrl}
              className="w-full h-full flex-1 rounded-lg border-2 border-primary/30"
              title="Browser"
              sandbox="allow-scripts allow-same-origin allow-forms"
            />
          </>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-muted-foreground gap-2">
            <Globe2 className="w-24 h-24 text-primary/10" strokeWidth={0.5}/>
            <p className="font-headline text-lg">Web Browser</p>
            <p>Enter a URL to begin browsing.</p>
          </div>
        )}
      </div>
    </div>
  );
}
