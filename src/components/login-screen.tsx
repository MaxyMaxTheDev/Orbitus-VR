
"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSettings } from '@/contexts/settings-context';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, LogIn, User, Eye, EyeOff, UserCircle, UserPlus, ChevronRight } from 'lucide-react';
import { Avatar, AvatarFallback } from './ui/avatar';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useAuth } from '@/firebase';
import { get, set } from '@/lib/idb';
import { cn } from '@/lib/utils';
import { ScrollArea } from './ui/scroll-area';

type SavedAccount = {
  email: string;
  displayName: string;
};

type LoginScreenProps = {
  onLoginSuccess: () => void;
  onSwitchToSignUp: () => void;
};

export function LoginScreen({ onLoginSuccess, onSwitchToSignUp }: LoginScreenProps) {
  const { setUsername: setContextUsername } = useSettings();
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [savedAccounts, setSavedAccounts] = useState<SavedAccount[]>([]);
  const auth = useAuth();

  useEffect(() => {
    const loadAccounts = async () => {
      const accounts = await get<SavedAccount[]>('saved-accounts');
      if (accounts) setSavedAccounts(accounts);
    };
    loadAccounts();
  }, []);

  const handleSignIn = async (e?: React.FormEvent | string, pass?: string) => {
    if (e && typeof e !== 'string') e.preventDefault();
    
    const loginId = typeof e === 'string' ? e : identifier;
    const loginPass = pass || password;

    if (loginId.trim() === '' || loginPass.trim() === '') return;
    
    setIsLoading(true);
    setError(null);

    let emailToUse = loginId;
    if (loginId.toLowerCase() === 'guest') {
      emailToUse = 'guest@xenovavr.local';
    }

    try {
      const userCredential = await signInWithEmailAndPassword(auth, emailToUse, loginPass);
      const displayName = userCredential.user.displayName || (loginId.toLowerCase() === 'guest' ? 'Guest' : loginId.split('@')[0]);
      
      setContextUsername(displayName);

      // Save account for next time if not guest
      if (loginId.toLowerCase() !== 'guest') {
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
            message = 'Incorrect username/email or password.';
            break;
          case 'auth/invalid-email':
            message = 'Please enter a valid email address or username.';
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

  const selectAccount = (acc: SavedAccount) => {
    setIdentifier(acc.email);
    setPassword('');
    setError(null);
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') handleSignIn();
  };

  const hasMultipleAccounts = savedAccounts.length > 1;

  return (
    <div className="absolute inset-0 z-50 bg-background flex items-center justify-center p-4 sm:p-8">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className={cn(
          "bg-card/40 backdrop-blur-2xl border border-border shadow-2xl rounded-3xl overflow-hidden flex flex-col md:flex-row transition-all duration-500",
          hasMultipleAccounts ? "w-full max-w-4xl min-h-[500px]" : "w-full max-w-md"
        )}
      >
        {/* Main Login Area */}
        <div className="flex-1 flex flex-col p-8 sm:p-12">
          <div className="text-center mb-10">
            <Avatar className="w-20 h-20 mx-auto border-4 border-primary mb-4">
              <AvatarFallback className="bg-primary/20 text-primary">
                <User className="w-10 h-10" />
              </AvatarFallback>
            </Avatar>
            <h1 className="text-2xl font-bold font-headline tracking-wider uppercase">Authentication</h1>
            <p className="text-sm text-muted-foreground mt-1">Enter your credentials to access the Nexus</p>
          </div>

          <form onSubmit={(e) => handleSignIn(e)} className="space-y-6 flex-1">
            <div className="space-y-2">
              <Label htmlFor="identifier-login" className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold">Identity (Email/User)</Label>
              <Input
                id="identifier-login"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder="identity@nexus.net"
                onKeyDown={onKeyDown}
                className="bg-black/20 border-primary/20 focus:ring-accent h-12 rounded-xl"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password-login" className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold">Access Token (Password)</Label>
              <div className="relative">
                <Input
                  id="password-login"
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
              <Button size="lg" className="w-full bg-accent hover:bg-accent/80 text-accent-foreground font-bold tracking-widest h-12 rounded-xl" disabled={isLoading}>
                {isLoading ? <Loader2 className="animate-spin" /> : <><LogIn className="mr-2 w-5 h-5" /> SIGN IN</>}
              </Button>
              
              <div className="grid grid-cols-2 gap-3">
                <Button variant="outline" size="sm" className="border-primary/30 hover:bg-primary/10 rounded-xl h-10" onClick={() => { setIdentifier(''); setPassword(''); setError(null); }} type="button">
                  <UserPlus className="mr-2 w-4 h-4" /> NEW
                </Button>
                <Button variant="outline" size="sm" className="border-primary/30 hover:bg-primary/10 rounded-xl h-10" onClick={() => handleSignIn('guest', 'xenova_guest')} type="button">
                  <UserCircle className="mr-2 w-4 h-4" /> GUEST
                </Button>
              </div>
            </div>
          </form>

          <div className="mt-8 text-center border-t border-border/50 pt-6">
            <p className="text-xs text-muted-foreground">
              Don't have an account? <Button variant="link" className="p-0 text-accent h-auto text-xs" onClick={onSwitchToSignUp}>Create identity</Button>
            </p>
          </div>
        </div>

        {/* User List Sidebar */}
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
                      identifier === acc.email ? "bg-primary/20 border border-primary/30 shadow-lg" : "border border-transparent"
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
                      identifier === acc.email ? "translate-x-0 opacity-100" : "-translate-x-2 opacity-0 group-hover:opacity-50"
                    )} />
                  </button>
                ))}
              </div>
            </ScrollArea>
            <div className="p-6 bg-black/20 text-center">
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider">XenovaVR OS &bull; Secure Auth</p>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}
