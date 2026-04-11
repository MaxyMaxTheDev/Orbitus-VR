'use server';
/**
 * @fileOverview An AI flow to simulated browsing by fetching and restructuring website content.
 */

import { ai } from '@/ai/genkit';
import {
  SummarizeUrlInputSchema,
  BrowseUrlOutputSchema,
} from '../schemas';
import type { SummarizeUrlInput, BrowseUrlOutput } from '../schemas';

export type { SummarizeUrlInput, BrowseUrlOutput };

export async function browseUrl(input: SummarizeUrlInput): Promise<BrowseUrlOutput> {
  if (!process.env.GOOGLE_API_KEY) {
    return {
      title: "AI Features Disabled",
      description: "Please provide a GOOGLE_API_KEY in your .env file.",
      content: [{ type: 'alert', text: 'API Key missing.' }]
    };
  }
  return browseUrlFlow(input);
}

const browseUrlFlow = ai.defineFlow(
  {
    name: 'browseUrlFlow',
    inputSchema: SummarizeUrlInputSchema,
    outputSchema: BrowseUrlOutputSchema,
  },
  async (input) => {
    let rawContent = '';
    try {
        const response = await fetch(input.url);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        rawContent = await response.text();
    } catch (e) {
        return { 
            title: "Connection Failed", 
            description: "The site could not be reached via standard retrieval.",
            content: [{ type: 'alert', text: "Could not fetch the content of the URL. The website might be down or blocking automated requests." }]
        };
    }

    // Basic cleaning to strip noise before sending to LLM
    const textContent = rawContent.replace(/<style[^>]*>.*<\/style>/gs, '')
                                .replace(/<script[^>]*>.*<\/script>/gs, '')
                                .replace(/<[^>]+>/g, ' ')
                                .replace(/\s\s+/g, ' ')
                                .trim();
    
    const limitedContent = textContent.substring(0, 12000);

    const prompt = ai.definePrompt({
        name: 'browseUrlPrompt',
        input: { schema: SummarizeUrlInputSchema },
        output: { schema: BrowseUrlOutputSchema },
        prompt: `You are an AI Web Browser Portal for the XenovaVR operating system.
        A user has requested to view the following website content. 
        Your task is to parse the raw text and structure it into a functional, clean, and highly readable layout.
        
        Website Content:
        ${limitedContent}
        
        Instructions:
        1. Identify the primary title and metadata.
        2. Break the content down into logical sections (Header, Main Text, Key Links, Alerts, etc.).
        3. For 'links', identify significant navigation or call-to-action links mentioned in the text.
        4. Use a journalistic and professional tone.
        5. If there is a clear "Main Story" or "Primary Purpose", highlight it in the content array.
        `
    });

    const { output } = await prompt(input);
    return output!;
  }
);
