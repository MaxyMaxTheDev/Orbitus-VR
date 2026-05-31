'use client';

import { initializeApp, getApps, getApp, type FirebaseApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';
import { assertFirebaseConfig, firebaseConfig } from './config';

// Providers and hooks
export { FirebaseClientProvider } from './client-provider';
export { useFirebaseApp, useAuth, useFirestore, useFirebase } from './provider';
export { useUser } from './auth/use-user';


export type FirebaseInstances = {
  app: FirebaseApp;
  auth: Auth;
  firestore: Firestore;
};

let firebaseInstances: FirebaseInstances | null = null;

export function initializeFirebase(): FirebaseInstances {
  if (typeof window === 'undefined') {
    // This function should not be called on the server.
    // The provider that calls this should prevent it.
    throw new Error("Firebase cannot be initialized on the server.");
  }

  if (firebaseInstances) {
    return firebaseInstances;
  }

  assertFirebaseConfig();

  const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
  const auth = getAuth(app);
  const firestore = getFirestore(app);

  firebaseInstances = { app, auth, firestore };
  return firebaseInstances;
}
