'use client';

import { get, set, del } from '@/lib/idb';

const PASSCODE_KEY = 'orbitus-passcode';

type PasscodeRecord = {
    accountKey: string;
    hash: string;
};

// The passcode is a local device gate, not a credential: it never leaves the
// browser and is never sent to Google or the server. Hashing it keeps the
// plaintext out of IndexedDB, and binding it to the account means a different
// Google account on this device does not inherit the passcode.
async function hashPasscode(passcode: string, accountKey: string): Promise<string> {
    const data = new TextEncoder().encode(`orbitus:${accountKey}:${passcode}`);
    const digest = await crypto.subtle.digest('SHA-256', data);
    return Array.from(new Uint8Array(digest))
        .map((byte) => byte.toString(16).padStart(2, '0'))
        .join('');
}

export async function setPasscode(passcode: string, accountKey: string): Promise<void> {
    const record: PasscodeRecord = {
        accountKey,
        hash: await hashPasscode(passcode, accountKey),
    };
    await set(PASSCODE_KEY, record);
}

export async function hasPasscode(accountKey: string): Promise<boolean> {
    const record = await get<PasscodeRecord>(PASSCODE_KEY);
    return Boolean(record && record.accountKey === accountKey);
}

export async function verifyPasscode(passcode: string, accountKey: string): Promise<boolean> {
    const record = await get<PasscodeRecord>(PASSCODE_KEY);
    if (!record || record.accountKey !== accountKey) return false;
    return record.hash === (await hashPasscode(passcode, accountKey));
}

export async function clearPasscode(): Promise<void> {
    await del(PASSCODE_KEY);
}
