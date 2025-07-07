'use server';
/**
 * @fileOverview An AI flow for handling user registration.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import {SignupInputSchema, SignupOutputSchema} from '../schemas';
import type {SignupInput, SignupOutput} from '../schemas';
import { findUserByUsername, addUser } from '@/lib/users';

export type {SignupInput, SignupOutput};

// Tool to check if a username already exists.
const checkUsernameExists = ai.defineTool(
  {
    name: 'checkUsernameExists',
    description: 'Checks if a username already exists in the Accounts database.',
    inputSchema: z.object({username: z.string()}),
    outputSchema: z.object({exists: z.boolean()}),
  },
  async ({username}) => {
    const user = await findUserByUsername(username);
    return {exists: !!user};
  }
);

// Tool to create a new user account.
const createNewUser = ai.defineTool(
  {
    name: 'createNewUser',
    description:
      'Creates a new user account in the database. Only use this after checking that the username does not already exist.',
    inputSchema: SignupInputSchema,
    outputSchema: z.object({success: z.boolean()}),
  },
  async (newUser) => {
    const success = await addUser(newUser);
    if (success) {
      console.log(`AI confirmed new user can be created: ${newUser.username}`);
    }
    return {success};
  }
);

// Prompt to guide the AI through the registration logic.
const signupPrompt = ai.definePrompt({
  name: 'signupPrompt',
  input: {schema: SignupInputSchema},
  output: {schema: SignupOutputSchema},
  tools: [checkUsernameExists, createNewUser],
  prompt: `You are a user registration agent for an operating system called XenovaVR.
A user is trying to create a new account.

Your tasks are:
1. Use the 'checkUsernameExists' tool to see if the provided username is already taken.
   Username: {{{username}}}

2. Based on the tool's result:
   - If the username already exists (exists: true), your final response MUST have 'success' set to false and 'message' set to "Username already taken." DO NOT proceed to the next step.
   - If the username does NOT exist (exists: false), proceed to step 3.

3. Use the 'createNewUser' tool to create the new account with the provided username and password.
   Username: {{{username}}}
   Password: {{{password}}}

4. Based on the result from the 'createNewUser' tool:
    - If user creation is successful, set 'success' to true and 'message' to "Account created successfully.".
    - If user creation fails, set 'success' to false and 'message' to "Failed to create account.".
`,
});

// The main flow that executes the signup process.
const signupFlow = ai.defineFlow(
  {
    name: 'signupFlow',
    inputSchema: SignupInputSchema,
    outputSchema: SignupOutputSchema,
  },
  async input => {
    const {output} = await signupPrompt(input);
    return output!;
  }
);

export async function signup(input: SignupInput): Promise<SignupOutput> {
  if (!process.env.GOOGLE_API_KEY) {
    console.warn('GOOGLE_API_KEY not set. Using direct signup validation.');
    const userExists = await findUserByUsername(input.username);
    if (userExists) {
      return {success: false, message: 'Username already taken.'};
    }
    await addUser(input);
    return {success: true, message: 'Account created successfully.'};
  }
  try {
    return await signupFlow(input);
  } catch (e: any) {
    if (e.message?.includes('429')) {
      console.warn(
        'Google AI quota exceeded. Falling back to direct signup validation.'
      );
      const userExists = await findUserByUsername(input.username);
      if (userExists) {
        return {success: false, message: 'Username already taken.'};
      }
      await addUser(input);
      return {success: true, message: 'Account created successfully.'};
    }
    // Re-throw other errors
    throw e;
  }
}
