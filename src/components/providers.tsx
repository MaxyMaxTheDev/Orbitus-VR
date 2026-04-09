'use client';

import { SettingsProvider } from '@/contexts/settings-context';
import { MusicPlayerProvider } from '@/contexts/music-player-context';
import { FirebaseClientProvider } from '@/firebase';
import { SessionProvider } from 'next-auth/react';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
        <SettingsProvider>
            <MusicPlayerProvider>
                <FirebaseClientProvider>
                    {children}
                </FirebaseClientProvider>
            </MusicPlayerProvider>
        </SettingsProvider>
    </SessionProvider>
  );
}
