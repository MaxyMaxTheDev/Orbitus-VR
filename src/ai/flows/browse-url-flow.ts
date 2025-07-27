
'use server';
/**
 * @fileOverview An AI flow to browse a URL and return its sanitized HTML content.
 */

import { ai } from '@/ai/genkit';
import {
  BrowseUrlInputSchema,
  BrowseUrlOutputSchema,
} from '../schemas';
import type { BrowseUrlInput, BrowseUrlOutput } from '../schemas';

export type { BrowseUrlInput, BrowseUrlOutput };

export async function browseUrl(input: BrowseUrlInput): Promise<BrowseUrlOutput> {
  if (!process.env.GOOGLE_API_KEY) {
    return {
      html: "AI features are disabled. Please provide a GOOGLE_API_KEY in your .env file.",
    };
  }
  return browseUrlFlow(input);
}

const browseUrlFlow = ai.defineFlow(
  {
    name: 'browseUrlFlow',
    inputSchema: BrowseUrlInputSchema,
    outputSchema: BrowseUrlOutputSchema,
  },
  async (input) => {
    let content = '';
    let responseUrl = '';
    try {
        const response = await fetch(input.url);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        content = await response.text();
        responseUrl = response.url;
    } catch (e) {
        console.error("Error fetching URL:", e);
        return { html: `<html><body><h1>Error</h1><p>Could not fetch the content of the URL. The website might be down or blocking requests.</p></body></html>` };
    }

    // Sanitize the HTML: remove script and iframe tags to prevent execution
    let sanitizedContent = content.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
    sanitizedContent = sanitizedContent.replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '');

    // Add a base tag to correctly resolve relative URLs for CSS, images, etc.
    const baseHref = new URL(responseUrl).origin;
    if (!sanitizedContent.includes('<base href')) {
      sanitizedContent = sanitizedContent.replace('<head>', `<head>\n<base href="${baseHref}">`);
    }

    return {
      html: sanitizedContent,
    };
  }
);
