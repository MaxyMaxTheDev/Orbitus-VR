import { AppLauncher } from '@/components/app-launcher';
import { VirtualClock } from '@/components/virtual-clock';
import { HandCursors } from '@/components/hand-cursors';
import { SettingsPanel } from '@/components/settings-panel';
import { NexusVRLogo } from '@/components/icons/logo';
import { Button } from '@/components/ui/button';
import { Settings } from 'lucide-react';

export default function Home() {
  return (
    <div className="relative min-h-screen w-full bg-background overflow-hidden">
      {/* Background futuristic grid */}
      <div className="absolute inset-0 w-full h-full bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:36px_36px]"></div>
      <div className="absolute inset-0 w-full h-full bg-[radial-gradient(circle_500px_at_50%_200px,#7E57C233,transparent)]"></div>

      <HandCursors />

      <header className="fixed top-0 left-0 right-0 p-4 z-20 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <NexusVRLogo className="h-8 w-8 text-primary" />
          <h1 className="text-2xl font-bold font-headline tracking-wider text-white">NexusVR</h1>
        </div>
        <SettingsPanel>
            <Button variant="ghost" size="icon" className="text-gray-400 hover:text-accent hover:bg-white/10 rounded-full">
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
