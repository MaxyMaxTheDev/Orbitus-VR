import { AppLauncher } from '@/components/app-launcher';
import { VirtualClock } from '@/components/virtual-clock';
import { HandCursors } from '@/components/hand-cursors';
import { SettingsPanel } from '@/components/settings-panel';
import { NexusVRLogo } from '@/components/icons/logo';
import { Button } from '@/components/ui/button';
import { Settings } from 'lucide-react';
import { ScanLine } from '@/components/scan-line';
import { HexGrid } from '@/components/hex-grid';

export default function Home() {
  return (
    <div className="relative min-h-screen w-full bg-background overflow-hidden font-body">
      <HexGrid />
      <ScanLine />

      <HandCursors />

      <header className="fixed top-0 left-0 right-0 p-4 z-20 flex justify-between items-center">
        <div className="flex items-center gap-3 group cursor-pointer">
          <NexusVRLogo className="h-9 w-9 text-primary transition-all duration-500 ease-in-out group-hover:text-accent group-hover:animate-pulse" />
          <h1 className="text-3xl font-bold font-headline tracking-widest text-foreground transition-all duration-500 ease-in-out group-hover:text-accent">
            NexusVR
          </h1>
        </div>
        <SettingsPanel>
            <Button variant="ghost" size="icon" className="text-gray-400 hover:text-accent hover:bg-white/10 rounded-full transition-all duration-300 hover:scale-110 hover:animate-pulse">
                <Settings className="h-6 w-6" />
            </Button>
        </SettingsPanel>
      </header>

      <main className="relative z-10 flex items-center justify-center min-h-screen p-4">
        <AppLauncher />
      </main>

      <VirtualClock />
    </div>
  );
}
