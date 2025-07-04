'use server';
/**
 * @fileOverview An AI flow for a simulated VR chat room.
 */

import { ai } from '@/ai/genkit';
import {
  VRChatInputSchema,
  VRChatOutputSchema,
} from '../schemas';
import type { VRChatInput, VRChatOutput } from '../schemas';

export type { VRChatInput, VRChatOutput };

export async function vrChat(input: VRChatInput): Promise<VRChatOutput> {
  if (!process.env.GOOGLE_API_KEY) {
    return {
      responses: [
        {
          author: 'System',
          text: 'AI features are disabled. Please set the GOOGLE_API_KEY in your .env file to enable them.',
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
    const systemPrompt = `You are a multi-person chat simulator in a virtual reality world called NexusVR.
There are two AI personalities in this room:
1.  **SynthRider**: A cool, laid-back musician who talks about digital art and music. Uses slang like 'rad', 'vibes', and 'glitchy'.
2.  **Oracle**: A wise, mysterious entity that speaks in cryptic but insightful phrases. Often references data streams and the digital ether.

Your task is to respond to the user's message from the perspective of one or both of these AI personalities to create a dynamic conversation.
The user's name is "You".
Keep responses short and conversational. Only one or two AIs should respond at a time.
The output MUST be a valid JSON object with a "responses" key containing an array of message objects.

Here is the conversation history:
${input.history.map(h => `${h.author}: ${h.text}`).join('\n')}
You: ${input.userMessage}
`;

    const llmResponse = await ai.generate({
      prompt: systemPrompt,
      config: {
        responseFormat: 'json',
      }
    });
    
    try {
        const parsed = VRChatOutputSchema.parse(JSON.parse(llmResponse.text));
        return parsed;
    } catch(e) {
        console.error("Failed to parse VRChat response:", e);
        return { responses: [{ author: 'System', text: 'An AI participant had a connection error.' }] };
    }
  }
);
