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
 * Also injects a navigation interceptor script.
 */
function absoluteify(html: string, baseUrl: string): string {
    const root = new URL(baseUrl);
    
    // 1. Rewrite all asset/link paths to absolute
    let processed = html.replace(
        /(href|src|action|srcset|poster)=["'](?!(?:[a-z]+:)?\/\/|#|data:)([^"']+)["']/gi,
        (match, attr, path) => {
            try {
                const absUrl = new URL(path, root.href).href;
                return `${attr}="${absUrl}"`;
            } catch (e) {
                return match;
            }
        }
    );

    // 2. Inject the Virtual Viewport Script
    // This intercepts clicks and form submissions to keep them within our portal logic
    const interceptor = `
        <script>
            (function() {
                const notify = (url) => {
                    window.parent.postMessage({ type: 'PORTAL_NAVIGATE', url: url }, '*');
                };

                document.addEventListener('click', e => {
                    const link = e.target.closest('a');
                    if (link && link.href && !link.href.startsWith('javascript:')) {
                        e.preventDefault();
                        notify(link.href);
                    }
                }, true);

                document.addEventListener('submit', e => {
                    e.preventDefault();
                    const form = e.target;
                    const url = new URL(form.action || window.location.href);
                    const formData = new FormData(form);
                    const params = new URLSearchParams();
                    for (const [key, value] of formData) params.append(key, value);
                    
                    const finalUrl = url.origin + url.pathname + (params.toString() ? '?' + params.toString() : '');
                    notify(finalUrl);
                }, true);

                // Disable scripts that try to break out of frames
                window.onbeforeunload = function() { return null; };
                window.open = function(url) { notify(url); return null; };
            })();
        </script>
    `;

    // Inject at the start of head
    if (processed.includes('<head>')) {
        processed = processed.replace('<head>', `<head>${interceptor}`);
    } else {
        processed = interceptor + processed;
    }

    return processed;
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
                'Cache-Control': 'no-cache',
                'Pragma': 'no-cache'
            },
            redirect: 'follow'
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        rawHtml = await response.text();
        finalUrl = response.url; 
    } catch (e: any) {
        return { 
            title: "Projection Error", 
            description: "The remote server refused the connection or is unreachable.",
            isFallback: true,
            content: [{ type: 'alert', text: `Connection Error: ${e.message}. The site might be blocking server-side requests.` }]
        };
    }

    const processedHtml = absoluteify(rawHtml, finalUrl);

    return {
        title: "Live Projection",
        description: `Direct source transmission from ${finalUrl}`,
        isFallback: true,
        fullHtml: processedHtml,
        content: [] 
    };
  }
);
