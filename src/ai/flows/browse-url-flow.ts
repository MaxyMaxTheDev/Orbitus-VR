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
 * Aggressively converts relative URLs to absolute and injects a navigation interceptor.
 */
function processProjection(html: string, baseUrl: string): string {
    const root = new URL(baseUrl);
    
    // 1. Rewrite all asset/link paths to absolute to fix CSS/JS/Images
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

    // 2. Inject the Universal Navigation Interceptor & Base Tag
    const interceptor = `
        <base href="${root.origin}${root.pathname}">
        <script>
            (function() {
                const notify = (url) => {
                    if (!url) return;
                    try {
                        const absoluteUrl = new URL(url, "${root.href}").href;
                        window.parent.postMessage({ type: 'PORTAL_NAVIGATE', url: absoluteUrl }, '*');
                    } catch(e) {}
                };

                // Intercept all link clicks
                document.addEventListener('click', e => {
                    const link = e.target.closest('a');
                    if (link && link.href && !link.href.startsWith('javascript:') && !link.hash) {
                        e.preventDefault();
                        notify(link.href);
                    }
                }, true);

                // Intercept form submissions
                document.addEventListener('submit', e => {
                    e.preventDefault();
                    const form = e.target;
                    const action = form.action || window.location.href;
                    const formData = new FormData(form);
                    const params = new URLSearchParams();
                    for (const [key, value] of formData) {
                        if (typeof value === 'string') params.append(key, value);
                    }
                    
                    const url = new URL(action);
                    url.search = params.toString();
                    notify(url.href);
                }, true);

                // Proxy common JS navigation patterns
                const originalOpen = window.open;
                window.open = function(url) {
                    notify(url);
                    return null;
                };

                // Guard against frame-busting scripts
                window.onbeforeunload = function() { return null; };
                
                // Monitor for unexpected URL changes (SPAs)
                let lastUrl = location.href;
                new MutationObserver(() => {
                    if (location.href !== lastUrl) {
                        lastUrl = location.href;
                        // We can't stop SPAs easily, but we can try to re-portal
                    }
                }).observe(document, {subtree: true, childList: true});
            })();
        </script>
    `;

    // Inject at the start of head or body
    if (processed.includes('<head>')) {
        processed = processed.replace('<head>', `<head>${interceptor}`);
    } else if (processed.includes('<html>')) {
        processed = processed.replace('<html>', `<html><head>${interceptor}</head>`);
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
                'Cache-Control': 'no-cache'
            },
            redirect: 'follow'
        });

        if (!response.ok) {
            throw new Error(`Connection Refused (${response.status})`);
        }

        rawHtml = await response.text();
        finalUrl = response.url; 
    } catch (e: any) {
        return { 
            title: "Projection Error", 
            description: "The remote server refused the connection.",
            isFallback: true,
            content: [{ type: 'alert', text: `Error: ${e.message}. This site may have strict security policies blocking virtual projection.` }]
        };
    }

    const processedHtml = processProjection(rawHtml, finalUrl);

    return {
        title: "Live Projection",
        description: `Established connection to ${finalUrl}`,
        isFallback: true,
        fullHtml: processedHtml,
        content: [] 
    };
  }
);
