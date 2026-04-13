'use server';
/**
 * @fileOverview An AI flow to generate fictional performance metrics for code.
 */

import { ai } from '@/ai/genkit';
import {
  ProfileCodeInputSchema,
  ProfileCodeOutputSchema,
} from '../schemas';
import type { ProfileCodeInput, ProfileCodeOutput } from '../schemas';

export type { ProfileCodeInput, ProfileCodeOutput };

export async function profileCode(input: ProfileCodeInput): Promise<ProfileCodeOutput> {
  if (!process.env.GOOGLE_API_KEY) {
    return {
      quantumComplexity: "N/A",
      temporalStability: "N/A",
      aethericConsumption: "N/A",
      summary: "AI features are disabled. Please provide a GOOGLE_API_KEY in your .env file.",
    };
  }
  return profileCodeFlow(input);
}

const profileCodePrompt = ai.definePrompt({
    name: 'profileCodePrompt',
    input: { schema: ProfileCodeInputSchema },
    output: { schema: ProfileCodeOutputSchema },
    prompt: `You are a futuristic AI code analysis engine for the NovaVR operating system.
Your task is to analyze the user-provided code snippet and generate a set of fictional, sci-fi performance metrics.
Be creative and use futuristic-sounding terminology. Do not explain the code, only provide the fictional analysis based on the output schema.

Code Snippet:
\`\`\`
${"{{{code}}}"}
\`\`\`

Generate the following metrics:
- **Quantum Complexity**: A measure of the code's complexity in a quantum computing context.
- **Temporal Stability**: How resistant the code is to time-dilation effects or paradoxes.
- **Aetheric Consumption**: The amount of "aether" or background energy the code consumes.
- **Summary**: A very brief, technical-sounding summary of the analysis.
`,
});

const profileCodeFlow = ai.defineFlow(
  {
    name: 'profileCodeFlow',
    inputSchema: ProfileCodeInputSchema,
    outputSchema: ProfileCodeOutputSchema,
  },
  async (input) => {
    const { output } = await profileCodePrompt(input);
    return output!;
  }
);
