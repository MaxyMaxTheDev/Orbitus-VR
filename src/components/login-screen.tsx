
"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useSettings } from '@/contexts/settings-context';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, LogIn, User } from 'lucide-react';
import { Avatar, AvatarFallback } from './ui/avatar';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useAuth } from '@/firebase';

type LoginScreenProps = {
  onLoginSuccess: () => void;
  onSwitchToSignUp: () => void;
};

export function LoginScreen({ onLoginSuccess, onSwitchToSignUp }: LoginScreenProps) {
  const { setUsername: setContextUsername } = useSettings();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const auth = useAuth();

  const handleSignIn = async () => {
    if (email.trim() === '' || password.trim() === '') return;
    setIsLoading(true);
    setError(null);
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      if (userCredential.user.displayName) {
        setContextUsername(userCredential.user.displayName);
      }
      onLoginSuccess();
    } catch (err: any) {
      let message = 'An unknown error occurred.';
      if (err.code) {
        switch (err.code) {
          case 'auth/user-not-found':
          case 'auth/wrong-password':
          case 'auth/invalid-credential':
            message = 'Incorrect email or password.';
            break;
          case 'auth/invalid-email':
            message = 'Please enter a valid email address.';
            break;
          default:
            message = 'An error occurred during login. Please try again.';
            break;
        }
      }
      setError(message);
    } finally {
      setIsLoading(false);
    }
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
            <Label htmlFor="email-login">Email</Label>
            <Input
              id="email-login"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              onKeyDown={onKeyDown}
              autoComplete="email"
            />
          </div>
          <div>
            <Label htmlFor="password-login">Password</Label>
            <Input
              id="password-login"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              onKeyDown={onKeyDown}
              autoComplete="current-password"
            />
          </div>
        </div>
        
        <Button size="lg" className="w-full mt-10" onClick={handleSignIn} disabled={email.trim() === '' || password.trim() === '' || isLoading}>
          {isLoading ? <Loader2 className="animate-spin" /> : <><LogIn className="mr-2" /> Sign In</>}
        </Button>
        
        {error && <p className="text-sm text-destructive mt-4">{error}</p>}
      </motion.div>
      
      <p className="text-sm text-muted-foreground pt-4 flex-shrink-0">
          Don't have an account? <Button variant="link" className="p-0" onClick={onSwitchToSignUp}>Create one</Button>
      </p>
    </div>
  );
}
