
'use client';

import { createContext, useContext, type ReactNode } from 'react';

type DesktopActionsContextType = {
  openApp: (appName: string) => void;
};

const DesktopActionsContext = createContext<DesktopActionsContextType | undefined>(undefined);

export function DesktopActionsProvider({ children, openApp }: { children: ReactNode; openApp: (appName: string) => void; }) {
  return (
    <DesktopActionsContext.Provider value={{ openApp }}>
      {children}
    </DesktopActionsContext.Provider>
  );
}

export function useDesktopActions() {
  const context = useContext(DesktopActionsContext);
  if (context === undefined) {
    throw new Error('useDesktopActions must be used within a DesktopActionsProvider');
  }
  return context;
}
