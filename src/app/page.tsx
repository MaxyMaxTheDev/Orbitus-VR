import { HandCursors } from '@/components/hand-cursors';
import { Desktop } from '@/components/desktop';

export default function Home() {
  return (
    <div className="relative min-h-screen w-full bg-background overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 w-full h-full bg-gradient-to-br from-background via-card to-background" />
      
      <HandCursors />

      <main className="relative z-10 h-screen w-screen flex flex-col">
        <Desktop />
      </main>
    </div>
  );
}
