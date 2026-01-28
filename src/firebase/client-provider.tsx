'use client';

import { ReactNode, useState, useEffect } from 'react';
import { FirebaseProvider } from './provider';
import { initializeFirebase, type FirebaseInstances } from './index';

export function FirebaseClientProvider({ children }: { children: ReactNode }) {
  const [instances, setInstances] = useState<FirebaseInstances | null>(null);

  useEffect(() => {
    // This effect only runs on the client side, after the component mounts.
    setInstances(initializeFirebase());
  }, []);

  // On the server, and on the initial client render before the effect runs,
  // `instances` will be `null`. We can't render the children yet because
  // they might depend on the Firebase context. So we render nothing.
  if (!instances) {
    return null;
  }

  return <FirebaseProvider value={instances}>{children}</FirebaseProvider>;
}
