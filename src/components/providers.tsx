
'use client';

import { SessionProvider } from 'next-auth/react';
import { SettingsProvider } from '@/contexts/settings-context';
import { MusicPlayerProvider } from '@/contexts/music-player-context';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
        <SettingsProvider>
            <MusicPlayerProvider>
                {children}
            </MusicPlayerProvider>
        </SettingsProvider>
    </SessionProvider>
  );
}
