'use server';
/**
 * @fileOverview An AI flow to generate a quote of the day.
 */

import { ai } from '@/ai/genkit';
import {hasGeminiApiKey, missingGeminiApiKeyMessage} from '@/lib/vercel-env';
import { z } from 'genkit';
import { QuoteOutputSchema } from '../schemas';
import type { QuoteOutput } from '../schemas';

export type { QuoteOutput };

export async function getQuote(): Promise<QuoteOutput> {
  if (!hasGeminiApiKey()) {
    return {
      quote: missingGeminiApiKeyMessage,
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

    try {
      const { output } = await prompt({});
      if (!output) {
        // This handles cases where the AI response doesn't match the Zod schema.
        return {
          quote: 'The AI response could not be understood. Please try again later.',
          author: 'System',
        };
      }
      return output;
    } catch (e: any) {
      // This handles network errors, API errors, and quota issues.
      console.error("Error in quoteFlow:", e.message);
      if (e.message?.includes('429')) {
          return {
              quote: "Daily AI insight quota reached. A new one will be available tomorrow.",
              author: "System"
          };
      }
      // For other errors, return a generic message.
      return {
          quote: "Could not retrieve AI insight at this time.",
          author: "System"
      };
    }
  }
);
