
'use client';

import { createContext, useContext, useState, ReactNode, useEffect } from 'react';

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

  // This effect runs once on mount to load settings from localStorage
  useEffect(() => {
    const storedBanners = localStorage.getItem('nexus-vr-show-banners');
    if (storedBanners !== null) {
      setShowAppBanners(JSON.parse(storedBanners));
    }

    const storedUsername = localStorage.getItem('nexus-vr-username');
    if (storedUsername) {
      setUsername(storedUsername);
    }
  }, []);

  // Handler to update state and localStorage for banner settings
  const handleSetShowAppBanners = (show: boolean) => {
    localStorage.setItem('nexus-vr-show-banners', JSON.stringify(show));
    setShowAppBanners(show);
  };

  // Handler to update state and localStorage for username
  const handleSetUsername = (name: string) => {
    localStorage.setItem('nexus-vr-username', name);
    setUsername(name);
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
