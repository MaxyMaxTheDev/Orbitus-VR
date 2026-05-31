'use client';

import { AlertTriangle } from 'lucide-react';
import { ReactNode, useState, useEffect } from 'react';
import { FirebaseProvider } from './provider';
import { initializeFirebase, type FirebaseInstances } from './index';

export function FirebaseClientProvider({ children }: { children: ReactNode }) {
  const [instances, setInstances] = useState<FirebaseInstances | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      setInstances(initializeFirebase());
    } catch (error: any) {
      const message = error?.message || 'Firebase could not be initialized.';
      console.error('[Firebase] Initialization failed:', message);
      setError(message);
    }
  }, []);

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background p-6 text-foreground">
        <div className="max-w-xl rounded-2xl border border-destructive/40 bg-card p-6 shadow-2xl">
          <div className="mb-4 flex items-center gap-3 text-destructive">
            <AlertTriangle className="h-6 w-6" />
            <h1 className="text-xl font-bold">Firebase configuration required</h1>
          </div>
          <p className="text-sm text-muted-foreground">{error}</p>
          <p className="mt-4 text-sm text-muted-foreground">
            Add the `NEXT_PUBLIC_FIREBASE_*` values from your Firebase web app config to your Vercel project, then redeploy.
          </p>
        </div>
      </div>
    );
  }

  if (!instances) {
    return null;
  }

  return <FirebaseProvider value={instances}>{children}</FirebaseProvider>;
}
