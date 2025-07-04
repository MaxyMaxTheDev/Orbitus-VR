'use server';
/**
 * @fileOverview An AI flow to summarize a URL.
 */

import { ai } from '@/ai/genkit';
import {
  SummarizeUrlInputSchema,
  SummarizeUrlOutputSchema,
} from '../schemas';
import type { SummarizeUrlInput, SummarizeUrlOutput } from '../schemas';

export type { SummarizeUrlInput, SummarizeUrlOutput };

export async function summarizeUrl(input: SummarizeUrlInput): Promise<SummarizeUrlOutput> {
  if (!process.env.GOOGLE_API_KEY) {
    return {
      summary: "AI features are disabled. Please provide a GOOGLE_API_KEY in your .env file.",
    };
  }
  return summarizeUrlFlow(input);
}

const summarizeUrlFlow = ai.defineFlow(
  {
    name: 'summarizeUrlFlow',
    inputSchema: SummarizeUrlInputSchema,
    outputSchema: SummarizeUrlOutputSchema,
  },
  async (input) => {
    const prompt = `Based on your knowledge of the content at the following URL, please provide a concise but comprehensive summary.

URL: ${input.url}`;

    const llmResponse = await ai.generate({
      prompt: prompt,
    });

    return {
      summary: llmResponse.text,
    };
  }
);
