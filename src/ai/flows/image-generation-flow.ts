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
  return imageGenerationFlow(input);
}

const imageGenerationFlow = ai.defineFlow(
  {
    name: 'imageGenerationFlow',
    inputSchema: ImageGenerationInputSchema,
    outputSchema: ImageGenerationOutputSchema,
  },
  async (input) => {
    const { media } = await ai.generate({
      model: 'googleai/gemini-2.0-flash-preview-image-generation',
      prompt: `A high-resolution 3D render of the following object, suitable for a virtual reality sculpting app: ${input.prompt}`,
      config: {
        responseModalities: ['TEXT', 'IMAGE'],
      },
    });

    if (!media) {
      throw new Error('Image generation failed.');
    }

    return {
      imageUrl: media.url,
    };
  }
);
