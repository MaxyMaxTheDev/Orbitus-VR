import fs from 'fs/promises';
import path from 'path';
import type { LoginInput } from '@/ai/schemas';

const usersFilePath = path.join(process.cwd(), 'users.json');

type User = LoginInput;

async function getUsers(): Promise<User[]> {
  try {
    const data = await fs.readFile(usersFilePath, 'utf-8');
    return JSON.parse(data);
  } catch (error: any) {
    if (error.code === 'ENOENT') {
      // File doesn't exist, return initial mock users and create the file
      const initialUsers = [
        {username: 'NexusUser', password: 'password123'},
        {username: 'SynthRider', password: 'synth'},
        {username: 'Oracle', password: 'data'},
      ];
      await fs.writeFile(usersFilePath, JSON.stringify(initialUsers, null, 2));
      return initialUsers;
    }
    console.error("Error reading users file:", error);
    return [];
  }
}

async function saveUsers(users: User[]): Promise<void> {
  await fs.writeFile(usersFilePath, JSON.stringify(users, null, 2));
}

export async function findUserByCredentials({ username, password }: LoginInput): Promise<User | undefined> {
  const users = await getUsers();
  return users.find(u => u.username === username && u.password === password);
}

export async function findUserByUsername(username: string): Promise<User | undefined> {
  const users = await getUsers();
  return users.find(u => u.username.toLowerCase() === username.toLowerCase());
}

export async function addUser(newUser: LoginInput): Promise<boolean> {
  const users = await getUsers();
  const userExists = users.some(u => u.username.toLowerCase() === newUser.username.toLowerCase());
  if (userExists) {
    return false;
  }
  users.push(newUser);
  await saveUsers(users);
  return true;
}
