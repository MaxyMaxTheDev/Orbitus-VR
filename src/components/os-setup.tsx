
"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSettings } from '@/contexts/settings-context';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { ArrowRight, Check, User, Loader2, Maximize, AppWindow, Download, Eye, EyeOff } from 'lucide-react';
import { XenovaVRLogo } from './icons/logo';
import { Slider } from './ui/slider';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { useAuth } from '@/firebase';
import { downloadProjectZip } from '@/lib/export-action';
import { useToast } from '@/hooks/use-toast';

type SetupProps = {
  onComplete: () => void;
  onSwitchToLogin: () => void;
};

export function OsSetup({ onComplete, onSwitchToLogin }: SetupProps) {
  const [step, setStep] = useState(0);
  const { username, setUsername, showAppBanners, setShowAppBanners, uiScale, setUiScale } = useSettings();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  const [isSigningUp, setIsSigningUp] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [signupError, setSignupError] = useState<string | null>(null);
  const auth = useAuth();
  const { toast } = useToast();

  const handleNext = () => setStep(s => s + 1);

  const handleFinish = () => {
    onComplete();
  };

  const handleDownloadBackup = async () => {
    setIsDownloading(true);
    try {
      const base64 = await downloadProjectZip();
      const link = document.createElement('a');
      link.href = `data:application/zip;base64,${base64}`;
      link.download = 'XenovaVR_Source_Backup.zip';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast({
        title: "Backup Started",
        description: "Your project files are being downloaded as a .zip file.",
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

  const handleSignUp = async () => {
    if (username.trim() === '' || password.trim() === '' || email.trim() === '') return;
    setIsSigningUp(true);
    setSignupError(null);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(userCredential.user, { displayName: username });
      
      // On successful signup, update settings context
      setUsername(username);
      
      handleNext();
    } catch (error: any) {
      let message = "An unknown error occurred. Please try again.";
       if (error.code) {
        switch (error.code) {
          case 'auth/email-already-in-use':
            message = 'This email address is already in use by another account.';
            break;
          case 'auth/invalid-email':
            message = 'The email address you entered is not valid.';
            break;
          case 'auth/weak-password':
            message = 'The password is too weak. Please use at least 6 characters.';
            break;
          case 'auth/operation-not-allowed':
            message = 'Email/Password sign-up is not enabled. Please enable it in your Firebase project console.';
            break;
          default:
            message = `An unexpected error occurred: ${error.code}. Please check your Firebase configuration.`;
            break;
        }
      } else if (error.message) {
        message = error.message;
      }
      setSignupError(message);
    } finally {
      setIsSigningUp(false);
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
            <XenovaVRLogo className="w-24 h-24 mx-auto text-primary" />
            <h1 className="text-4xl font-bold font-headline tracking-wider">Welcome to XenovaVR</h1>
            <p className="text-muted-foreground text-lg">Your new virtual reality desktop. Let's get you set up.</p>
            
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
                Download Project (.zip)
                </Button>
            </div>
            <p className="text-[10px] text-muted-foreground italic">Quickly backup your entire workspace before continuing.</p>
          </motion.div>
        );
      case 1: // Account creation
        return (
            <motion.div key="register" initial="initial" animate="enter" exit="exit" variants={variants} transition={{ duration: 0.5, ease: "easeInOut" }} className="text-center w-full max-w-sm space-y-6">
                <div className="flex items-center gap-3 justify-center">
                    <User className="w-8 h-8 text-accent" />
                    <h1 className="text-3xl font-bold font-headline">Create Your Account</h1>
                </div>
                 <div className="space-y-4 text-left">
                    <div>
                        <Label htmlFor="username-reg">Username</Label>
                        <Input id="username-reg" type="text" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Choose a public username" />
                    </div>
                    <div>
                        <Label htmlFor="email-reg">Email</Label>
                        <Input id="email-reg" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Enter your email" />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="password-reg">Password</Label>
                        <div className="relative">
                          <Input 
                            id="password-reg" 
                            type={showPassword ? 'text' : 'password'} 
                            value={password} 
                            onChange={(e) => setPassword(e.target.value)} 
                            placeholder="Create a secure password (min. 6 characters)" 
                            className="pr-10"
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent text-muted-foreground"
                            onClick={() => setShowPassword((prev) => !prev)}
                          >
                            {showPassword ? (
                              <EyeOff className="h-4 w-4" aria-hidden="true" />
                            ) : (
                              <Eye className="h-4 w-4" aria-hidden="true" />
                            )}
                            <span className="sr-only">
                              {showPassword ? 'Hide password' : 'Show password'}
                            </span>
                          </Button>
                        </div>
                    </div>
                 </div>
                <Button size="lg" className="w-full" onClick={handleSignUp} disabled={username.trim() === '' || password.trim() === '' || email.trim() === '' || isSigningUp}>
                    {isSigningUp ? <Loader2 className="animate-spin" /> : 'Create Account & Continue'}
                </Button>
                {signupError && <p className="text-sm text-destructive">{signupError}</p>}
                <p className="text-sm text-muted-foreground">
                    Already have an account? <Button variant="link" className="p-0" onClick={onSwitchToLogin}>Sign in</Button>
                </p>
            </motion.div>
        );
      case 2: // Preferences
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
      case 3: // UI Scale
        return (
            <motion.div key={4} initial="initial" animate="enter" exit="exit" variants={variants} transition={{ duration: 0.5, ease: "easeInOut" }} className="w-full max-w-md space-y-8">
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
      case 4: // Finish
        return (
          <motion.div key={5} initial="initial" animate="enter" exit="exit" variants={variants} transition={{ duration: 0.5, ease: "easeInOut" }} className="text-center space-y-6">
            <div className="w-24 h-24 rounded-full bg-green-500/20 flex items-center justify-center mx-auto">
                <Check className="w-12 h-12 text-green-400" />
            </div>
            <h1 className="text-4xl font-bold font-headline">Setup Complete!</h1>
            <p className="text-muted-foreground text-lg">Welcome, <span className="text-accent font-bold">{username}</span>. Your virtual desktop is ready.</p>
            <Button size="lg" onClick={handleFinish} className="bg-green-600 hover:bg-green-700">
              Enter XenovaVR
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
