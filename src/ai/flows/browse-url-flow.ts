'use server';
/**
 * @fileOverview An AI flow to fetch the content of a URL.
 */
import { ai } from '@/ai/genkit';
import { z } from 'zod';
import { BrowseUrlInputSchema, BrowseUrlOutputSchema } from '../schemas';
import type { BrowseUrlInput, BrowseUrlOutput } from '../schemas';

export type { BrowseUrlInput, BrowseUrlOutput };

export async function browseUrl(input: BrowseUrlInput): Promise<BrowseUrlOutput> {
  // We are not using an LLM here, so no need to check for GOOGLE_API_KEY
  return browseUrlFlow(input);
}

const browseUrlFlow = ai.defineFlow(
  {
    name: 'browseUrlFlow',
    inputSchema: BrowseUrlInputSchema,
    outputSchema: BrowseUrlOutputSchema,
  },
  async (input) => {
    try {
      const response = await fetch(input.url);
      if (!response.ok) {
        throw new Error(`Failed to fetch URL: ${response.statusText}`);
      }
      const html = await response.text();
      // Replace absolute paths with paths relative to the target URL to attempt to load resources.
      const base = new URL(input.url);
      const processedHtml = html.replace(/(src|href)=["'](\/[^"']*)["']/g, `$1="${base.origin}$2"`);

      return {
        html: processedHtml,
      };
    } catch (error: any) {
        console.error("Error browsing URL:", error);
        // Provide a user-friendly error message in HTML format.
        const errorHtml = `
            <div style="font-family: sans-serif; color: #ccc; text-align: center; padding: 40px;">
                <h1 style="color: #f44336;">Unable to Load Page</h1>
                <p>Could not retrieve content from:</p>
                <p><strong>${input.url}</strong></p>
                <p style="font-size: 12px; color: #999;">Error: ${error.message}</p>
            </div>
        `;
      return {
        html: errorHtml,
      };
    }
  }
);
