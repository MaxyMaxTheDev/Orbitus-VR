import { promises as fs } from 'fs';
import path from 'path';

export interface StoredUser {
  uid: string;
  email: string;
  password: string;
  displayName: string;
  createdAt: string;
}

const USERS_FILE = path.join(process.cwd(), 'data', 'users.json');

export async function readUsers(): Promise<StoredUser[]> {
  try {
    const data = await fs.readFile(USERS_FILE, 'utf-8');
    return JSON.parse(data);
  } catch {
    return [];
  }
}

export async function writeUsers(users: StoredUser[]): Promise<void> {
  await fs.writeFile(USERS_FILE, JSON.stringify(users, null, 2), 'utf-8');
}

export function generateUid(): string {
  return 'u_' + Date.now().toString(36) + '_' + Math.random().toString(36).slice(2, 10);
}
