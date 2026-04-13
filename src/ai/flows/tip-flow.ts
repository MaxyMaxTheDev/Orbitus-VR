'use server';
/**
 * @fileOverview An AI flow to generate a helpful tip.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { TipOutputSchema } from '../schemas';
import type { TipOutput } from '../schemas';

export type { TipOutput };

export async function getTip(): Promise<TipOutput> {
  if (!process.env.GOOGLE_API_KEY) {
    return {
      tip: 'Enable AI features by setting the GOOGLE_API_KEY in your .env file to get daily tips.',
    };
  }
  return tipFlow({});
}

const tipFlow = ai.defineFlow(
  {
    name: 'tipFlow',
    inputSchema: z.object({}),
    outputSchema: TipOutputSchema,
  },
  async () => {
    const prompt = ai.definePrompt({
        name: 'tipPrompt',
        output: { schema: TipOutputSchema },
        prompt: `You are a helpful assistant for a futuristic virtual world called NovaVR. 
        Generate a single, short, and useful tip for the user. 
        The tip should be about a feature in the NovaVR environment, like an app or a setting.
        For example: "You can customize your dashboard widgets in the Settings app." or "Try generating a 3D model with your voice in SculptVR."`
    });

    try {
      const { output } = await prompt({});
      if (!output) {
        return {
          tip: 'The AI response could not be understood. Please try again later.',
        };
      }
      return output;
    } catch (e: any) {
      console.error("Error in tipFlow:", e.message);
      return {
          tip: "Could not retrieve an AI tip at this time. Check your connection or API key.",
      };
    }
  }
);
