'use server';
/**
 * @fileOverview An AI flow to simulate browsing by fetching and restructuring website content.
 * Includes a 60-second timeout with a deep-linked live HTML fallback.
 */

import { ai, z } from '@/ai/genkit';
import {
  SummarizeUrlInputSchema,
  BrowseUrlOutputSchema,
} from '../schemas';
import type { SummarizeUrlInput, BrowseUrlOutput } from '../schemas';

export type { SummarizeUrlInput, BrowseUrlOutput };

const browseUrlPrompt = ai.definePrompt({
    name: 'browseUrlPrompt',
    input: { schema: SummarizeUrlInputSchema.extend({ pageContent: z.string() }) },
    output: { schema: BrowseUrlOutputSchema },
    prompt: `You are an AI Web Browser Portal for the XenovaVR operating system.
    A user has requested to view the following website content from URL: {{{url}}}. 
    Your task is to parse the raw text and structure it into a functional, clean, and highly readable layout.
    
    Website Content:
    {{{pageContent}}}
    
    Instructions:
    1. Identify the primary title and metadata.
    2. Break the content down into logical sections (Header, Main Text, Key Links, Alerts, etc.).
    3. For 'links', identify significant navigation or call-to-action links mentioned in the text.
    4. Use a journalistic and professional tone.
    5. If there is a clear "Main Story" or "Primary Purpose", highlight it in the content array.
    `
});

export async function browseUrl(input: SummarizeUrlInput): Promise<BrowseUrlOutput> {
  if (!process.env.GOOGLE_API_KEY && !process.env.GEMINI_API_KEY) {
    return {
      title: "AI Features Disabled",
      description: "Please provide a GOOGLE_API_KEY in your .env file.",
      isFallback: true,
      content: [{ type: 'alert', text: 'API Key missing. Cannot initialize AI Portal.' }]
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
    let rawHtml = '';
    try {
        const response = await fetch(input.url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8'
            }
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        rawHtml = await response.text();
    } catch (e: any) {
        return { 
            title: "Network Isolation", 
            description: "The remote server refused the connection or is currently unreachable.",
            isFallback: true,
            content: [{ type: 'alert', text: `Connection Error: ${e.message}. Site may be blocking server-side requests.` }]
        };
    }

    // Basic cleaning to strip noise before sending to LLM for parsing
    const textOnly = rawHtml.replace(/<style[^>]*>.*<\/style>/gs, '')
                                .replace(/<script[^>]*>.*<\/script>/gs, '')
                                .replace(/<[^>]+>/g, ' ')
                                .replace(/\s\s+/g, ' ')
                                .trim();
    
    const limitedText = textOnly.substring(0, 15000);

    // AI Processing with 60s timeout
    const timeoutPromise = new Promise<null>((_, reject) => 
        setTimeout(() => reject(new Error('AI Projection timed out after 60s')), 60000)
    );

    try {
        const aiResult = await Promise.race([
            browseUrlPrompt({ ...input, pageContent: limitedText }),
            timeoutPromise
        ]);

        if (!aiResult || !aiResult.output) throw new Error("AI engine returned no data.");

        return {
            ...aiResult.output,
            isFallback: false,
            fullHtml: rawHtml,
            rawContent: limitedText
        };
    } catch (aiError: any) {
        console.warn("AI Projection Bypassed:", aiError.message);
        // Fallback: return the original HTML for direct rendering via base-tag injection
        return {
            title: "Live Projection (Bypass Mode)",
            description: `The AI engine was bypassed (${aiError.message}). Rendering live source feed.`,
            isFallback: true,
            fullHtml: rawHtml,
            rawContent: limitedText,
            content: [] 
        };
    }
  }
);