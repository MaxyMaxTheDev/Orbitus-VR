"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSettings } from '@/contexts/settings-context';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { ArrowRight, Check, User, Loader2, Maximize, AppWindow, Download, Eye, EyeOff, UserCircle, KeyRound, CheckCircle2, Info, MailCheck } from 'lucide-react';
import { OrbitusVRLogo } from './icons/logo';
import { Slider } from './ui/slider';
import { createUserWithEmailAndPassword, updateProfile, signInWithEmailAndPassword } from 'firebase/auth';
import { useAuth } from '@/firebase';
import { downloadProjectZip } from '@/lib/export-action';
import { useToast } from '@/hooks/use-toast';
import { sendRecoveryCode } from '@/lib/recovery-actions';
import { get, set, del } from '@/lib/idb';

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
  const [isVerifying, setIsVerifying] = useState(false);
  const [signupError, setSignupError] = useState<string | null>(null);
  const [verificationCode, setVerificationCode] = useState('');
  
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

  const handleInitiateSignUp = async () => {
    if (username.trim() === '' || password.trim() === '' || email.trim() === '') return;
    
    setIsSigningUp(true);
    setSignupError(null);

    try {
        const result = await sendRecoveryCode(email);
        if (result.success && result.code) {
            const expiration = Date.now() + 10 * 60 * 1000; 
            await set('signup-verification-token', {
                code: result.code,
                email: email,
                expiresAt: expiration
            });

            setStep(1.5); // Move to verification step
            toast({
                title: "Identity Verification Required",
                description: `A 6-digit code has been sent to ${email}.`,
            });
        } else {
            setSignupError(result.error || "Failed to initiate verification.");
        }
    } catch (err: any) {
        setSignupError("Network error occurred. Please try again.");
    } finally {
        setIsSigningUp(false);
    }
  };

  const handleVerifyAndCreate = async (e?: React.FormEvent) => {
      if (e) e.preventDefault();
      if (!verificationCode.trim()) return;

      setIsVerifying(true);
      setSignupError(null);

      try {
          const stored = await get<{code: string, email: string, expiresAt: number}>('signup-verification-token');
          const now = Date.now();

          if (!stored || stored.expiresAt < now) {
              setSignupError("Verification session expired. Please try again.");
              await del('signup-verification-token');
              setStep(1);
              return;
          }

          if (stored.code !== verificationCode) {
              setSignupError("Invalid verification token.");
              return;
          }

          // Verification success -> Create account
          const userCredential = await createUserWithEmailAndPassword(auth, email, password);
          await updateProfile(userCredential.user, { displayName: username });
          
          await del('signup-verification-token');
          setUsername(username);
          handleNext(); // Move to next step (step 2)

      } catch (error: any) {
          let message = "An unknown error occurred during account creation.";
          if (error.code === 'auth/email-already-in-use') {
              message = 'This email address is already in use. Now dont get angry.';
          }
          setSignupError(message);
      } finally {
          setIsVerifying(false);
      }
  };

  const handleGuestSignUp = async () => {
    setIsSigningUp(true);
    setSignupError(null);
    const guestEmail = 'guest@orbitus.local';
    const guestPassword = 'orbitus_guest';

    try {
      await signInWithEmailAndPassword(auth, guestEmail, guestPassword);
      setUsername('Guest');
      setStep(2); // Jump straight to preferences
    } catch (error: any) {
      if (error.code === 'auth/user-not-found' || error.code === 'auth/invalid-credential') {
        try {
          const userCredential = await createUserWithEmailAndPassword(auth, guestEmail, guestPassword);
          await updateProfile(userCredential.user, { displayName: 'Guest' });
          setUsername('Guest');
          setStep(2);
          return;
        } catch (createError: any) {
          console.error("Guest auto-provisioning failed:", createError);
        }
      }
      setSignupError("Guest mode is currently unavailable lol. Please create a permanent identity.");
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
                        <Input 
                          id="username-reg" 
                          value={username} 
                          onChange={(e) => setUsername(e.target.value)} 
                          placeholder="Choose a public username" 
                          className="bg-black/20 border-primary/20 focus:ring-accent"
                        />
                    </div>
                    <div>
                        <Label htmlFor="email-reg">Email</Label>
                        <Input 
                          id="email-reg" 
                          type="email" 
                          value={email} 
                          onChange={(e) => setEmail(e.target.value)} 
                          placeholder="Enter your email" 
                          className="bg-black/20 border-primary/20 focus:ring-accent"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="password-reg">Password</Label>
                        <div className="relative">
                          <Input 
                            id="password-reg" 
                            type={showPassword ? 'text' : 'password'} 
                            value={password} 
                            onChange={(e) => setPassword(e.target.value)} 
                            placeholder="Create a secure password" 
                            className="bg-black/20 border-primary/20 focus:ring-accent pr-10"
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent text-muted-foreground"
                            onClick={() => setShowPassword((prev) => !prev)}
                          >
                            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </Button>
                        </div>
                    </div>
                 </div>
                
                <div className="space-y-3">
                    <Button size="lg" className="w-full" onClick={handleInitiateSignUp} disabled={!username || !email || !password || isSigningUp}>
                        {isSigningUp ? <Loader2 className="animate-spin" /> : 'Create Account & Continue'}
                    </Button>
                    
                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <span className="w-full border-t border-border" />
                        </div>
                        <div className="relative flex justify-center text-[10px] uppercase">
                            <span className="bg-background px-2 text-muted-foreground">Or</span>
                        </div>
                    </div>

                    <Button variant="outline" size="lg" className="w-full border-primary/30 hover:bg-primary/10" onClick={handleGuestSignUp} disabled={isSigningUp}>
                        <UserCircle className="mr-2 w-5 h-5" /> click to 'use as guest'
                    </Button>
                </div>

                {signupError && <p className="text-sm text-destructive">{signupError}</p>}
                
                <p className="text-sm text-muted-foreground">
                    Already have an account? <Button variant="link" className="p-0" onClick={onSwitchToLogin}>Sign in</Button>
                </p>
            </motion.div>
        );
      case 1.5: // New Verification Step
        return (
            <motion.div key="verify-email" initial="initial" animate="enter" exit="exit" variants={variants} transition={{ duration: 0.5, ease: "easeInOut" }} className="text-center w-full max-w-sm space-y-8">
                <div className="text-center space-y-2">
                    <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-primary/20">
                        <KeyRound className="w-10 h-10 text-primary" />
                    </div>
                    <h1 className="text-2xl font-bold font-headline tracking-wider uppercase">Verify Identity</h1>
                    <p className="text-sm text-muted-foreground">Enter the 6-digit code sent to <span className="text-accent font-mono">{email}</span></p>
                </div>

                <form onSubmit={handleVerifyAndCreate} className="space-y-6">
                    <div className="space-y-2 text-left">
                        <Label className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold">Verification Token</Label>
                        <Input
                            value={verificationCode}
                            onChange={(e) => setVerificationCode(e.target.value.replace(/[^0-9]/g, '').slice(0, 6))}
                            placeholder="000000"
                            autoFocus
                            className="bg-black/20 border-primary/20 focus:ring-accent h-14 rounded-xl text-center text-3xl font-mono tracking-[0.5em]"
                        />
                    </div>

                    <div className="bg-primary/10 border border-primary/20 rounded-lg p-3 flex items-start gap-3 text-left">
                        <Info className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                        <p className="text-[11px] text-muted-foreground leading-relaxed">
                            Don't see any emails from OrbitusVR in your inbox? Check your <strong>Spam</strong> or <strong>Junk Email</strong> folders. remember after 10 minutes the code will expire and go bye bye!
                        </p>
                    </div>

                    {signupError && <p className="text-xs text-destructive text-left font-semibold">{signupError}</p>}

                    <div className="space-y-3">
                        <Button size="lg" className="w-full bg-primary hover:bg-primary/80 text-primary-foreground font-bold tracking-widest h-12 rounded-xl shadow-lg" disabled={isVerifying || verificationCode.length < 6}>
                            {isVerifying ? <Loader2 className="animate-spin" /> : <><CheckCircle2 className="mr-2 w-5 h-5" /> VERIFY & FINISH</>}
                        </Button>
                        <div className="flex justify-between items-center px-1">
                            <Button variant="link" type="button" className="text-[10px] text-muted-foreground p-0 h-auto" onClick={handleInitiateSignUp}>Resend Code</Button>
                            <Button variant="link" type="button" className="text-[10px] text-muted-foreground p-0 h-auto" onClick={() => setStep(1)}>Change Details</Button>
                        </div>
                    </div>
                </form>
            </motion.div>
        );
      case 2: // Preferences
        return (
          <motion.div key={3} initial="initial" animate="enter" exit="exit" variants={variants} transition={{ duration: 0.5, ease: "easeInOut" }} className="text-center w-full max-w-sm space-y-8">
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
      case 3: // UI Scale
        return (
            <motion.div key={4} initial="initial" animate="enter" exit="exit" variants={variants} transition={{ duration: 0.5, ease: "easeInOut" }} className="w-full max-md space-y-8">
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
            <Button size="lg" onClick={handleFinish} className="bg-green-600 hover:bg-green-700 w-full">
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
