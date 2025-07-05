
"use client";

import { useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Loader2, Wand2, Code, ServerCrash } from 'lucide-react';
import { explainCode } from '@/ai/flows/explain-code-flow';
import { useToast } from '@/hooks/use-toast';
import { ExplainCodeInputSchema } from '@/ai/schemas';
import type { ExplainCodeInput } from '@/ai/schemas';

export function DevKit() {
  const [explanation, setExplanation] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ExplainCodeInput>({
    resolver: zodResolver(ExplainCodeInputSchema),
    defaultValues: {
      code: `function greeting(name) {\n  return \`Hello, \${name}!\`;\n}`
    }
  });

  const onSubmit: SubmitHandler<ExplainCodeInput> = async (data) => {
    setIsLoading(true);
    setExplanation('');
    try {
      const result = await explainCode(data);
      setExplanation(result.explanation);
    } catch (error) {
      console.error('Error explaining code:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to get an explanation from the AI.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-full w-full p-4 gap-4">
        <div className="flex-[1] flex flex-col gap-2">
            <h3 className="text-accent font-semibold">Code Input</h3>
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col h-full gap-2">
                <Textarea
                    {...register('code')}
                    placeholder="Enter your code here..."
                    className="flex-1 bg-black/30 border-primary/50 focus:ring-accent font-code resize-none"
                    disabled={isLoading}
                />
                {errors.code && <p className="text-destructive text-xs">{errors.code.message}</p>}
                <Button type="submit" disabled={isLoading} className="w-full bg-accent hover:bg-accent/80">
                    {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Wand2 className="w-4 h-4" />}
                    Explain Code
                </Button>
            </form>
        </div>
        <div className="flex-[1] flex flex-col gap-2">
            <h3 className="text-accent font-semibold">AI Explanation</h3>
            <ScrollArea className="flex-1 p-4 rounded-lg bg-black/30 border border-primary/30">
                {isLoading && (
                <div className="flex flex-col items-center justify-center h-full text-muted-foreground gap-2">
                    <Loader2 className="w-8 h-8 animate-spin text-accent" />
                    <p>Analyzing code...</p>
                </div>
                )}
                {explanation && (
                <div className="prose prose-invert prose-sm max-w-none text-foreground whitespace-pre-wrap">
                    {explanation}
                </div>
                )}
                {!isLoading && !explanation && (
                <div className="flex flex-col items-center justify-center h-full text-muted-foreground gap-2 text-center">
                    <Code className="w-16 h-16 text-primary/30" strokeWidth={1}/>
                    <p>The AI's explanation will appear here.</p>
                </div>
                )}
            </ScrollArea>
        </div>
    </div>
  );
}
