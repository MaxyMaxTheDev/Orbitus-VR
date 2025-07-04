'use server';
/**
 * @fileOverview An AI flow for handling user login using a tool.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import {LoginInputSchema, LoginOutputSchema} from '../schemas';
import type {LoginInput, LoginOutput} from '../schemas';

export type {LoginInput, LoginOutput};

const mockUsers = [
  {username: 'NexusUser', password: 'password123'},
  {username: 'SynthRider', password: 'synth'},
  {username: 'Oracle', password: 'data'},
];

// Define the tool for checking credentials. This simulates a database lookup.
const checkUserCredentials = ai.defineTool(
  {
    name: 'checkUserCredentials',
    description:
      'Checks a username and password against the Accounts database.',
    inputSchema: LoginInputSchema,
    outputSchema: z.object({
      isValid: z
        .boolean()
        .describe('Whether the credentials are valid or not.'),
    }),
  },
  async ({username, password}) => {
    const user = mockUsers.find(
      u => u.username === username && u.password === password
    );
    return {isValid: !!user};
  }
);

// Define a prompt that instructs the AI to use the tool and then respond in a specific format.
const loginPrompt = ai.definePrompt({
  name: 'loginPrompt',
  input: {schema: LoginInputSchema},
  output: {schema: LoginOutputSchema}, // Instruct the AI on the output format
  tools: [checkUserCredentials],
  prompt: `You are an authentication agent for an operating system called NexusVR.
A user is trying to log in.
Your task is to use the 'checkUserCredentials' tool with the provided username and password to verify their identity.

Username: {{{username}}}
Password: {{{password}}}

Based on the result from the tool:
- If the tool indicates the credentials are valid (isValid: true), set the 'success' field in your response to true and 'message' to "Login successful.".
- If the tool indicates the credentials are invalid (isValid: false), set the 'success' field to false and 'message' to "Incorrect username or password.".
`,
});

// The main flow just calls the prompt. Genkit handles the tool-calling loop.
const loginFlow = ai.defineFlow(
  {
    name: 'loginFlow',
    inputSchema: LoginInputSchema,
    outputSchema: LoginOutputSchema,
  },
  async input => {
    const {output} = await loginPrompt(input);
    return output!;
  }
);

export async function login(input: LoginInput): Promise<LoginOutput> {
  if (!process.env.GOOGLE_API_KEY) {
    console.warn('GOOGLE_API_KEY not set. Using mock login validation.');
    const user = mockUsers.find(
      u => u.username === input.username && u.password === input.password
    );
    if (user) {
      return {success: true, message: 'Login successful.'};
    }
    return {success: false, message: 'Incorrect username or password.'};
  }
  return loginFlow(input);
}
