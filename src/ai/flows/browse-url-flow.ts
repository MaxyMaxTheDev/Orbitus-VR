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
      let html = await response.text();
      
      // A base tag in the document's <head> can simplify relative URL resolution.
      const baseTag = `<base href="${new URL(input.url).origin}/" />`;
      if (html.includes('<head>')) {
        html = html.replace('<head>', `<head>\n${baseTag}`);
      } else {
        html = baseTag + html;
      }

      // This regex is a bit more robust for rewriting src and href attributes.
      // It handles different quote types and looks for URLs that start with a single slash.
      html = html.replace(/(src|href)=(['"])(\/[^\/][^'"]*)\2/g, `$1=$2${new URL(input.url).origin}$3$2`);

      return {
        html,
      };
    } catch (error: any) {
        console.error("Error browsing URL:", error);
        // Provide a user-friendly error message in HTML format.
        const errorHtml = `
            <div style="font-family: sans-serif; color: #ccc; text-align: center; padding: 40px; height: 100%; display: flex; flex-direction: column; justify-content: center; align-items: center; background-color: #1a1a1a;">
                <h1 style="color: #f44336; font-size: 24px;">Unable to Load Page</h1>
                <p>Could not retrieve content from:</p>
                <p style="background-color: #333; padding: 8px 16px; border-radius: 8px; font-family: monospace;">${input.url}</p>
                <p style="font-size: 14px; color: #999; margin-top: 16px;">This might be due to network issues, strict security policies on the website, or an invalid URL.</p>
                <p style="font-size: 12px; color: #666; margin-top: 8px;">Error: ${error.message}</p>
            </div>
        `;
      return {
        html: errorHtml,
      };
    }
  }
);
