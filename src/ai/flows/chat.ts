'use server';
/**
 * @fileOverview A simple chat flow.
 *
 * - chat - A function that handles the chat interaction.
 * - ChatInput - The input type for the chat function.
 * - ChatOutput - The return type for the chat function.
 */

import {ai} from '@/ai/genkit';
import {
  ChatInputSchema,
  ChatOutputSchema,
} from '../schemas';
import type { ChatInput, ChatOutput } from '../schemas';

export type { ChatInput, ChatOutput };

export async function chat(input: ChatInput): Promise<ChatOutput> {
  if (!process.env.GOOGLE_API_KEY) {
    return {
      message: "AI features are disabled. Please provide a GOOGLE_API_KEY in your .env file.",
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
    const llmResponse = await ai.generate({
      prompt: `You are a helpful AI assistant within a virtual reality environment called XenovaVR. Be concise and helpful. User message: ${input.message}`,
    });

    return {
        message: llmResponse.text,
    };
  }
);
