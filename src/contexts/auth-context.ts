'use client';

import { useState, useEffect } from 'react';
import { onAuthStateChanged, type LocalUser } from '@/lib/local-auth';

export function useAuth() {
  const [currentUser, setCurrentUser] = useState<LocalUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged((user) => {
      setCurrentUser(user);
      setIsLoading(false);
    });
    return () => unsubscribe();
  }, []);

  return { currentUser, isLoading };
}
