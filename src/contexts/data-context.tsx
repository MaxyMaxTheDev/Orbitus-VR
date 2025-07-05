'use client';

import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
  useCallback,
} from 'react';
import type { UserDataType } from '@/lib/types';
import { getUserData, setUserData } from '@/lib/data';
import { useAuth } from './auth-context';
import type { Message } from '@/ai/schemas';

// Define a default, empty state for when no user is logged in.
const defaultUserData: UserDataType = {
  username: 'Guest',
  settings: {
    showAppBanners: true,
    notificationPosition: 'bottom-right',
  },
  installedApps: [],
  notepadContent: '',
  vrChatHistory: [],
};

type DataContextType = {
  userData: UserDataType;
  setUserData: (data: UserDataType) => void;
  isDataLoading: boolean;
  installApp: (appName: string) => void;
  uninstallApp: (appName: string) => void;
  updateNotepad: (content: string) => void;
  updateVRChatHistory: (history: Message[]) => void;
  updateUsername: (name: string) => void;
  updateSettings: (settings: Partial<UserDataType['settings']>) => void;
};

const DataContext = createContext<DataContextType | undefined>(undefined);

export function DataProvider({ children }: { children: ReactNode }) {
  const { currentUser } = useAuth();
  const [userData, setUserDataState] = useState<UserDataType>(defaultUserData);
  const [isDataLoading, setIsDataLoading] = useState(true);

  // Load user data from Firestore when auth state changes
  useEffect(() => {
    async function loadData() {
      if (currentUser) {
        setIsDataLoading(true);
        const data = await getUserData(currentUser.uid);
        if (data) {
          setUserDataState(data);
        }
        setIsDataLoading(false);
      } else {
        // No user, reset to default state
        setUserDataState(defaultUserData);
        setIsDataLoading(false);
      }
    }
    loadData();
  }, [currentUser]);

  // Centralized function to update state and persist to Firestore
  const handleSetUserData = useCallback(
    (data: UserDataType) => {
      setUserDataState(data);
      if (currentUser) {
        setUserData(currentUser.uid, data).catch((e) =>
          console.error('Failed to save user data:', e)
        );
      }
    },
    [currentUser]
  );

  // Helper function to install an app
  const installApp = (appName: string) => {
    if (userData.installedApps.includes(appName)) return;
    const newInstalledApps = [...userData.installedApps, appName];
    handleSetUserData({ ...userData, installedApps: newInstalledApps });
  };
  
  // Helper function to uninstall an app
  const uninstallApp = (appName: string) => {
    const newInstalledApps = userData.installedApps.filter(name => name !== appName);
    handleSetUserData({ ...userData, installedApps: newInstalledApps });
  };

  // Helper to update notepad
  const updateNotepad = (content: string) => {
      handleSetUserData({ ...userData, notepadContent: content });
  };

  // Helper to update chat history
  const updateVRChatHistory = (history: Message[]) => {
    handleSetUserData({ ...userData, vrChatHistory: history });
  };
  
  // Helper to update username
  const updateUsername = (name: string) => {
    handleSetUserData({ ...userData, username: name });
  }

  // Helper to update settings
  const updateSettings = (newSettings: Partial<UserDataType['settings']>) => {
    handleSetUserData({
        ...userData,
        settings: { ...userData.settings, ...newSettings },
    });
  }

  return (
    <DataContext.Provider
      value={{
        userData,
        setUserData: handleSetUserData,
        isDataLoading,
        installApp,
        uninstallApp,
        updateNotepad,
        updateVRChatHistory,
        updateUsername,
        updateSettings,
      }}
    >
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
}
