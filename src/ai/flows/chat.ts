'use server';
/**
 * @fileOverview A simple chat flow.
 */

import {ai} from '@/ai/genkit';
import {hasGenAiApiKey, missingGenAiApiKeyMessage} from '@/lib/vercel-env';
import {
  ChatInputSchema,
  ChatOutputSchema,
} from '../schemas';
import type { ChatInput, ChatOutput } from '../schemas';

export type { ChatInput, ChatOutput };

export async function chat(input: ChatInput): Promise<ChatOutput> {
  if (!hasGenAiApiKey()) {
    return {
      message: missingGenAiApiKeyMessage,
    };
  }
  return chatFlow(input);
}

const chatFlow = ai.defineFlow(
  {
    name: 'chatFlow',
    inputSchema: ChatInputSchema,
    outputSchema: ChatOutputSchema,
  },
  async (input) => {
    try {
        const llmResponse = await ai.generate({
            prompt: `You are a helpful AI assistant within a virtual reality environment called OrbitusVR. Be concise and helpful. User message: ${input.message}`,
        });

        return {
            message: llmResponse.text,
        };
    } catch (e: any) {
        console.error("Chat Flow Error:", e);
        return {
            message: `Sorry, I encountered an error: ${e.message}. Please check your AI configuration.`,
        };
    }
  }
);
