'use client';

import { get, set } from '@/lib/idb';

const ACCOUNTS_KEY = 'local-accounts';
const SESSION_KEY = 'orbitus-auth-user';

export interface LocalUser {
  uid: string;
  username: string;
  displayName: string;
}

interface StoredAccount {
  uid: string;
  username: string;
  displayName: string;
  salt: string;
  passwordHash: string;
  createdAt: number;
}

export type AuthErrorCode =
  | 'auth/username-taken'
  | 'auth/user-not-found'
  | 'auth/invalid-credential'
  | 'auth/invalid-username';

export class AuthError extends Error {
  code: AuthErrorCode;
  constructor(code: AuthErrorCode, message: string) {
    super(message);
    this.name = 'AuthError';
    this.code = code;
  }
}

// Accounts live only in this browser's IndexedDB. Nothing is written to the
// server, so there is no users.json, no filesystem on Vercel, and no database.
// Passwords are salted and stretched with PBKDF2 rather than stored as text.
async function derivePassword(password: string, salt: string): Promise<string> {
  const encoder = new TextEncoder();
  const material = await crypto.subtle.importKey(
    'raw',
    encoder.encode(password),
    'PBKDF2',
    false,
    ['deriveBits']
  );
  const bits = await crypto.subtle.deriveBits(
    { name: 'PBKDF2', salt: encoder.encode(salt), iterations: 150000, hash: 'SHA-256' },
    material,
    256
  );
  return Array.from(new Uint8Array(bits))
    .map((byte) => byte.toString(16).padStart(2, '0'))
    .join('');
}

function randomSalt(): string {
  const bytes = crypto.getRandomValues(new Uint8Array(16));
  return Array.from(bytes)
    .map((byte) => byte.toString(16).padStart(2, '0'))
    .join('');
}

function normalize(username: string): string {
  return username.trim().toLowerCase();
}

async function readAccounts(): Promise<StoredAccount[]> {
  const accounts = await get<StoredAccount[]>(ACCOUNTS_KEY);
  return Array.isArray(accounts) ? accounts : [];
}

async function writeAccounts(accounts: StoredAccount[]): Promise<void> {
  await set(ACCOUNTS_KEY, accounts);
}

export async function listAccounts(): Promise<Omit<StoredAccount, 'salt' | 'passwordHash'>[]> {
  const accounts = await readAccounts();
  return accounts
    .map(({ uid, username, displayName, createdAt }) => ({ uid, username, displayName, createdAt }))
    .sort((a, b) => b.createdAt - a.createdAt);
}

export async function signUp(username: string, password: string): Promise<{ user: LocalUser }> {
  const key = normalize(username);
  if (key.length < 3) {
    throw new AuthError('auth/invalid-username', 'Username must be at least 3 characters.');
  }
  if (password.length < 4) {
    throw new AuthError('auth/invalid-credential', 'Password must be at least 4 characters.');
  }

  const accounts = await readAccounts();
  if (accounts.some((account) => account.username === key)) {
    throw new AuthError('auth/username-taken', 'That username is already taken.');
  }

  const salt = randomSalt();
  const account: StoredAccount = {
    uid: crypto.randomUUID(),
    username: key,
    displayName: username.trim(),
    salt,
    passwordHash: await derivePassword(password, salt),
    createdAt: Date.now(),
  };

  await writeAccounts([...accounts, account]);
  const user: LocalUser = { uid: account.uid, username: account.username, displayName: account.displayName };
  saveSession(user);
  return { user };
}

export async function signIn(username: string, password: string): Promise<{ user: LocalUser }> {
  const key = normalize(username);
  const accounts = await readAccounts();
  const account = accounts.find((candidate) => candidate.username === key);

  // Hash even when the account is missing so a missing username and a wrong
  // password take a similar amount of time to answer.
  const salt = account?.salt ?? 'no-such-account';
  const hash = await derivePassword(password, salt);

  if (!account || hash !== account.passwordHash) {
    throw new AuthError(
      account ? 'auth/invalid-credential' : 'auth/user-not-found',
      account ? 'Incorrect password.' : 'No local account with that username.'
    );
  }

  const user: LocalUser = { uid: account.uid, username: account.username, displayName: account.displayName };
  saveSession(user);
  return { user };
}

export async function updateProfile(updates: { displayName?: string }): Promise<void> {
  const current = getCurrentUser();
  if (!current) return;

  const accounts = await readAccounts();
  await writeAccounts(
    accounts.map((account) =>
      account.uid === current.uid && updates.displayName
        ? { ...account, displayName: updates.displayName }
        : account
    )
  );
  saveSession({ ...current, displayName: updates.displayName ?? current.displayName });
}

export async function signOut(): Promise<void> {
  if (typeof window !== 'undefined') {
    window.localStorage.removeItem(SESSION_KEY);
  }
  currentState = { user: null, isLoading: false };
  emitChange();
}

export function getCurrentUser(): LocalUser | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = window.localStorage.getItem(SESSION_KEY);
    return raw ? (JSON.parse(raw) as LocalUser) : null;
  } catch {
    return null;
  }
}

function saveSession(user: LocalUser): void {
  if (typeof window !== 'undefined') {
    window.localStorage.setItem(SESSION_KEY, JSON.stringify(user));
  }
  currentState = { user, isLoading: false };
  emitChange();
}

let listeners: Array<() => void> = [];
let currentState: { user: LocalUser | null; isLoading: boolean } = { user: null, isLoading: true };

function emitChange() {
  for (const listener of listeners) {
    listener();
  }
}

export function onAuthStateChanged(callback: (user: LocalUser | null) => void): () => void {
  const listener = () => callback(currentState.user);
  listeners.push(listener);

  // Hydrate once on first subscribe so the session survives a refresh.
  queueMicrotask(() => {
    if (currentState.isLoading) {
      currentState = { user: getCurrentUser(), isLoading: false };
    }
    callback(currentState.user);
  });

  return () => {
    listeners = listeners.filter((candidate) => candidate !== listener);
  };
}
