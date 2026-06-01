import initialUsers from '@/data/users.json';
import { del, get, set } from '@/lib/idb';

export type LocalUser = {
  id: string;
  username: string;
  email: string;
  password: string;
  createdAt: string;
};

const USERS_KEY = 'users.json';
const SESSION_KEY = 'orbitus-vr-current-user';

function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

function displayNameFromEmail(email: string): string {
  return email.split('@')[0] || 'User';
}

export async function getUsers(): Promise<LocalUser[]> {
  return (await get<LocalUser[]>(USERS_KEY)) ?? (initialUsers as unknown as LocalUser[]);
}

async function saveUsers(users: LocalUser[]): Promise<void> {
  await set(USERS_KEY, users);
}

export async function getCurrentUser(): Promise<LocalUser | undefined> {
  return get<LocalUser>(SESSION_KEY);
}

export async function setCurrentUser(user: LocalUser): Promise<void> {
  await set(SESSION_KEY, user);
}

export async function signOutLocalUser(): Promise<void> {
  await del(SESSION_KEY);
}

export async function signInLocalUser(identifier: string, password: string): Promise<LocalUser> {
  const normalizedIdentifier = normalizeEmail(identifier);
  const users = await getUsers();
  const user = users.find(
    (candidate) =>
      normalizeEmail(candidate.email) === normalizedIdentifier ||
      candidate.username.trim().toLowerCase() === identifier.trim().toLowerCase()
  );

  if (!user || user.password !== password) {
    throw new Error('Incorrect username, email, or password.');
  }

  await setCurrentUser(user);
  return user;
}

export async function signUpLocalUser(username: string, email: string, password: string): Promise<LocalUser> {
  const trimmedUsername = username.trim();
  const normalizedEmail = normalizeEmail(email);

  if (!trimmedUsername || !normalizedEmail || !password) {
    throw new Error('Username, email, and password are required.');
  }

  const users = await getUsers();
  const exists = users.some(
    (candidate) =>
      normalizeEmail(candidate.email) === normalizedEmail ||
      candidate.username.trim().toLowerCase() === trimmedUsername.toLowerCase()
  );

  if (exists) {
    throw new Error('That username or email is already registered.');
  }

  const user: LocalUser = {
    id: crypto.randomUUID(),
    username: trimmedUsername || displayNameFromEmail(normalizedEmail),
    email: normalizedEmail,
    password,
    createdAt: new Date().toISOString(),
  };

  await saveUsers([...users, user]);
  await setCurrentUser(user);
  return user;
}

export async function ensureGuestUser(): Promise<LocalUser> {
  const users = await getUsers();
  const guestEmail = 'guest@orbitus.local';
  const existingGuest = users.find((user) => normalizeEmail(user.email) === guestEmail);

  if (existingGuest) {
    await setCurrentUser(existingGuest);
    return existingGuest;
  }

  const guest: LocalUser = {
    id: 'guest',
    username: 'Guest',
    email: guestEmail,
    password: 'orbitus_guest',
    createdAt: new Date().toISOString(),
  };

  await saveUsers([...users, guest]);
  await setCurrentUser(guest);
  return guest;
}

export async function updateLocalUsername(userId: string, username: string): Promise<LocalUser> {
  const users = await getUsers();
  const index = users.findIndex((user) => user.id === userId);

  if (index === -1) {
    throw new Error('Current user was not found in users.json.');
  }

  const updatedUser = { ...users[index], username: username.trim() };
  const updatedUsers = [...users];
  updatedUsers[index] = updatedUser;
  await saveUsers(updatedUsers);
  await setCurrentUser(updatedUser);
  return updatedUser;
}
