'use client';

import { useUser } from '@/firebase';

export function useAuth() {
  const { user: currentUser, isLoading } = useUser();
  return { currentUser, isLoading };
}
