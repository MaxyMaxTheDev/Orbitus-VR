
"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSettings } from '@/contexts/settings-context';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { ArrowRight, Check } from 'lucide-react';
import { NexusVRLogo } from './icons/logo';

type SetupProps = {
  onComplete: () => void;
};

export function OsSetup({ onComplete }: SetupProps) {
  const [step, setStep] = useState(0);
  const { username, setUsername, showAppBanners, setShowAppBanners } = useSettings();

  const handleNext = () => setStep(s => s + 1);

  const handleFinish = () => {
    if (username.trim() === '') {
        setUsername('User');
    }
    onComplete();
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
            <NexusVRLogo className="w-24 h-24 mx-auto text-primary" />
            <h1 className="text-4xl font-bold font-headline tracking-wider">Welcome to NexusVR</h1>
            <p className="text-muted-foreground text-lg">Your new virtual reality desktop. Let's get you set up.</p>
            <Button size="lg" onClick={handleNext} className="mt-4">
              Begin Setup <ArrowRight className="ml-2" />
            </Button>
          </motion.div>
        );
      case 1: // Username
        return (
          <motion.div key={1} initial="initial" animate="enter" exit="exit" variants={variants} transition={{ duration: 0.5, ease: "easeInOut" }} className="text-center w-full max-w-sm space-y-6">
            <h1 className="text-3xl font-bold font-headline">What should we call you?</h1>
            <p className="text-muted-foreground">This will be your display name within NexusVR.</p>
            <Input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your username"
              className="h-12 text-center text-lg"
              maxLength={20}
              autoFocus
              onKeyDown={(e) => {
                if (e.key === 'Enter' && username.trim() !== '') handleNext();
              }}
            />
            <Button size="lg" onClick={handleNext} disabled={username.trim() === ''}>
              Continue <ArrowRight className="ml-2" />
            </Button>
          </motion.div>
        );
      case 2: // Preferences
        return (
          <motion.div key={2} initial="initial" animate="enter" exit="exit" variants={variants} transition={{ duration: 0.5, ease: "easeInOut" }} className="text-center w-full max-w-sm space-y-8">
            <h1 className="text-3xl font-bold font-headline">Personalize Your Experience</h1>
            <p className="text-muted-foreground">Choose how you want your app library to look.</p>
            <div className="flex items-center justify-between p-4 rounded-lg bg-black/20 border border-border">
              <Label htmlFor="show-banners" className="text-lg font-medium">
                AI-Generated App Banners
              </Label>
              <Switch
                id="show-banners"
                checked={showAppBanners}
                onCheckedChange={setShowAppBanners}
                className="data-[state=checked]:bg-accent"
              />
            </div>
            <p className="text-xs text-muted-foreground">You can change this and other settings later in the Settings app.</p>
            <Button size="lg" onClick={handleNext}>
              Next <ArrowRight className="ml-2" />
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
            <p className="text-muted-foreground text-lg">Welcome, <span className="text-accent font-bold">{username}</span>. Your virtual desktop is ready.</p>
            <Button size="lg" onClick={handleFinish} className="bg-green-600 hover:bg-green-700">
              Enter NexusVR
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
