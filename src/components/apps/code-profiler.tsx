"use client";

import { useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Loader2, Wand2, Gauge, ServerCrash, Zap, ShieldCheck } from 'lucide-react';
import { profileCode, ProfileCodeOutput } from '@/ai/flows/profile-code-flow';
import { useToast } from '@/hooks/use-toast';
import { ProfileCodeInputSchema } from '@/ai/schemas';
import type { ProfileCodeInput } from '@/ai/schemas';

const placeholderCode = `// A simple algorithm to find prime numbers
function sieveOfEratosthenes(n) {
  const primes = new Array(n + 1).fill(true);
  primes[0] = primes[1] = false;
  for (let p = 2; p * p <= n; p++) {
    if (primes[p]) {
      for (let i = p * p; i <= n; i += p) {
        primes[i] = false;
      }
    }
  }
  return primes;
}`;

export function CodeProfiler() {
  const [result, setResult] = useState<ProfileCodeOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProfileCodeInput>({
    resolver: zodResolver(ProfileCodeInputSchema),
    defaultValues: {
      code: placeholderCode,
    }
  });

  const onSubmit: SubmitHandler<ProfileCodeInput> = async (data) => {
    setIsLoading(true);
    setResult(null);
    try {
      const profilingResult = await profileCode(data);
      setResult(profilingResult);
    } catch (error) {
      console.error('Error profiling code:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to get a profile from the AI.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const renderResult = () => {
    if (isLoading) {
      return (
        <div className="flex flex-col items-center justify-center h-full text-muted-foreground gap-2">
            <Loader2 className="w-12 h-12 animate-spin text-accent" />
            <p className="font-headline tracking-wider text-lg">PROFILING...</p>
        </div>
      );
    }
    
    if (result) {
        return (
            <div className="space-y-4 animate-in fade-in-50 duration-500">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card className="bg-black/20 border-primary/20">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Quantum Complexity</CardTitle>
                            <Zap className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{result.quantumComplexity}</div>
                        </CardContent>
                    </Card>
                     <Card className="bg-black/20 border-primary/20">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Temporal Stability</CardTitle>
                            <ShieldCheck className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{result.temporalStability}</div>
                        </CardContent>
                    </Card>
                     <Card className="bg-black/20 border-primary/20">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Aetheric Consumption</CardTitle>
                            <Gauge className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{result.aethericConsumption}</div>
                        </CardContent>
                    </Card>
                </div>
                <Card className="bg-black/20 border-primary/20">
                    <CardHeader>
                        <CardTitle className="text-sm font-medium">Analysis Summary</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-muted-foreground">{result.summary}</p>
                    </CardContent>
                </Card>
            </div>
        )
    }

    return (
        <div className="flex flex-col items-center justify-center h-full text-muted-foreground gap-2 text-center">
            <Gauge className="w-24 h-24 text-primary/20" strokeWidth={1}/>
            <h3 className="text-xl font-bold font-headline">Code Profiler</h3>
            <p className="max-w-md">Enter a code snippet to generate a futuristic performance profile using advanced AI simulation.</p>
        </div>
    );
  }

  return (
    <div className="flex h-full w-full p-4 gap-4">
        <div className="flex-[1] flex flex-col gap-2">
            <h3 className="text-accent font-semibold text-sm font-headline tracking-wider">CODE INPUT</h3>
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col h-full gap-4">
                <Textarea
                    {...register('code')}
                    placeholder="Enter your code here..."
                    className="flex-1 bg-black/30 border-primary/50 focus:ring-accent font-mono text-xs resize-none"
                    disabled={isLoading}
                />
                {errors.code && <p className="text-destructive text-xs">{errors.code.message}</p>}
                <Button type="submit" disabled={isLoading} size="lg" className="bg-accent hover:bg-accent/80 font-bold tracking-wider">
                    {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Wand2 className="w-5 h-5" />}
                    PROFILE
                </Button>
            </form>
        </div>
        <div className="flex-[1] flex flex-col gap-2">
            <h3 className="text-accent font-semibold text-sm font-headline tracking-wider">AI ANALYSIS</h3>
            <div className="flex-1 p-4 rounded-lg bg-black/30 border border-primary/30">
                {renderResult()}
            </div>
        </div>
    </div>
  );
}
