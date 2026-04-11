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
 * Aggressively converts all relative URLs in HTML to absolute URLs.
 * This ensures that CSS, JS, and Images load correctly when the HTML is rendered via srcDoc.
 */
function absoluteify(html: string, baseUrl: string): string {
    const root = new URL(baseUrl);
    // Regex to match src, href, action, etc. attributes that don't start with a protocol, hash, or data URI
    return html.replace(
        /(href|src|action|srcset|poster)=["'](?!(?:[a-z]+:)?\/\/|#|data:)([^"']+)["']/gi,
        (match, attr, path) => {
            try {
                // Ensure the path is joined correctly to the base URL
                const absUrl = new URL(path, root.href).href;
                return `${attr}="${absUrl}"`;
            } catch (e) {
                return match;
            }
        }
    );
}

export async function browseUrl(input: SummarizeUrlInput): Promise<BrowseUrlOutput> {
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
    let finalUrl = input.url;

    try {
        const response = await fetch(input.url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
                'Accept-Language': 'en-US,en;q=0.9',
            },
            redirect: 'follow'
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        rawHtml = await response.text();
        finalUrl = response.url; // Capture redirected URL
    } catch (e: any) {
        return { 
            title: "Projection Error", 
            description: "The remote server refused the connection or is unreachable.",
            isFallback: true,
            content: [{ type: 'alert', text: `Connection Error: ${e.message}. The site might be blocking server-side requests.` }]
        };
    }

    // Rewrite all relative URLs to absolute URLs so assets load in the portal
    const processedHtml = absoluteify(rawHtml, finalUrl);

    // Default to Live Projection Mode immediately
    return {
        title: "Live Projection",
        description: `Direct source transmission from ${finalUrl}`,
        isFallback: true,
        fullHtml: processedHtml,
        content: [] 
    };
  }
);
