'use server';
/**
 * @fileOverview An AI flow for handling user login using a tool.
 */

import {LoginInputSchema, LoginOutputSchema} from '../schemas';
import type {LoginInput, LoginOutput} from '../schemas';
import { findUserByCredentials } from '@/lib/users';

export type {LoginInput, LoginOutput};

// This is the primary function exported and called by the UI.
export async function login(input: LoginInput): Promise<LoginOutput> {
    const user = await findUserByCredentials(input);
    if (user) {
      return {success: true, message: 'Login successful.'};
    }
    return {success: false, message: 'Incorrect username or password.'};
}
