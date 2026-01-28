
'use client';

import { SettingsProvider } from '@/contexts/settings-context';
import { MusicPlayerProvider } from '@/contexts/music-player-context';
import { FirebaseClientProvider } from '@/firebase';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SettingsProvider>
        <MusicPlayerProvider>
            <FirebaseClientProvider>
                {children}
            </FirebaseClientProvider>
        </MusicPlayerProvider>
    </SettingsProvider>
  );
}
