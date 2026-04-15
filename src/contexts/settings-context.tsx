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

export type WidgetName = 'insight' | 'overview' | 'storage' | 'news' | 'wellness' | 'tasks' | 'music';

type SettingsContextType = {
  showAppBanners: boolean;
  setShowAppBanners: (show: boolean) => void;
  username: string;
  setUsername: (name: string) => void;
  notificationPosition: NotificationPosition;
  setNotificationPosition: (position: NotificationPosition) => void;
  uiScale: number;
  setUiScale: (scale: number) => void;
  dashboardWidgets: WidgetName[];
  setDashboardWidgets: (widgets: WidgetName[]) => void;
  isEditingDashboard: boolean;
  setIsEditingDashboard: (isEditing: boolean) => void;
  isGuest: boolean;
};

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

const defaultWidgets: WidgetName[] = ['insight', 'overview', 'storage', 'news'];

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [showAppBanners, setShowAppBanners] = useState(true);
  const [username, setUsername] = useState("User");
  const [notificationPosition, setNotificationPosition] = useState<NotificationPosition>('bottom-right');
  const [uiScale, setUiScale] = useState(100);
  const [dashboardWidgets, setDashboardWidgets] = useState<WidgetName[]>(defaultWidgets);
  const [isEditingDashboard, setIsEditingDashboard] = useState(false);

  const isGuest = username.toLowerCase() === 'guest';

  // Helper to skip saving if Guest
  const persist = async (key: string, val: any) => {
    if (isGuest) return;
    try {
      await set(key, val);
    } catch (e) {
      console.error(`Failed to save ${key} to DB`, e);
    }
  };

  // This effect runs once on mount to load settings from IndexedDB
  useEffect(() => {
    const loadSettings = async () => {
      try {
        const storedBanners = await get<boolean>('orbitus-vr-show-banners');
        if (storedBanners !== undefined) {
          setShowAppBanners(storedBanners);
        }

        const storedUsername = await get<string>('orbitus-vr-username');
        if (storedUsername) {
          setUsername(storedUsername);
        }
        
        const storedPosition = await get<NotificationPosition>('orbitus-vr-notification-position');
        if (storedPosition) {
          setNotificationPosition(storedPosition);
        }
        
        const storedUiScale = await get<number>('orbitus-vr-ui-scale');
        if (storedUiScale) {
          setUiScale(storedUiScale);
        }

        const storedWidgets = await get<WidgetName[]>('orbitus-vr-dashboard-widgets');
        if (storedWidgets) {
          setDashboardWidgets(storedWidgets);
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
    persist('orbitus-vr-show-banners', show);
  };

  // Handler to update state and IndexedDB for username
  const handleSetUsername = (name: string) => {
    setUsername(name);
    persist('orbitus-vr-username', name);
  };
  
  // Handler to update state and IndexedDB for notification position
  const handleSetNotificationPosition = (position: NotificationPosition) => {
    setNotificationPosition(position);
    persist('orbitus-vr-notification-position', position);
  };

  // Handler to update state and IndexedDB for UI Scale
  const handleSetUiScale = (scale: number) => {
    setUiScale(scale);
    persist('orbitus-vr-ui-scale', scale);
  };

  const handleSetDashboardWidgets = (widgets: WidgetName[]) => {
    setDashboardWidgets(widgets);
    persist('orbitus-vr-dashboard-widgets', widgets);
  };

  const handleSetIsEditingDashboard = (isEditing: boolean) => {
    setIsEditingDashboard(isEditing);
  };

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
        dashboardWidgets,
        setDashboardWidgets: handleSetDashboardWidgets,
        isEditingDashboard,
        setIsEditingDashboard: handleSetIsEditingDashboard,
        isGuest,
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
