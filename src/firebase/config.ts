import type { FirebaseOptions } from 'firebase/app';

export const firebaseConfig: FirebaseOptions = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

const requiredFirebaseConfig = {
  NEXT_PUBLIC_FIREBASE_API_KEY: firebaseConfig.apiKey,
  NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN: firebaseConfig.authDomain,
  NEXT_PUBLIC_FIREBASE_PROJECT_ID: firebaseConfig.projectId,
  NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET: firebaseConfig.storageBucket,
  NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID: firebaseConfig.messagingSenderId,
  NEXT_PUBLIC_FIREBASE_APP_ID: firebaseConfig.appId,
};

function isConfigured(value: string | undefined): boolean {
  return Boolean(value?.trim()) && !value?.startsWith('YOUR_');
}

export function getMissingFirebaseConfigKeys(): string[] {
  return Object.entries(requiredFirebaseConfig)
    .filter(([, value]) => !isConfigured(value))
    .map(([key]) => key);
}

export function assertFirebaseConfig(): void {
  const missingKeys = getMissingFirebaseConfigKeys();

  if (missingKeys.length > 0) {
    throw new Error(
      `Firebase is not configured. Set these Vercel Environment Variables: ${missingKeys.join(', ')}.`
    );
  }
}
