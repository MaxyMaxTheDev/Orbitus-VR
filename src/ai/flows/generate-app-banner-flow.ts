
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
  if (!process.env.GROQ_API_KEY) {
    throw new Error('AI features are disabled. Please provide a GROQ_API_KEY in your .env file.');
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
        model: 'groq/llama-3.3-70b-versatile',
        prompt: `Create a visually appealing, high-tech banner image (16:9 aspect ratio) for an application.
App Name: "${input.appName}"
App Description: "${input.description}"
The banner should be a high-quality, professional representation that reflects the app's purpose. Use a dark, futuristic aesthetic with glowing neon accents. The banner should be exciting and directly related to what the app does.`,
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
      throw new Error('The AI failed to generate the banner. This might be due to safety restrictions or a network issue.');
    }
  }
);
