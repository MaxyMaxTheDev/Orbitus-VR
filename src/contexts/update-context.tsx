'use client';

import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from 'react';
import { AnimatePresence } from 'framer-motion';
import { Download } from 'lucide-react';

import { useToast } from '@/hooks/use-toast';
import { ToastAction } from '@/components/ui/toast';
import { SystemOverlay } from '@/components/system-overlay';
import { useDesktopActions } from '@/contexts/desktop-actions-context';
import { beginUpdate } from '@/lib/update-state';

const POLL_INTERVAL_MS = 1000;
const RESTART_DELAY_MS = 1500;

/**
 * The build id of the JavaScript this tab is actually executing, baked in by
 * next.config.js at build time. Comparing this against the id the server
 * reports answers the only question that matters -- "is my code stale?" --
 * without trusting anything the browser remembered on a previous visit, so a
 * plain reload can never raise a false alarm.
 */
const RUNNING_BUILD_ID = process.env.NEXT_PUBLIC_BUILD_SHA;

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
    // No build id was stamped in (local dev, or a build made outside Vercel),
    // so there is nothing meaningful to compare and we stay quiet.
    if (!RUNNING_BUILD_ID) return;

    try {
      const response = await fetch('/api/deployment', { cache: 'no-store' });
      if (!response.ok) return;

      const data: { buildId?: string | null } = await response.json();
      const serverBuildId = data.buildId?.trim();
      // No build id (non-Vercel host) means nothing to compare.
      if (!serverBuildId) return;

      if (serverBuildId !== RUNNING_BUILD_ID) {
        setLatestBuildId(serverBuildId);
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
