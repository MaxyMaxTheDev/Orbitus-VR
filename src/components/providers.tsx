
'use client';

import { SettingsProvider } from '@/contexts/settings-context';
import { MusicPlayerProvider } from '@/contexts/music-player-context';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SettingsProvider>
        <MusicPlayerProvider>
            {children}
        </MusicPlayerProvider>
    </SettingsProvider>
  );
}
