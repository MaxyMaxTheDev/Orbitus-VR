
'use client';

import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { get, set } from '@/lib/idb';

type SettingsContextType = {
  showAppBanners: boolean;
  setShowAppBanners: (show: boolean) => void;
  username: string;
  setUsername: (name: string) => void;
};

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [showAppBanners, setShowAppBanners] = useState(true);
  const [username, setUsername] = useState("User");

  // This effect runs once on mount to load settings from IndexedDB
  useEffect(() => {
    const loadSettings = async () => {
      try {
        const storedBanners = await get<boolean>('nexus-vr-show-banners');
        if (storedBanners !== undefined) {
          setShowAppBanners(storedBanners);
        }

        const storedUsername = await get<string>('nexus-vr-username');
        if (storedUsername) {
          setUsername(storedUsername);
        }
      } catch (error) {
        console.error("Failed to load settings from IndexedDB", error);
      }
    };
    loadSettings();
  }, []);

  // Handler to update state and IndexedDB for banner settings
  const handleSetShowAppBanners = (show: boolean) => {
    setShowAppBanners(show);
    set('nexus-vr-show-banners', show).catch(e => console.error("Failed to save banner setting to DB", e));
  };

  // Handler to update state and IndexedDB for username
  const handleSetUsername = (name: string) => {
    setUsername(name);
    set('nexus-vr-username', name).catch(e => console.error("Failed to save username to DB", e));
  };

  return (
    <SettingsContext.Provider value={{ 
        showAppBanners, 
        setShowAppBanners: handleSetShowAppBanners, 
        username, 
        setUsername: handleSetUsername 
    }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
}
