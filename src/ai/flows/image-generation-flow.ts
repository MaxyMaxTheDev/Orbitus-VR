'use server';
/**
 * @fileOverview An AI flow to generate images from a text prompt.
 */

import { ai } from '@/ai/genkit';
import {
  ImageGenerationInputSchema,
  ImageGenerationOutputSchema,
} from '../schemas';
import type { ImageGenerationInput, ImageGenerationOutput } from '../schemas';

export type { ImageGenerationInput, ImageGenerationOutput };

export async function generateImage(input: ImageGenerationInput): Promise<ImageGenerationOutput> {
  if (!process.env.GOOGLE_API_KEY) {
    throw new Error('AI features are disabled. Please provide a GOOGLE_API_KEY in your .env file.');
  }
  return imageGenerationFlow(input);
}

const imageGenerationFlow = ai.defineFlow(
  {
    name: 'imageGenerationFlow',
    inputSchema: ImageGenerationInputSchema,
    outputSchema: ImageGenerationOutputSchema,
  },
  async (input) => {
    try {
      const { media } = await ai.generate({
        model: 'googleai/gemini-2.0-flash-preview-image-generation',
        prompt: `A high-resolution 3D render of the following object, suitable for a virtual reality sculpting app: ${input.prompt}`,
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
      console.error("Image generation error:", e);
      throw new Error('The AI failed to generate the model. Please try a different prompt.');
    }
  }
);
