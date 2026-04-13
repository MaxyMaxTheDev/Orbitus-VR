'use server';
/**
 * @fileOverview An AI flow to generate fictional news headlines.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { NewsFeedOutputSchema, NewsItemSchema } from '../schemas';
import type { NewsFeedOutput, NewsItem } from '../schemas';

export type { NewsFeedOutput, NewsItem };

export async function getNewsFeed(): Promise<NewsFeedOutput> {
  if (!process.env.GOOGLE_API_KEY) {
    return {
      articles: [
        { title: 'AI features disabled.', source: 'System', timestamp: 'Now', content: 'AI features are disabled. Please provide a GOOGLE_API_KEY in your .env file to enable this app.' },
      ],
    };
  }
  return newsFeedFlow({});
}

const newsFeedFlow = ai.defineFlow(
  {
    name: 'newsFeedFlow',
    inputSchema: z.object({}),
    outputSchema: NewsFeedOutputSchema,
  },
  async () => {
    const prompt = ai.definePrompt({
        name: 'newsFeedPrompt',
        output: { schema: NewsFeedOutputSchema },
        prompt: `You are a news feed generator for a futuristic virtual world called NovaVR.
Generate a list of 5-7 intriguing, sci-fi news articles.
For each article, you must provide:
- A compelling, futuristic news headline ('title').
- A different and varied futuristic news source ('source'). Examples include 'The Kuiper Post', 'Cy-Chronicle', 'Mars Minute', 'Titan Times', 'Galactic Herald', and 'HoloNet News'.
- A relative timestamp ('timestamp'), e.g., '15m ago', '3h ago'.
- The full article text ('content'), which should be 2-3 paragraphs long and written in a journalistic style.
The tone should be a mix of corporate news, tech breakthroughs, and mysterious events on the galactic frontier.`
    });

    const { output } = await prompt({});
    return output!;
  }
);
