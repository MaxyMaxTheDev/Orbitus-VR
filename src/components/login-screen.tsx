"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSettings } from '@/contexts/settings-context';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
    Loader2, LogIn, User, Eye, EyeOff, UserCircle, 
    UserPlus, ChevronRight, ArrowLeft, MailCheck, 
    ShieldQuestion, KeyRound, CheckCircle2, Info
} from 'lucide-react';
import { Avatar, AvatarFallback } from './ui/avatar';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { useAuth } from '@/firebase';
import { get, set, del } from '@/lib/idb';
import { cn } from '@/lib/utils';
import { ScrollArea } from './ui/scroll-area';
import { useToast } from '@/hooks/use-toast';
import { sendRecoveryCode } from '@/lib/recovery-actions';

type SavedAccount = {
  email: string;
  displayName: string;
};

type LoginScreenProps = {
  onLoginSuccess: () => void;
  onSwitchToSignUp: () => void;
};

type StoredRecovery = {
    code: string;
    email: string;
    expiresAt: number;
};

export function LoginScreen({ onLoginSuccess, onSwitchToSignUp }: LoginScreenProps) {
  const { setUsername: setContextUsername } = useSettings();
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  const [isLoading, setIsLoading] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [savedAccounts, setSavedAccounts] = useState<SavedAccount[]>([]);
  const [selectedAccount, setSelectedAccount] = useState<SavedAccount | null>(null);
  const [isManualEntry, setIsManualEntry] = useState(false);
  const [isForgotMode, setIsForgotMode] = useState(false);
  const [isVerifyCodeMode, setIsVerifyCodeMode] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');
  
  const auth = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    const loadAccounts = async () => {
      const accounts = await get<SavedAccount[]>('saved-accounts');
      if (accounts && accounts.length > 0) {
        setSavedAccounts(accounts);
        setSelectedAccount(accounts[0]);
        setIdentifier(accounts[0].email);
        setIsManualEntry(false);
      } else {
        setIsManualEntry(true);
      }
    };
    loadAccounts();
  }, []);

  const handleSignIn = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (identifier.trim() === '' || password.trim() === '') return;
    
    setIsLoading(true);
    setError(null);

    let emailToUse = identifier;
    if (identifier.toLowerCase() === 'guest') {
      emailToUse = 'guest@orbitus.local';
    }

    try {
      const userCredential = await signInWithEmailAndPassword(auth, emailToUse, password);
      const displayName = userCredential.user.displayName || (identifier.toLowerCase() === 'guest' ? 'Guest' : identifier.split('@')[0]);
      
      setContextUsername(displayName);

      if (identifier.toLowerCase() !== 'guest') {
        const newAccount: SavedAccount = { email: emailToUse, displayName };
        const updatedAccounts = [newAccount, ...savedAccounts.filter(a => a.email !== emailToUse)].slice(0, 5);
        await set('saved-accounts', updatedAccounts);
      }

      onLoginSuccess();
    } catch (err: any) {
      let message = 'An unknown error occurred.';
      if (err.code) {
        switch (err.code) {
          case 'auth/user-not-found':
          case 'auth/wrong-password':
          case 'auth/invalid-credential':
            message = 'Incorrect password.';
            break;
          case 'auth/invalid-email':
            message = 'Please enter a valid email address.';
            break;
          default:
            message = `Login failed: ${err.code}`;
            break;
        }
      } else if (err.message) {
        message = err.message;
      }
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGuestSignIn = async () => {
    const guestEmail = 'guest@orbitus.local';
    const guestPassword = 'orbitus_guest';
    setIdentifier('guest');
    setPassword(guestPassword);
    setIsLoading(true);
    setError(null);

    try {
      await signInWithEmailAndPassword(auth, guestEmail, guestPassword);
      setContextUsername('Guest');
      onLoginSuccess();
    } catch (err: any) {
      if (err.code === 'auth/user-not-found' || err.code === 'auth/invalid-credential') {
        try {
          const userCredential = await createUserWithEmailAndPassword(auth, guestEmail, guestPassword);
          await updateProfile(userCredential.user, { displayName: 'Guest' });
          setContextUsername('Guest');
          onLoginSuccess();
          return;
        } catch (createErr: any) {
          console.error("Guest auto-provisioning failed:", createErr);
        }
      }
      setError("Guest login failed. Try manual entry.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!identifier.trim()) {
        setError("Please enter your email address first.");
        return;
    }

    setIsResetting(true);
    setError(null);

    try {
        const result = await sendRecoveryCode(identifier);
        if (result.success && result.code) {
            const expiration = Date.now() + 10 * 60 * 1000; 
            await set('recovery-temp-token', {
                code: result.code,
                email: identifier,
                expiresAt: expiration
            });

            setIsVerifyCodeMode(true);
            setIsForgotMode(false);
            toast({
                title: "Verification Code Sent",
                description: `A 6-digit code has been sent to ${identifier}.`,
            });
        } else {
            setError(result.error || "Failed to initiate recovery.");
        }
    } catch (err: any) {
        console.error("Recovery Exception:", err);
        setError("Network error occurred. Please try again.");
    } finally {
        setIsResetting(false);
    }
  };

  const handleVerifyCode = async (e: React.FormEvent) => {
      e.preventDefault();
      if (!verificationCode.trim()) return;

      setIsVerifying(true);
      setError(null);

      try {
          const stored = await get<StoredRecovery>('recovery-temp-token');
          const now = Date.now();

          if (!stored) {
              setError("No active recovery request found.");
              return;
          }

          if (stored.expiresAt < now) {
              await del('recovery-temp-token');
              setError("Verification token has expired.");
              return;
          }

          if (stored.code !== verificationCode) {
              setError("Invalid verification token.");
              return;
          }

          await del('recovery-temp-token');
          toast({
              title: "Identity Verified",
              description: "Verification successful. You can now reset your password.",
          });
          setIsVerifyCodeMode(false);
          
      } catch (err: any) {
          setError("Local storage error occurred. Please try again.");
      } finally {
          setIsVerifying(false);
      }
  };

  const selectAccount = (acc: SavedAccount) => {
    setSelectedAccount(acc);
    setIdentifier(acc.email);
    setPassword('');
    setError(null);
    setIsManualEntry(false);
    setIsForgotMode(false);
    setIsVerifyCodeMode(false);
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') handleSignIn();
  };

  const renderForgotMode = () => (
    <motion.div 
        key="forgot-mode"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="w-full max-w-sm space-y-8"
    >
        <div className="text-center">
            <div className="w-20 h-20 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-accent/20">
                <ShieldQuestion className="w-10 h-10 text-accent" />
            </div>
            <h1 className="text-2xl font-bold font-headline tracking-wider uppercase">Recovery</h1>
            <p className="text-sm text-muted-foreground mt-1">Confirm your email to receive a recovery code</p>
        </div>

        <form onSubmit={handleForgotPassword} className="space-y-6">
            <div className="space-y-2">
                <Label className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold">Email Address</Label>
                <Input
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    placeholder="identity@nexus.net"
                    autoFocus
                    className="bg-black/20 border-primary/20 focus:ring-accent h-12 rounded-xl"
                />
            </div>

            {error && (
                <motion.p 
                    initial={{ opacity: 0, x: -10 }} 
                    animate={{ opacity: 1, x: 0 }}
                    className="text-xs text-destructive font-semibold bg-destructive/10 p-3 rounded-lg border border-destructive/20"
                >
                    {error}
                </motion.p>
            )}

            <div className="space-y-3">
                <Button size="lg" className="w-full bg-accent hover:bg-accent/80 text-accent-foreground font-bold tracking-widest h-12 rounded-xl shadow-lg" disabled={isResetting}>
                    {isResetting ? <Loader2 className="animate-spin" /> : <><MailCheck className="mr-2 w-5 h-5" /> SEND RECOVERY CODE</>}
                </Button>
                <Button 
                    variant="ghost" 
                    type="button"
                    className="w-full text-xs text-muted-foreground"
                    onClick={() => setIsForgotMode(false)}
                >
                    Back to Sign In
                </Button>
            </div>
        </form>
    </motion.div>
  );

  const renderVerifyCodeMode = () => (
    <motion.div 
        key="verify-code-mode"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="w-full max-w-sm space-y-8"
    >
        <div className="text-center">
            <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-primary/20">
                <KeyRound className="w-10 h-10 text-primary" />
            </div>
            <h1 className="text-2xl font-bold font-headline tracking-wider uppercase">Identity Verification</h1>
            <p className="text-sm text-muted-foreground mt-1">Enter the 6-digit code sent to your email</p>
        </div>

        <form onSubmit={handleVerifyCode} className="space-y-6">
            <div className="space-y-2">
                <Label className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold">Verification Token</Label>
                <Input
                    value={verificationCode}
                    onChange={(e) => setVerificationCode(e.target.value.replace(/[^0-9]/g, '').slice(0, 6))}
                    placeholder="000000"
                    autoFocus
                    className="bg-black/20 border-primary/20 focus:ring-accent h-14 rounded-xl text-center text-3xl font-mono tracking-[0.5em]"
                />
            </div>

            <div className="bg-primary/10 border border-primary/20 rounded-lg p-3 flex items-start gap-3">
                <Info className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                <p className="text-[11px] text-muted-foreground leading-relaxed">
                    Don't see any emails from OrbitusVR in your inbox? Check your <strong>Spam</strong> or <strong>Junk Email</strong> folders. remember after 10 minutes the code will expire and go bye bye!
                </p>
            </div>

            {error && (
                <motion.p 
                    initial={{ opacity: 0, x: -10 }} 
                    animate={{ opacity: 1, x: 0 }}
                    className="text-xs text-destructive font-semibold bg-destructive/10 p-3 rounded-lg border border-destructive/20"
                >
                    {error}
                </motion.p>
            )}

            <div className="space-y-3">
                <Button size="lg" className="w-full bg-primary hover:bg-primary/80 text-primary-foreground font-bold tracking-widest h-12 rounded-xl shadow-lg" disabled={isVerifying || verificationCode.length < 6}>
                    {isVerifying ? <Loader2 className="animate-spin" /> : <><CheckCircle2 className="mr-2 w-5 h-5" /> VERIFY IDENTITY</>}
                </Button>
                <div className="flex justify-between items-center px-1">
                    <Button 
                        variant="link" 
                        type="button"
                        className="text-[10px] text-muted-foreground hover:text-accent p-0 h-auto"
                        onClick={handleForgotPassword}
                    >
                        Resend Code
                    </Button>
                    <Button 
                        variant="link" 
                        type="button"
                        className="text-[10px] text-muted-foreground hover:text-accent p-0 h-auto"
                        onClick={() => setIsVerifyCodeMode(false)}
                    >
                        Back to Identity
                    </Button>
                </div>
            </div>
        </form>
    </motion.div>
  );

  const hasMultipleAccounts = savedAccounts.length > 1;

  return (
    <div className="absolute inset-0 z-50 bg-background flex items-center justify-center p-4 sm:p-8">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className={cn(
          "bg-card/40 backdrop-blur-2xl border border-border shadow-2xl rounded-3xl overflow-hidden flex flex-col md:flex-row transition-all duration-500",
          hasMultipleAccounts ? "w-full max-w-4xl min-h-[550px]" : "w-full max-w-md"
        )}
      >
        <div className="flex-1 flex flex-col p-8 sm:p-12 items-center justify-center relative">
          <AnimatePresence mode="wait">
            {isVerifyCodeMode ? (
                renderVerifyCodeMode()
            ) : isForgotMode ? (
                renderForgotMode()
            ) : !isManualEntry && selectedAccount ? (
              <motion.div 
                key="windows-style"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="w-full max-w-xs text-center space-y-8"
              >
                <div className="space-y-4">
                  <Avatar className="w-32 h-32 mx-auto border-4 border-primary shadow-xl">
                    <AvatarFallback className="bg-primary/20 text-primary text-4xl font-bold">
                      {selectedAccount.displayName.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <h1 className="text-3xl font-bold font-headline tracking-tight">{selectedAccount.displayName}</h1>
                </div>

                <form onSubmit={handleSignIn} className="space-y-4">
                  <div className="space-y-2">
                    <div className="relative">
                        <Input
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter Password"
                        onKeyDown={onKeyDown}
                        autoFocus
                        className="bg-black/20 border-primary/20 focus:ring-accent h-12 rounded-xl pr-12 text-center text-lg"
                        />
                        <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 p-0 hover:bg-white/10 text-muted-foreground"
                        onClick={() => setShowPassword((prev) => !prev)}
                        >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                    </div>
                    <div className="flex justify-end px-1">
                        <Button 
                            variant="link" 
                            className="text-[10px] text-muted-foreground hover:text-accent p-0 h-auto"
                            type="button"
                            onClick={() => setIsForgotMode(true)}
                        >
                            Forgot password?
                        </Button>
                    </div>
                  </div>

                  {error && (
                    <motion.p 
                      initial={{ opacity: 0, x: -10 }} 
                      animate={{ opacity: 1, x: 0 }}
                      className="text-xs text-destructive font-semibold"
                    >
                      {error}
                    </motion.p>
                  )}

                  <div className="flex flex-col gap-3">
                    <Button size="lg" className="w-full bg-accent hover:bg-accent/80 text-accent-foreground font-bold tracking-widest h-12 rounded-xl shadow-lg" disabled={isLoading}>
                      {isLoading ? <Loader2 className="animate-spin" /> : "SIGN IN"}
                    </Button>
                    <Button 
                      variant="ghost" 
                      type="button"
                      className="text-xs text-muted-foreground hover:text-foreground"
                      onClick={() => setIsManualEntry(true)}
                    >
                      Sign in with another identity
                    </Button>
                  </div>
                </form>
              </motion.div>
            ) : (
              <motion.div 
                key="manual-entry"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="w-full max-sm space-y-8"
              >
                {savedAccounts.length > 0 && (
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    type="button"
                    className="absolute top-4 left-4 text-muted-foreground"
                    onClick={() => setIsManualEntry(false)}
                  >
                    <ArrowLeft className="mr-2 w-4 h-4" /> Back
                  </Button>
                )}

                <div className="text-center">
                  <Avatar className="w-20 h-20 mx-auto border-4 border-primary mb-4">
                    <AvatarFallback className="bg-primary/20 text-primary">
                      <User className="w-10 h-10" />
                    </AvatarFallback>
                  </Avatar>
                  <h1 className="text-2xl font-bold font-headline tracking-wider uppercase">Authentication</h1>
                  <p className="text-sm text-muted-foreground mt-1">Enter your credentials to access the Nexus</p>
                </div>

                <form onSubmit={handleSignIn} className="space-y-6">
                  <div className="space-y-2">
                    <Label className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold">Identity (Email)</Label>
                    <Input
                      value={identifier}
                      onChange={(e) => setIdentifier(e.target.value)}
                      placeholder="identity@nexus.net"
                      onKeyDown={onKeyDown}
                      autoFocus
                      className="bg-black/20 border-primary/20 focus:ring-accent h-12 rounded-xl"
                    />
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between items-end">
                        <Label className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold">Access Token (Password)</Label>
                        <Button 
                            variant="link" 
                            className="text-[10px] text-muted-foreground hover:text-accent p-0 h-auto"
                            type="button"
                            onClick={() => setIsForgotMode(true)}
                        >
                            Forgot password?
                        </Button>
                    </div>
                    <div className="relative">
                      <Input
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        onKeyDown={onKeyDown}
                        className="bg-black/20 border-primary/20 focus:ring-accent h-12 rounded-xl pr-12"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 p-0 hover:bg-white/10 text-muted-foreground"
                        onClick={() => setShowPassword((prev) => !prev)}
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>

                  {error && (
                    <motion.p 
                      initial={{ opacity: 0, x: -10 }} 
                      animate={{ opacity: 1, x: 0 }}
                      className="text-xs text-destructive font-semibold bg-destructive/10 p-3 rounded-lg border border-destructive/20"
                    >
                      {error}
                    </motion.p>
                  )}

                  <div className="pt-4 space-y-3">
                    <Button size="lg" className="w-full bg-accent hover:bg-accent/80 text-accent-foreground font-bold tracking-widest h-12 rounded-xl shadow-lg" disabled={isLoading}>
                      {isLoading ? <Loader2 className="animate-spin" /> : <><LogIn className="mr-2 w-5 h-5" /> SIGN IN</>}
                    </Button>
                    
                    <div className="grid grid-cols-2 gap-3">
                      <Button variant="outline" size="sm" className="border-primary/30 hover:bg-primary/10 rounded-xl h-10" onClick={onSwitchToSignUp} type="button">
                        <UserPlus className="mr-2 w-4 h-4" /> NEW
                      </Button>
                      <Button variant="outline" size="sm" className="border-primary/30 hover:bg-primary/10 rounded-xl h-10" onClick={handleGuestSignIn} type="button">
                        <UserCircle className="mr-2 w-4 h-4" /> GUEST
                      </Button>
                    </div>
                  </div>
                </form>

                <div className="text-center border-t border-border/50 pt-6">
                  <p className="text-xs text-muted-foreground">
                    Don't have an account? <Button variant="link" className="p-0 text-accent h-auto text-xs" onClick={onSwitchToSignUp}>Create identity</Button>
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {hasMultipleAccounts && (
          <div className="w-full md:w-72 bg-black/30 border-l border-border/50 flex flex-col">
            <div className="p-6 border-b border-border/50 bg-black/20">
              <h2 className="text-[10px] font-bold text-accent uppercase tracking-[0.2em]">Known Identities</h2>
            </div>
            <ScrollArea className="flex-1">
              <div className="p-4 space-y-2">
                {savedAccounts.map((acc) => (
                  <button
                    key={acc.email}
                    onClick={() => selectAccount(acc)}
                    className={cn(
                      "w-full flex items-center gap-3 p-3 rounded-2xl transition-all group hover:bg-white/5",
                      identifier === acc.email && !isManualEntry && !isForgotMode && !isVerifyCodeMode ? "bg-primary/20 border border-primary/30 shadow-lg" : "border border-transparent"
                    )}
                  >
                    <Avatar className="w-10 h-10 border border-border group-hover:border-primary/50 transition-colors">
                      <AvatarFallback className="bg-secondary text-secondary-foreground text-xs uppercase">
                        {acc.displayName.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 text-left overflow-hidden">
                      <p className="text-sm font-bold text-foreground/90 truncate">{acc.displayName}</p>
                      <p className="text-[10px] text-muted-foreground truncate">{acc.email}</p>
                    </div>
                    <ChevronRight className={cn(
                      "w-4 h-4 text-muted-foreground transition-transform",
                      identifier === acc.email && !isManualEntry && !isForgotMode && !isVerifyCodeMode ? "translate-x-0 opacity-100" : "-translate-x-2 opacity-0 group-hover:opacity-50"
                    )} />
                  </button>
                ))}
              </div>
            </ScrollArea>
            <div className="p-6 bg-black/20 text-center">
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider">OrbitusVR OS &bull; Secure Auth</p>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}
