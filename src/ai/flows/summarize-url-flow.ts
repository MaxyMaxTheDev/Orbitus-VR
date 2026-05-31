
'use server';
/**
 * @fileOverview An AI flow to summarize a URL.
 */

import { ai } from '@/ai/genkit';
import {hasGenAiApiKey, missingGenAiApiKeyMessage} from '@/lib/vercel-env';
import {
  SummarizeUrlInputSchema,
  SummarizeUrlOutputSchema,
} from '../schemas';
import type { SummarizeUrlInput, SummarizeUrlOutput } from '../schemas';
import { z } from 'zod';

export type { SummarizeUrlInput, SummarizeUrlOutput };

export async function summarizeUrl(input: SummarizeUrlInput): Promise<SummarizeUrlOutput> {
  if (!hasGenAiApiKey()) {
    return {
      summary: missingGenAiApiKeyMessage,
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
    let content = '';
    try {
        const response = await fetch(input.url);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        // This is a naive implementation that just gets the text.
        // A better implementation would parse the HTML and extract the main content.
        content = await response.text();
    } catch (e) {
        return { summary: "Could not fetch the content of the URL. The website might be down or blocking requests." };
    }

    // A very basic way to clean up HTML and get some text.
    const textContent = content.replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
                                .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
                                .replace(/<[^>]+>/g, ' ')
                                .replace(/\s\s+/g, ' ')
                                .trim();
    
    // Limit the content size to avoid hitting model limits.
    const limitedContent = textContent.substring(0, 10000);

    const prompt = `Please provide a concise but comprehensive summary of the following web page content.

Page Content:
${limitedContent}`;

    const llmResponse = await ai.generate({
      prompt: prompt,
    });

    return {
      summary: llmResponse.text,
    };
  }
);
