
'use client';

import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { get, set } from '@/lib/idb';

export type NotificationPosition = 
  | 'top-left' 
  | 'top-center' 
  | 'top-right' 
  | 'bottom-left' 
  | 'bottom-center' 
  | 'bottom-right';

type SettingsContextType = {
  showAppBanners: boolean;
  setShowAppBanners: (show: boolean) => void;
  username: string;
  setUsername: (name: string) => void;
  notificationPosition: NotificationPosition;
  setNotificationPosition: (position: NotificationPosition) => void;
  uiScale: number;
  setUiScale: (scale: number) => void;
};

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [showAppBanners, setShowAppBanners] = useState(true);
  const [username, setUsername] = useState("User");
  const [notificationPosition, setNotificationPosition] = useState<NotificationPosition>('bottom-right');
  const [uiScale, setUiScale] = useState(100);

  // This effect runs once on mount to load settings from IndexedDB
  useEffect(() => {
    const loadSettings = async () => {
      try {
        const storedBanners = await get<boolean>('xenova-vr-show-banners');
        if (storedBanners !== undefined) {
          setShowAppBanners(storedBanners);
        }

        const storedUsername = await get<string>('xenova-vr-username');
        if (storedUsername) {
          setUsername(storedUsername);
        }
        
        const storedPosition = await get<NotificationPosition>('xenova-vr-notification-position');
        if (storedPosition) {
          setNotificationPosition(storedPosition);
        }
        
        const storedUiScale = await get<number>('xenova-vr-ui-scale');
        if (storedUiScale) {
          setUiScale(storedUiScale);
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
    set('xenova-vr-show-banners', show).catch(e => console.error("Failed to save banner setting to DB", e));
  };

  // Handler to update state and IndexedDB for username
  const handleSetUsername = (name: string) => {
    setUsername(name);
    set('xenova-vr-username', name).catch(e => console.error("Failed to save username to DB", e));
  };
  
  // Handler to update state and IndexedDB for notification position
  const handleSetNotificationPosition = (position: NotificationPosition) => {
    setNotificationPosition(position);
    set('xenova-vr-notification-position', position).catch(e => console.error("Failed to save notification position to DB", e));
  };

  // Handler to update state and IndexedDB for UI Scale
  const handleSetUiScale = (scale: number) => {
    setUiScale(scale);
    set('xenova-vr-ui-scale', scale).catch(e => console.error("Failed to save ui scale to DB", e));
  }

  return (
    <SettingsContext.Provider value={{ 
        showAppBanners, 
        setShowAppBanners: handleSetShowAppBanners, 
        username, 
        setUsername: handleSetUsername,
        notificationPosition,
        setNotificationPosition: handleSetNotificationPosition,
        uiScale,
        setUiScale: handleSetUiScale,
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
