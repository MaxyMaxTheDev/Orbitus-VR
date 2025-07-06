'use server';
/**
 * @fileOverview An AI flow to generate fictional news headlines.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { NewsFeedOutputSchema } from '../schemas';
import type { NewsFeedOutput } from '../schemas';

export type { NewsFeedOutput };

export async function getNewsFeed(): Promise<NewsFeedOutput> {
  if (!process.env.GOOGLE_API_KEY) {
    return {
      articles: [
        { title: 'AI features disabled.', source: 'System', timestamp: 'Now' },
        { title: 'Please provide a GOOGLE_API_KEY in your .env file.', source: 'System', timestamp: 'Now' },
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
        prompt: `You are a news feed generator for a futuristic virtual world called XenovaVR.
Generate a list of 5-7 intriguing, sci-fi news headlines.
Each headline MUST come from a different and varied futuristic news source. Examples of sources include 'The Kuiper Post', 'Cy-Chronicle', 'Mars Minute', 'Titan Times', 'Galactic Herald', and 'HoloNet News'.
Each headline should also have a relative timestamp (e.g., '15m ago', '3h ago').
The tone should be a mix of corporate news, tech breakthroughs, and mysterious events on the galactic frontier.`
    });

    const { output } = await prompt({});
    return output!;
  }
);
