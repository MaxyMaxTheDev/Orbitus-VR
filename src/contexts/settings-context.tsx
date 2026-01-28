
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

        const storedWidgets = await get<WidgetName[]>('xenova-vr-dashboard-widgets');
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
  };

  const handleSetDashboardWidgets = (widgets: WidgetName[]) => {
    setDashboardWidgets(widgets);
    set('xenova-vr-dashboard-widgets', widgets).catch(e => console.error("Failed to save dashboard widgets to DB", e));
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

    