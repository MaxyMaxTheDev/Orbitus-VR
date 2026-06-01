'use client';

import { SettingsProvider } from '@/contexts/settings-context';
import { MusicPlayerProvider } from '@/contexts/music-player-context';
import { AuthProvider } from '@/contexts/auth-context';
import { SessionProvider } from 'next-auth/react';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
        <SettingsProvider>
            <AuthProvider>
                <MusicPlayerProvider>
                    {children}
                </MusicPlayerProvider>
            </AuthProvider>
        </SettingsProvider>
    </SessionProvider>
  );
}
