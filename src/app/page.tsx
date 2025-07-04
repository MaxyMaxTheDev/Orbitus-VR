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
    <div className="relative min-h-screen w-full bg-background overflow-hidden font-body text-foreground">
      <HexGrid />
      <ScanLine />
      <HandCursors />

      <header className="fixed top-0 left-0 right-0 p-2 px-4 z-20 flex justify-between items-center bg-background/50 backdrop-blur-sm border-b border-border">
        <div className="flex items-center gap-3">
          <NexusVRLogo className="h-7 w-7 text-primary" />
          <h1 className="text-xl font-bold font-headline tracking-wider">
            NexusVR
          </h1>
        </div>
        <div className="flex items-center gap-4">
          <VirtualClock />
          <SettingsPanel>
            <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-accent hover:bg-black/20 rounded-full">
              <Settings className="h-5 w-5" />
            </Button>
          </SettingsPanel>
        </div>
      </header>

      <main className="relative z-10 pt-16">
        <AppLauncher />
      </main>
    </div>
  );
}
