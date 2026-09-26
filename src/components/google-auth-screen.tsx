'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { signIn } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

type GoogleAuthScreenProps = {
  mode: 'signup' | 'signin';
  onSwitchMode: () => void;
};

export function GoogleMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      />
    </svg>
  );
}

// Google is the only identity provider, so signup and signin are the same
// action: the first Google sign-in creates the account, every later one
// recognises it. The two modes differ only in framing.
export function GoogleAuthScreen({ mode, onSwitchMode }: GoogleAuthScreenProps) {
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isSignup = mode === 'signup';

  const handleGoogleSignIn = async () => {
    setIsPending(true);
    setError(null);
    try {
      // Navigates away to Google and back, so there is no "done" state to
      // return to; the redirect always lands back on this page.
      await signIn('google', { callbackUrl: window.location.href });
    } catch {
      setError('Could not reach Google. Check your connection and try again.');
      setIsPending(false);
    }
  };

  return (
    <div className="absolute inset-0 z-50 bg-background flex items-center justify-center p-4 sm:p-8">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md bg-card/40 backdrop-blur-2xl border border-border shadow-2xl rounded-3xl p-8 sm:p-12 flex flex-col items-center text-center space-y-8"
      >
        <div className="space-y-4">
          <div className="w-20 h-20 rounded-full bg-primary/10 border-2 border-primary/20 flex items-center justify-center mx-auto">
            <GoogleMark className="w-9 h-9" />
          </div>
          <div className="space-y-1">
            <h1 className="text-2xl font-bold font-headline tracking-wider uppercase">
              {isSignup ? 'Create Account' : 'Welcome Back'}
            </h1>
            <p className="text-sm text-muted-foreground">
              {isSignup
                ? 'Sign in with Google to create your OrbitusVR identity'
                : 'Sign in with Google to access the Nexus'}
            </p>
          </div>
        </div>

        {error && (
          <p className="text-xs text-destructive font-semibold bg-destructive/10 p-3 rounded-lg border border-destructive/20 w-full">
            {error}
          </p>
        )}

        <div className="w-full space-y-4">
          <Button
            size="lg"
            onClick={handleGoogleSignIn}
            disabled={isPending}
            className="w-full h-12 rounded-xl font-bold tracking-wide bg-white text-slate-900 hover:bg-slate-100 shadow-lg"
          >
            {isPending ? (
              <Loader2 className="animate-spin mr-2" />
            ) : (
              <GoogleMark className="w-5 h-5 mr-2" />
            )}
            {isPending ? 'CONNECTING...' : 'SIGN IN WITH GOOGLE'}
          </Button>

          <p className="text-xs text-muted-foreground">
            {isSignup ? 'Already have an account? ' : "Don't have an account? "}
            <Button
              variant="link"
              type="button"
              className="p-0 h-auto text-xs text-accent"
              onClick={onSwitchMode}
            >
              {isSignup ? 'Log in' : 'Sign up'}
            </Button>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
