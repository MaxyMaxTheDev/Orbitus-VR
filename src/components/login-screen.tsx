
"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useSettings } from '@/contexts/settings-context';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, LogIn, User, Eye, EyeOff, UserCircle } from 'lucide-react';
import { Avatar, AvatarFallback } from './ui/avatar';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useAuth } from '@/firebase';

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
  const auth = useAuth();

  const handleSignIn = async (e?: React.FormEvent | string, pass?: string) => {
    if (e && typeof e !== 'string') e.preventDefault();
    
    const loginId = typeof e === 'string' ? e : identifier;
    const loginPass = pass || password;

    if (loginId.trim() === '' || loginPass.trim() === '') return;
    
    setIsLoading(true);
    setError(null);

    // Map username to email if it's the guest account
    let emailToUse = loginId;
    if (loginId.toLowerCase() === 'guest') {
      emailToUse = 'guest@xenovavr.local';
    }

    try {
      const userCredential = await signInWithEmailAndPassword(auth, emailToUse, loginPass);
      if (userCredential.user.displayName) {
        setContextUsername(userCredential.user.displayName);
      } else if (loginId.toLowerCase() === 'guest') {
        setContextUsername('Guest');
      }
      onLoginSuccess();
    } catch (err: any) {
      let message = 'An unknown error occurred.';
      if (err.code) {
        switch (err.code) {
          case 'auth/user-not-found':
          case 'auth/wrong-password':
          case 'auth/invalid-credential':
            message = 'Incorrect username/email or password. Please try again.';
            break;
          case 'auth/invalid-email':
            message = 'Please enter a valid email address or username.';
            break;
          case 'auth/operation-not-allowed':
             message = 'Email/Password sign-in is not enabled for this project.';
             break;
          default:
            message = `Login failed: ${err.code}. Ensure this account exists in your Firebase console.`;
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

  const handleGuestLogin = () => {
    setIdentifier('guest');
    setPassword('xenova_guest');
    handleSignIn('guest', 'xenova_guest');
  };
  
  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSignIn();
    }
  }

  const variants = {
    enter: { opacity: 1, y: 0 },
    initial: { opacity: 0, y: 20 },
  };

  return (
    <div className="absolute inset-0 z-50 bg-background flex flex-col items-center justify-center p-8">
      <motion.div
        variants={variants}
        initial="initial"
        animate="enter"
        transition={{ duration: 0.5, ease: 'easeInOut' }}
        className="text-center w-full max-w-sm flex-1 flex flex-col justify-center"
      >
        <div className="space-y-6 mb-10">
            <Avatar className="w-24 h-24 mx-auto border-4 border-primary">
                <AvatarFallback className="bg-primary/20 text-primary">
                    <User className="w-12 h-12" />
                </AvatarFallback>
            </Avatar>

            <h1 className="text-2xl font-bold font-headline">Sign In</h1>
        </div>
        
        <div className="space-y-6 text-left">
          <div>
            <Label htmlFor="identifier-login">Username or Email</Label>
            <Input
              id="identifier-login"
              type="text"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              placeholder="Username or email"
              onKeyDown={onKeyDown}
              autoComplete="username"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password-login">Password</Label>
            <div className="relative">
              <Input
                id="password-login"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                onKeyDown={onKeyDown}
                autoComplete="current-password"
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
        
        <div className="flex flex-col gap-3 mt-10">
            <Button size="lg" className="w-full" onClick={() => handleSignIn()} disabled={identifier.trim() === '' || password.trim() === '' || isLoading}>
            {isLoading ? <Loader2 className="animate-spin" /> : <><LogIn className="mr-2" /> Sign In</>}
            </Button>
            
            <Button variant="outline" size="lg" className="w-full border-primary/30 hover:bg-primary/10" onClick={handleGuestLogin} disabled={isLoading}>
                <UserCircle className="mr-2" /> Use as Guest
            </Button>
        </div>
        
        {error && <p className="text-sm text-destructive mt-4">{error}</p>}
      </motion.div>
      
      <p className="text-sm text-muted-foreground pt-4 flex-shrink-0">
          Don't have an account? <Button variant="link" className="p-0" onClick={onSwitchToSignUp}>Create one</Button>
      </p>
    </div>
  );
}
