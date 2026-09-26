"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSettings } from '@/contexts/settings-context';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { ArrowRight, Check, Loader2, Maximize, AppWindow, Download } from 'lucide-react';
import { OrbitusVRLogo } from './icons/logo';
import { Slider } from './ui/slider';
import { downloadProjectZip } from '@/lib/export-action';
import { useToast } from '@/hooks/use-toast';

type SetupProps = {
  onComplete: () => void;
  displayName: string;
};

// Identity is handled by Google before this wizard is reached, so everything
// here is local preference setup with no network calls and no account state.
export function OsSetup({ onComplete, displayName }: SetupProps) {
  const [step, setStep] = useState(0);
  const { showAppBanners, setShowAppBanners, uiScale, setUiScale } = useSettings();
  const [isDownloading, setIsDownloading] = useState(false);

  const { toast } = useToast();

  const handleNext = () => setStep(s => s + 1);

  const handleDownloadBackup = async () => {
    setIsDownloading(true);
    try {
      const base64 = await downloadProjectZip();
      const link = document.createElement('a');
      link.href = `data:application/zip;base64,${base64}`;
      link.download = 'OrbitusVR_Source_Backup.zip';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast({
        title: "Backup Started",
        description: "Your project files are NOT being downloaded as a .zip file.",
      });
    } catch (error) {
      console.error(error);
      toast({
        variant: "destructive",
        title: "Backup Failed",
        description: "Could not generate the project backup.",
      });
    } finally {
      setIsDownloading(false);
    }
  };

  const variants = {
    enter: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
    initial: { opacity: 0, y: 20 },
  };

  const renderStep = () => {
    switch (step) {
      case 0: // Welcome
        return (
          <motion.div key={0} initial="initial" animate="enter" exit="exit" variants={variants} transition={{ duration: 0.5, ease: "easeInOut" }} className="text-center space-y-6">
            <OrbitusVRLogo className="w-24 h-24 mx-auto text-primary" />
            <h1 className="text-4xl font-bold font-headline tracking-wider">Welcome to OrbitusVR</h1>
            <p className="text-muted-foreground text-lg">made by MaxyMax</p>
            
            <div className="flex flex-col gap-3 max-w-xs mx-auto mt-4">
                <Button size="lg" onClick={handleNext} className="w-full">
                Begin Setup <ArrowRight className="ml-2" />
                </Button>
                <Button 
                    variant="outline" 
                    size="lg" 
                    onClick={handleDownloadBackup} 
                    disabled={isDownloading} 
                    className="w-full border-primary/50 text-primary hover:bg-primary/10"
                >
                {isDownloading ? <Loader2 className="animate-spin mr-2" /> : <Download className="mr-2" />}
                download source code
                </Button>
            </div>
            <p className="text-[10px] text-muted-foreground italic">ok fine download the source code matter of fact its open source on github.com/MaxyMaxTheDev/Orbitus-VR</p>
          </motion.div>
        );
      case 1: // Preferences
        return (
          <motion.div key={1} initial="initial" animate="enter" exit="exit" variants={variants} transition={{ duration: 0.5, ease: "easeInOut" }} className="text-center w-full max-w-sm space-y-8">
            <h1 className="text-3xl font-bold font-headline">Personalize Your Experience</h1>
            <p className="text-muted-foreground">Choose how you want your app library to look.</p>
            <div className="flex items-center justify-between p-4 rounded-lg bg-black/20 border border-border">
              <Label htmlFor="show-banners" className="text-lg font-medium text-left">
                AI Slop-Generated App Banners
              </Label>
              <Switch
                id="show-banners"
                checked={showAppBanners}
                onCheckedChange={setShowAppBanners}
                className="data-[state=checked]:bg-accent"
              />
            </div>
            <p className="text-xs text-muted-foreground">You can change this and other settings later in the Settings app.</p>
            <Button size="lg" onClick={handleNext} className="w-full">
              Next <ArrowRight className="ml-2" />
            </Button>
          </motion.div>
        );
      case 2: // UI Scale
        return (
            <motion.div key={2} initial="initial" animate="enter" exit="exit" variants={variants} transition={{ duration: 0.5, ease: "easeInOut" }} className="w-full max-md space-y-8">
              <div className="text-center">
                <h1 className="text-3xl font-bold font-headline">UI Scale Calibration</h1>
                <p className="text-sm text-muted-foreground">Adjust the slider for comfortable readability.</p>
              </div>

              <div className="relative h-64 border-2 border-dashed border-border rounded-xl flex items-center justify-center p-4">
                  <motion.div
                    className="w-full h-full"
                    style={{ transform: `scale(var(--ui-scale))` }}
                    initial={false}
                    animate={{'--ui-scale': uiScale / 100} as any}
                    transition={{ duration: 0.2, ease: "easeOut" }}
                  >
                    <div className="w-full h-full flex flex-col bg-card/80 backdrop-blur-sm border border-border rounded-lg shadow-lg">
                        <header className="flex items-center gap-2 p-2 border-b border-border bg-card/50 rounded-t-lg">
                            <AppWindow className="w-4 h-4 text-accent" />
                            <span className="text-sm font-bold text-foreground">Sample Window</span>
                        </header>
                        <main className="flex-1 p-2">
                           <div className="w-3/4 h-2 rounded-full bg-muted-foreground/30 mb-2"></div>
                           <div className="w-1/2 h-2 rounded-full bg-muted-foreground/30"></div>
                        </main>
                    </div>
                  </motion.div>
              </div>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center text-muted-foreground">
                  <Maximize className="w-5 h-5" />
                  <Slider
                    value={[uiScale]}
                    onValueChange={(value) => setUiScale(value[0])}
                    min={75}
                    max={125}
                    step={5}
                  />
                  <Maximize className="w-8 h-8" />
                </div>
              </div>

              <Button size="lg" onClick={handleNext} className="w-full">
                Continue <ArrowRight className="ml-2" />
              </Button>
            </motion.div>
          );
      case 3: // Finish
        return (
          <motion.div key={3} initial="initial" animate="enter" exit="exit" variants={variants} transition={{ duration: 0.5, ease: "easeInOut" }} className="text-center space-y-6">
            <div className="w-24 h-24 rounded-full bg-green-500/20 flex items-center justify-center mx-auto">
              <Check className="w-12 h-12 text-green-400" />
            </div>
            <h1 className="text-4xl font-bold font-headline">Setup Complete!</h1>
            <p className="text-muted-foreground text-lg">Welcome, <span className="text-accent font-bold">{displayName}</span>. Your virtual desktop is ready.</p>
            <Button size="lg" onClick={onComplete} className="bg-green-600 hover:bg-green-700 w-full">
              Enter OrbitusVR
            </Button>
          </motion.div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="absolute inset-0 z-50 bg-background flex items-center justify-center p-8">
        <AnimatePresence mode="wait">
            {renderStep()}
        </AnimatePresence>
    </div>
  );
}
