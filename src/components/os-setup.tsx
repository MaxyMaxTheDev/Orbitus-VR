"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSettings } from '@/contexts/settings-context';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { ArrowRight, Check, LogIn, User, Loader2 } from 'lucide-react';
import { NexusVRLogo } from './icons/logo';
import { login } from '@/ai/flows/login-flow';

type SetupProps = {
  onComplete: () => void;
};

export function OsSetup({ onComplete }: SetupProps) {
  const [step, setStep] = useState(0);
  const [accountStep, setAccountStep] = useState<'choice' | 'login' | 'register'>('choice');
  const { username, setUsername, showAppBanners, setShowAppBanners } = useSettings();
  const [password, setPassword] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);

  const handleNext = () => setStep(s => s + 1);

  const handleFinish = () => {
    if (username.trim() === '') {
        setUsername('User');
    }
    onComplete();
  };

  const handleSignIn = async () => {
    if (username.trim() === '' || password.trim() === '') return;
    setIsLoggingIn(true);
    setLoginError(null);
    try {
      const result = await login({ username, password });
      if (result.success) {
        // Login successful, move to preferences
        setStep(3);
      } else {
        setLoginError(result.message);
      }
    } catch (error) {
      console.error("Login flow error:", error);
      setLoginError("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoggingIn(false);
    }
  };

  const variants = {
    enter: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
    initial: { opacity: 0, y: 20 },
  };

  const renderAccountStep = () => {
    switch (accountStep) {
        case 'choice':
            return (
                <motion.div key="choice" initial="initial" animate="enter" exit="exit" variants={variants} transition={{ duration: 0.5, ease: "easeInOut" }} className="text-center w-full max-w-sm space-y-6">
                    <h1 className="text-3xl font-bold font-headline">Setup Your Profile</h1>
                    <p className="text-muted-foreground">Choose how you want to save your NexusVR data.</p>
                    <div className="flex flex-col gap-4">
                        <Button size="lg" variant="outline" className="h-20 flex flex-col items-start text-left" onClick={handleNext}>
                            <div className="flex items-center gap-3">
                                <User className="w-6 h-6 text-accent" />
                                <span className="text-lg font-bold">Create a Local Profile</span>
                            </div>
                            <p className="font-normal text-muted-foreground text-sm whitespace-normal">Your data will be saved only on this device. Simple and private.</p>
                        </Button>
                        <Button size="lg" variant="outline" className="h-20 flex flex-col items-start text-left" onClick={() => setAccountStep('login')}>
                             <div className="flex items-center gap-3">
                                <LogIn className="w-6 h-6 text-accent" />
                                <span className="text-lg font-bold">NexusVR Account</span>
                            </div>
                            <p className="font-normal text-muted-foreground text-sm whitespace-normal">Sign in to sync your data across devices.</p>
                        </Button>
                    </div>
                </motion.div>
            );
        case 'login':
            return (
                <motion.div key="login" initial="initial" animate="enter" exit="exit" variants={variants} transition={{ duration: 0.5, ease: "easeInOut" }} className="text-center w-full max-w-sm space-y-6">
                    <h1 className="text-3xl font-bold font-headline">Sign In</h1>
                    <div className="space-y-4 text-left">
                        <div>
                            <Label htmlFor="username-login">Username</Label>
                            <Input id="username-login" type="text" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Enter your username" />
                        </div>
                        <div>
                            <Label htmlFor="password-login">Password</Label>
                            <Input id="password-login" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter your password" 
                             onKeyDown={(e) => {
                                if (e.key === 'Enter' && username.trim() !== '' && password.trim() !== '') handleSignIn();
                            }}
                            />
                        </div>
                    </div>
                    <Button size="lg" className="w-full" onClick={handleSignIn} disabled={username.trim() === '' || password.trim() === '' || isLoggingIn}>
                        {isLoggingIn ? <Loader2 className="animate-spin" /> : 'Sign In'}
                    </Button>
                    {loginError && <p className="text-sm text-destructive">{loginError}</p>}
                    <p className="text-sm text-muted-foreground">
                        Don't have an account?{' '}
                        <Button variant="link" className="p-0" onClick={() => setAccountStep('register')}>Create one</Button>
                    </p>
                </motion.div>
            );
        case 'register':
            return (
                <motion.div key="register" initial="initial" animate="enter" exit="exit" variants={variants} transition={{ duration: 0.5, ease: "easeInOut" }} className="text-center w-full max-w-sm space-y-6">
                    <h1 className="text-3xl font-bold font-headline">Create Account</h1>
                     <div className="space-y-4 text-left">
                        <div>
                            <Label htmlFor="username-reg">Username</Label>
                            <Input id="username-reg" type="text" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Choose a username" 
                             onKeyDown={(e) => {
                                if (e.key === 'Enter' && username.trim() !== '' && password.trim() !== '') setStep(3);
                            }}
                            />
                        </div>
                        <div>
                            <Label htmlFor="password-reg">Password</Label>
                            <Input id="password-reg" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Create a password" 
                             onKeyDown={(e) => {
                                if (e.key === 'Enter' && username.trim() !== '' && password.trim() !== '') setStep(3);
                            }}
                            />
                        </div>
                     </div>
                    <Button size="lg" className="w-full" onClick={() => setStep(3)} disabled={username.trim() === '' || password.trim() === ''}>
                        Create Account
                    </Button>
                    <p className="text-sm text-muted-foreground">
                        Already have an account?{' '}
                        <Button variant="link" className="p-0" onClick={() => setAccountStep('login')}>Sign In</Button>
                    </p>
                </motion.div>
            );
    }
  }

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
      case 1: // Account choice / Login / Register
        return renderAccountStep();
      case 2: // Username for Local Profile
        return (
          <motion.div key={2} initial="initial" animate="enter" exit="exit" variants={variants} transition={{ duration: 0.5, ease: "easeInOut" }} className="text-center w-full max-w-sm space-y-6">
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
      case 3: // Preferences
        return (
          <motion.div key={3} initial="initial" animate="enter" exit="exit" variants={variants} transition={{ duration: 0.5, ease: "easeInOut" }} className="text-center w-full max-w-sm space-y-8">
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
      case 4: // Finish
        return (
          <motion.div key={4} initial="initial" animate="enter" exit="exit" variants={variants} transition={{ duration: 0.5, ease: "easeInOut" }} className="text-center space-y-6">
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
