'use server';
/**
 * @fileOverview An AI flow to simulate running user-generated code or app prompts.
 */

import { ai } from '@/ai/genkit';
import {hasGenAiApiKey, missingGenAiApiKeyMessage} from '@/lib/vercel-env';
import {
  RunCodeInputSchema,
  RunCodeOutputSchema,
} from '../schemas';
import type { RunCodeInput, RunCodeOutput } from '../schemas';

export type { RunCodeInput, RunCodeOutput };

export async function runCode(input: RunCodeInput): Promise<RunCodeOutput> {
  if (!hasGenAiApiKey()) {
    throw new Error(missingGenAiApiKeyMessage);
  }
  return runCodeFlow(input);
}

const runCodeFlow = ai.defineFlow(
  {
    name: 'runCodeFlow',
    inputSchema: RunCodeInputSchema,
    outputSchema: RunCodeOutputSchema,
  },
  async (input) => {
    let generationPrompt = '';
    if (input.code) {
        generationPrompt = `You are a web browser simulator. A user has provided a React code snippet intended to be rendered.
Generate a realistic screenshot of what this component would look like running in a minimalist browser window.
The code is:
\`\`\`javascript
${input.code}
\`\`\`
Focus on rendering the output of the code, not the code itself. The output should be a single image.`;
    } else if (input.prompt) {
        generationPrompt = `You are an application UI simulator. A user has described an application they want to build.
Generate a single, clean, high-fidelity screenshot of what the main screen of this application would look like.
The user's description is: "${input.prompt}"`;
    } else {
        throw new Error("Either a code snippet or an app prompt must be provided.");
    }

    try {
      const { media } = await ai.generate({
        prompt: generationPrompt,
        config: {
          responseModalities: ['TEXT', 'IMAGE'],
          aspectRatio: '16:9',
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
      throw new Error('The AI failed to generate the app preview. Please try again.');
    }
  }
);
