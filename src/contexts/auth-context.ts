'use client';

import { useSession } from 'next-auth/react';

export interface LocalUser {
  uid: string;
  email: string;
  displayName: string;
}

// Identity comes entirely from the Google session, so there is nothing to
// persist locally. `uid` is the email, which is stable and unique per account
// and is what per-user data in IndexedDB is keyed by.
export function useAuth() {
  const { data: session, status } = useSession();

  if (status === 'loading') {
    return { currentUser: null, isLoading: true };
  }

  const email = session?.user?.email ?? null;
  const currentUser: LocalUser | null = email
    ? {
        uid: email,
        email,
        displayName: session?.user?.name || email.split('@')[0],
      }
    : null;

  return { currentUser, isLoading: false };
}
