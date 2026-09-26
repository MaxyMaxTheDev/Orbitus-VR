'use client';

import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from 'react';
import { AnimatePresence } from 'framer-motion';
import { Download } from 'lucide-react';

import { useToast } from '@/hooks/use-toast';
import { ToastAction } from '@/components/ui/toast';
import { SystemOverlay } from '@/components/system-overlay';
import { useDesktopActions } from '@/contexts/desktop-actions-context';
import { beginUpdate, getStoredBuildId, setStoredBuildId } from '@/lib/update-state';

const POLL_INTERVAL_MS = 60 * 1000;
const RESTART_DELAY_MS = 1500;

type UpdateContextType = {
  updateAvailable: boolean;
  latestBuildId: string | null;
  startUpdate: () => void;
};

const UpdateContext = createContext<UpdateContextType | undefined>(undefined);

export function UpdateProvider({ children }: { children: ReactNode }) {
  const [updateAvailable, setUpdateAvailable] = useState(false);
  const [latestBuildId, setLatestBuildId] = useState<string | null>(null);
  const [isRestarting, setIsRestarting] = useState(false);
  const { toast } = useToast();
  const { openApp } = useDesktopActions();
  const notifiedRef = useRef(false);

  const checkForUpdate = useCallback(async () => {
    try {
      const response = await fetch('/api/deployment', { cache: 'no-store' });
      if (!response.ok) return;

      const data: { buildId?: string | null } = await response.json();
      const buildId = data.buildId?.trim();
      // No build id (local dev, or a non-Vercel host) means nothing to compare.
      if (!buildId) return;

      const storedBuildId = getStoredBuildId();
      // First run on this device: adopt the current build silently.
      if (!storedBuildId) {
        setStoredBuildId(buildId);
        return;
      }

      if (buildId !== storedBuildId) {
        setLatestBuildId(buildId);
        setUpdateAvailable(true);
      }
    } catch {
      // Offline or transient failure; the next poll will retry.
    }
  }, []);

  useEffect(() => {
    checkForUpdate();

    const interval = setInterval(checkForUpdate, POLL_INTERVAL_MS);
    const handleVisibility = () => {
      if (document.visibilityState === 'visible') {
        checkForUpdate();
      }
    };

    document.addEventListener('visibilitychange', handleVisibility);
    return () => {
      clearInterval(interval);
      document.removeEventListener('visibilitychange', handleVisibility);
    };
  }, [checkForUpdate]);

  const openSettings = useCallback(() => {
    openApp('Settings');
  }, [openApp]);

  useEffect(() => {
    if (!updateAvailable || notifiedRef.current) return;
    notifiedRef.current = true;

    toast({
      title: 'Update Available',
      description: 'A new version of OrbitusVR has been deployed. Click to open Settings.',
      icon: <Download className="h-5 w-5 text-accent" />,
      className: 'cursor-pointer',
      onClick: openSettings,
      action: (
        <ToastAction
          altText="Open Settings"
          onClick={(event) => {
            event.stopPropagation();
            openSettings();
          }}
        >
          Open Settings
        </ToastAction>
      ),
    });
  }, [updateAvailable, openSettings, toast]);

  const startUpdate = useCallback(() => {
    if (isRestarting) return;
    beginUpdate(latestBuildId);
    setIsRestarting(true);
    setTimeout(() => window.location.reload(), RESTART_DELAY_MS);
  }, [isRestarting, latestBuildId]);

  return (
    <UpdateContext.Provider value={{ updateAvailable, latestBuildId, startUpdate }}>
      <AnimatePresence>{isRestarting && <SystemOverlay action="restart" />}</AnimatePresence>
      {children}
    </UpdateContext.Provider>
  );
}

export function useUpdate() {
  const context = useContext(UpdateContext);
  if (context === undefined) {
    throw new Error('useUpdate must be used within an UpdateProvider');
  }
  return context;
}
