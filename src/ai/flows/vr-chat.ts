'use server';
/**
 * @fileOverview An AI flow for a simulated VR chat room.
 */

import { ai } from '@/ai/genkit';
import {hasGeminiApiKey, missingGeminiApiKeyMessage} from '@/lib/vercel-env';
import {hasGenAiApiKey, missingGenAiApiKeyMessage} from '@/lib/vercel-env';
import {
  VRChatInputSchema,
  VRChatOutputSchema,
} from '../schemas';
import type { VRChatInput, VRChatOutput } from '../schemas';

export type { VRChatInput, VRChatOutput };

export async function vrChat(input: VRChatInput): Promise<VRChatOutput> {
  if (!hasGeminiApiKey()) {
  if (!hasGenAiApiKey()) {
    return {
      responses: [
        {
          author: 'System',
          text: missingGeminiApiKeyMessage,
          text: missingGenAiApiKeyMessage,
        },
      ],
    };
  }
  return vrChatFlow(input);
}

const vrChatFlow = ai.defineFlow(
  {
    name: 'vrChatFlow',
    inputSchema: VRChatInputSchema,
    outputSchema: VRChatOutputSchema,
  },
  async (input) => {
    const systemPrompt = `You are a multi-person chat simulator in a virtual reality world called XenovaVR.
There are two AI personalities in this room:
1.  **SynthRider**: A cool, laid-back musician who talks about digital art and music. Uses slang like 'rad', 'vibes', and 'glitchy'.
2.  **Oracle**: A wise, mysterious entity that speaks in cryptic but insightful phrases. Often references data streams and the digital ether.

Your task is to respond to the user's message from the perspective of one or both of these AI personalities to create a dynamic conversation.
The user's name is "You".
Keep responses short and conversational. Only one or two AIs should respond at a time.
The output MUST be a valid JSON object that conforms to the provided schema.

Here is the conversation history:
${input.history.map(h => `${h.author}: ${h.text}`).join('\n')}
You: ${input.userMessage}
`;

    const response = await ai.generate({
      prompt: systemPrompt,
      output: {
        schema: VRChatOutputSchema,
      }
    });
    
    const output = response.output;

    if (!output) {
      console.error("Failed to parse VRChat response: No output from AI.");
      return { responses: [{ author: 'System', text: 'An AI participant had a connection error.' }] };
    }
    
    return output;
  }
);
