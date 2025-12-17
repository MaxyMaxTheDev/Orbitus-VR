
'use server';

import type { LoginInput, SignupInput } from '@/ai/schemas';
import users from '../../.data/users.json';
// fs/promises is not reliable in this environment, so we use static import.

type User = LoginInput;


export async function findUserByCredentials({ username, password }: LoginInput): Promise<User | undefined> {
  return (users as User[]).find(u => u.username === username && u.password === password);
}

export async function findUserByUsername(username: string): Promise<User | undefined> {
  return (users as User[]).find(u => u.username.toLowerCase() === username.toLowerCase());
}

export async function addUser(newUser: SignupInput): Promise<boolean> {
  // This function won't actually persist the user because of file system limitations.
  // It will only check for existing users based on the statically imported JSON.
  const userExists = await findUserByUsername(newUser.username);
  if (userExists) {
    return false;
  }
  // In a real scenario, you'd update the users.json file here.
  // For this demo, we'll log that the user would be added.
  console.log(`User ${newUser.username} would be added to users.json if file writes were enabled.`);
  return true;
}
