'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowRight, KeyRound, ShieldCheck, Loader2 } from 'lucide-react';
import { setPasscode } from '@/lib/passcode';

type PasscodeSetupProps = {
  accountKey: string;
  displayName: string;
  onComplete: () => void;
  onSkip: () => void;
};

const MIN_LENGTH = 4;

export function PasscodeSetup({ accountKey, displayName, onComplete, onSkip }: PasscodeSetupProps) {
  const [passcode, setPasscodeValue] = useState('');
  const [confirmation, setConfirmation] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (passcode.length < MIN_LENGTH) {
      setError(`Use at least ${MIN_LENGTH} characters.`);
      return;
    }
    if (passcode !== confirmation) {
      setError('Those passcodes do not match.');
      return;
    }

    setIsSaving(true);
    try {
      await setPasscode(passcode, accountKey);
      onComplete();
    } catch {
      setError('Could not save the passcode on this device.');
      setIsSaving(false);
    }
  };

  return (
    <div className="absolute inset-0 z-50 bg-background flex items-center justify-center p-4 sm:p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-sm bg-card/40 backdrop-blur-2xl border border-border shadow-2xl rounded-3xl p-8 sm:p-10 flex flex-col space-y-8"
      >
        <div className="text-center space-y-4">
          <div className="w-20 h-20 rounded-full bg-accent/10 border-2 border-accent/20 flex items-center justify-center mx-auto">
            <KeyRound className="w-10 h-10 text-accent" />
          </div>
          <div className="space-y-1">
            <h1 className="text-2xl font-bold font-headline tracking-wider uppercase">
              Set a Passcode
            </h1>
            <p className="text-sm text-muted-foreground">
              Welcome, {displayName}. Your passcode unlocks OrbitusVR on this device.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <Label
              htmlFor="passcode-new"
              className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold"
            >
              Passcode
            </Label>
            <Input
              id="passcode-new"
              type="password"
              value={passcode}
              onChange={(e) => setPasscodeValue(e.target.value)}
              placeholder="At least 4 characters"
              autoFocus
              className="bg-black/20 border-primary/20 focus:ring-accent h-12 rounded-xl"
            />
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="passcode-confirm"
              className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold"
            >
              Confirm Passcode
            </Label>
            <Input
              id="passcode-confirm"
              type="password"
              value={confirmation}
              onChange={(e) => setConfirmation(e.target.value)}
              placeholder="Enter it again"
              className="bg-black/20 border-primary/20 focus:ring-accent h-12 rounded-xl"
            />
          </div>

          {error && (
            <p className="text-xs text-destructive font-semibold bg-destructive/10 p-3 rounded-lg border border-destructive/20">
              {error}
            </p>
          )}

          <Button
            size="lg"
            type="submit"
            disabled={isSaving}
            className="w-full bg-accent hover:bg-accent/80 text-accent-foreground font-bold tracking-widest h-12 rounded-xl shadow-lg"
          >
            {isSaving ? <Loader2 className="animate-spin" /> : <ShieldCheck className="mr-2 w-5 h-5" />}
            SAVE PASSCODE
          </Button>
        </form>

        <p className="text-[11px] text-muted-foreground text-center leading-relaxed">
          <span className="text-muted-foreground">
            The passcode is stored only on this device and never leaves your browser. Clearing
            site data removes it, and you can still get back in through Google.
          </span>
        </p>

        <Button
          variant="ghost"
          size="sm"
          onClick={onSkip}
          className="text-xs text-muted-foreground"
        >
          Skip for now
        </Button>
      </motion.div>
    </div>
  );
}
