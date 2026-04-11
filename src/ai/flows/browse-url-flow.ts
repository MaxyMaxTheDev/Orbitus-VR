'use server';
/**
 * @fileOverview An AI flow to simulate browsing by fetching and restructuring website content.
 * Optimized for direct Live Source Projection by default.
 */

import { ai, z } from '@/ai/genkit';
import {
  SummarizeUrlInputSchema,
  BrowseUrlOutputSchema,
} from '../schemas';
import type { SummarizeUrlInput, BrowseUrlOutput } from '../schemas';

export type { SummarizeUrlInput, BrowseUrlOutput };

/**
 * Utility to convert all relative URLs in HTML to absolute URLs.
 * This is essential for srcDoc to load CSS, JS, and Images correctly.
 */
function absoluteify(html: string, baseUrl: string): string {
    const root = new URL(baseUrl);
    // Regex to match src, href, action, etc. attributes that don't start with a protocol or data URI
    return html.replace(
        /(href|src|action|srcset|poster)=["'](?!(?:[a-z]+:)?\/\/|data:)([^"']+)["']/gi,
        (match, attr, path) => {
            try {
                // Remove leading slashes if they exist to handle both root-relative and relative paths
                const absUrl = new URL(path, root.href).href;
                return `${attr}="${absUrl}"`;
            } catch (e) {
                return match;
            }
        }
    );
}

export async function browseUrl(input: SummarizeUrlInput): Promise<BrowseUrlOutput> {
  // We no longer require API keys for the base fetching logic, only for AI summaries
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
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
                'Accept-Language': 'en-US,en;q=0.9',
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

    // Rewrite all relative URLs to absolute URLs so assets load in the portal
    const processedHtml = absoluteify(rawHtml, input.url);

    // Basic cleaning to strip noise for raw text reference
    const textOnly = rawHtml.replace(/<style[^>]*>.*<\/style>/gs, '')
                                .replace(/<script[^>]*>.*<\/script>/gs, '')
                                .replace(/<[^>]+>/g, ' ')
                                .replace(/\s\s+/g, ' ')
                                .trim();
    
    const limitedText = textOnly.substring(0, 15000);

    // Default to Live Projection Mode immediately for performance
    return {
        title: "Live Projection",
        description: `Direct source transmission from ${input.url}`,
        isFallback: true, // This triggers the Live Projection iframe in the UI
        fullHtml: processedHtml,
        rawContent: limitedText,
        content: [] 
    };
  }
);
