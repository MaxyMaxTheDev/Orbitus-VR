"use client";

import { useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2, Wand2, BoxSelect } from 'lucide-react';
import { generateImage } from '@/ai/flows/image-generation-flow';
import { useToast } from '@/hooks/use-toast';
import Image from 'next/image';
import { ImageGenerationInputSchema } from '@/ai/schemas';
import type { ImageGenerationInput } from '@/ai/schemas';

export function SculptVR() {
  const [imageUrl, setImageUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ImageGenerationInput>({
    resolver: zodResolver(ImageGenerationInputSchema),
  });

  const onSubmit: SubmitHandler<ImageGenerationInput> = async (data) => {
    setIsLoading(true);
    setImageUrl('');
    try {
      const result = await generateImage(data);
      setImageUrl(result.imageUrl);
    } catch (error) {
      console.error('Error generating image:', error);
      const description = error instanceof Error ? error.message : 'The AI failed to generate the model. Please try a different prompt.';
      toast({
        variant: 'destructive',
        title: 'Sculpting Error',
        description,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full w-full p-4 gap-4 items-center">
      <Card className="w-full max-w-2xl bg-transparent border-none shadow-none">
        <CardContent className="p-0">
          <form onSubmit={handleSubmit(onSubmit)} className="flex items-center gap-2">
            <Input
              {...register('prompt')}
              placeholder="Describe what you want to sculpt..."
              autoComplete="off"
              className="flex-1 bg-black/30 border-primary/50 focus:ring-accent h-12 text-base"
              disabled={isLoading}
            />
            <Button type="submit" size="lg" disabled={isLoading} className="bg-accent hover:bg-accent/80 h-12">
              {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Wand2 className="w-5 h-5" />}
              Sculpt
            </Button>
          </form>
          {errors.prompt && <p className="text-destructive text-xs mt-1">{errors.prompt.message}</p>}
        </CardContent>
      </Card>

      <div className="flex-1 w-full flex items-center justify-center">
        <Card className="w-full max-w-xl aspect-square bg-black/20 border-primary/30 flex items-center justify-center overflow-hidden">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center h-full text-muted-foreground gap-4">
              <Loader2 className="w-16 h-16 animate-spin text-accent" />
              <p className="text-lg">AI is sculpting...</p>
            </div>
          ) : imageUrl ? (
            <div className="relative w-full h-full">
                <Image src={imageUrl} alt="Generated sculpture" layout="fill" objectFit="contain" />
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-muted-foreground gap-4 text-center p-4">
              <BoxSelect className="w-24 h-24 text-primary/30" strokeWidth={1}/>
              <h3 className="text-xl font-bold">Welcome to SculptVR</h3>
              <p>Use the power of AI to bring your ideas to life. Describe an object, and the AI will generate a 3D model for you.</p>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
