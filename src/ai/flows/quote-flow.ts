'use server';
/**
 * @fileOverview An AI flow to generate a quote of the day.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { QuoteOutputSchema } from '../schemas';
import type { QuoteOutput } from '../schemas';

export type { QuoteOutput };

export async function getQuote(): Promise<QuoteOutput> {
  if (!process.env.GOOGLE_API_KEY) {
    return {
      quote: 'AI features are disabled. Please set the GOOGLE_API_KEY in your .env file.',
      author: 'System',
    };
  }
  return quoteFlow({});
}

const quoteFlow = ai.defineFlow(
  {
    name: 'quoteFlow',
    inputSchema: z.object({}),
    outputSchema: QuoteOutputSchema,
  },
  async () => {
    const prompt = ai.definePrompt({
        name: 'quotePrompt',
        output: { schema: QuoteOutputSchema },
        prompt: `You are a philosopher for a futuristic virtual world. Generate a short, insightful quote about technology, reality, or the future. The author should be a fitting fictional name or "Anonymous".`
    });

    const { output } = await prompt({});
    return output!;
  }
);
