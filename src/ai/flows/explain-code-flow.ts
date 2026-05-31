'use server';
/**
 * @fileOverview An AI flow to explain code snippets.
 */

import { ai } from '@/ai/genkit';
import {hasGeminiApiKey, missingGeminiApiKeyMessage} from '@/lib/vercel-env';
import {hasGenAiApiKey, missingGenAiApiKeyMessage} from '@/lib/vercel-env';
import {
  ExplainCodeInputSchema,
  ExplainCodeOutputSchema,
} from '../schemas';
import type { ExplainCodeInput, ExplainCodeOutput } from '../schemas';

export type { ExplainCodeInput, ExplainCodeOutput };

export async function explainCode(input: ExplainCodeInput): Promise<ExplainCodeOutput> {
  if (!hasGeminiApiKey()) {
    return {
      explanation: missingGeminiApiKeyMessage,
  if (!hasGenAiApiKey()) {
    return {
      explanation: missingGenAiApiKeyMessage,
    };
  }
  return explainCodeFlow(input);
}

const explainCodeFlow = ai.defineFlow(
  {
    name: 'explainCodeFlow',
    inputSchema: ExplainCodeInputSchema,
    outputSchema: ExplainCodeOutputSchema,
  },
  async (input) => {
    const prompt = `You are an expert software developer and code reviewer. Your goal is to explain the following code snippet in a way that is easy to understand for both beginners and experienced developers.

    Code Snippet:
    \`\`\`
    ${input.code}
    \`\`\`

    Please provide a clear and concise explanation.`;

    const llmResponse = await ai.generate({
      prompt: prompt,
    });

    return {
      explanation: llmResponse.text,
    };
  }
);
