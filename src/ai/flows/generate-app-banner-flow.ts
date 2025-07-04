'use server';
/**
 * @fileOverview An AI flow to generate app banner images.
 */

import { ai } from '@/ai/genkit';
import {
  GenerateAppBannerInputSchema,
  GenerateAppBannerOutputSchema,
} from '../schemas';
import type { GenerateAppBannerInput, GenerateAppBannerOutput } from '../schemas';

export type { GenerateAppBannerInput, GenerateAppBannerOutput };


export async function generateAppBanner(input: GenerateAppBannerInput): Promise<GenerateAppBannerOutput> {
  if (!process.env.GOOGLE_API_KEY) {
    throw new Error('AI features are disabled. Please provide a GOOGLE_API_KEY in your .env file.');
  }
  return generateAppBannerFlow(input);
}

const generateAppBannerFlow = ai.defineFlow(
  {
    name: 'generateAppBannerFlow',
    inputSchema: GenerateAppBannerInputSchema,
    outputSchema: GenerateAppBannerOutputSchema,
  },
  async (input) => {
    try {
      const { media } = await ai.generate({
        model: 'googleai/gemini-2.0-flash-preview-image-generation',
        prompt: `A futuristic, abstract banner image (16:9 aspect ratio) for a virtual reality app called "${input.appName}". The style should be cyberpunk, with glowing neon geometric patterns and a dark, tech-focused aesthetic. Minimalist and abstract, not a literal representation of the app.`,
        config: {
          responseModalities: ['TEXT', 'IMAGE'],
        },
      });

      if (!media) {
        throw new Error('Image generation failed. The prompt may have been blocked due to safety settings.');
      }

      return {
        imageUrl: media.url,
      };
    } catch (e: any) {
      if (e.message?.includes('429')) {
        throw new Error('You have exceeded your daily image generation quota. Please try again tomorrow.');
      }
      console.error("Banner generation error:", e);
      throw new Error('The AI failed to generate the banner. Please try a different prompt.');
    }
  }
);
