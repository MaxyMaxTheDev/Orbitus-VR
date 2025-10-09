'use server';
/**
 * @fileOverview An AI flow for handling user registration.
 */

import {SignupInputSchema, SignupOutputSchema} from '../schemas';
import type {SignupInput, SignupOutput} from '../schemas';
import { findUserByUsername, addUser } from '@/lib/users';

export type {SignupInput, SignupOutput};

export async function signup(input: SignupInput): Promise<SignupOutput> {
    const userExists = await findUserByUsername(input.username);
    if (userExists) {
      return {success: false, message: 'Username already taken.'};
    }
    const success = await addUser(input);
    if (success) {
        return {success: true, message: 'Account created successfully.'};
    }
    return {success: false, message: 'Failed to create account.'};
}
