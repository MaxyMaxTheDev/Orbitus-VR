
"use client";

import { useSession, signIn, signOut } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { Loader2, LogIn, LogOut, Mail as MailIcon } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '../ui/scroll-area';

// Simple SVG for Google icon as it's not in lucide
const GoogleIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22C17.5 22 22 17.5 22 12S17.5 2 12 2 2 6.5 2 12S6.5 22 12 22Z"/><path d="M12 12v-2.5a2.5 2.5 0 0 1 5 0v0a2.5 2.5 0 0 1-2.5 2.5zM12 12h-5a2.5 2.5 0 0 0 0 5h5z"/><path d="M12 12v5a2.5 2.5 0 0 0 0-5zM12 12c-1.657 0-3-1.12-3-2.5s1.343-2.5 3-2.5 3 1.12 3 2.5-1.343 2.5-3 2.5z"/></svg>
  );
  

export function MailApp() {
  const { data: session, status } = useSession();

  if (status === 'loading') {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-accent" />
      </div>
    );
  }

  if (status === 'unauthenticated') {
    return (
      <div className="flex h-full w-full flex-col items-center justify-center gap-4 p-8 text-center">
        <h2 className="text-2xl font-bold">Connect Your Mail Account</h2>
        <p className="text-muted-foreground max-w-md">
            To view your emails directly within XenovaVR, you'll need to sign in with your provider. This application only requests read-only access and does not store your emails.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 mt-4">
            <Button onClick={() => signIn('google')} size="lg" className="w-full sm:w-auto">
                <GoogleIcon />
                Sign in with Google
            </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full w-full">
      <div className="w-1/3 border-r border-primary/30 p-2 flex flex-col gap-4">
        <div className="flex items-center gap-3 p-2">
          <Avatar>
            <AvatarImage src={session?.user?.image ?? ''} alt={session?.user?.name ?? ''} />
            <AvatarFallback>{session?.user?.name?.charAt(0).toUpperCase()}</AvatarFallback>
          </Avatar>
          <div className="overflow-hidden">
            <p className="font-semibold truncate">{session?.user?.name}</p>
            <p className="text-xs text-muted-foreground truncate">{session?.user?.email}</p>
          </div>
        </div>
        
        <div className="px-2">
            <Button disabled className="w-full">
                Fetch Emails (Coming Soon)
            </Button>
            <Button onClick={() => signOut()} variant="outline" className="w-full mt-2">
                <LogOut className="mr-2" />
                Sign Out
            </Button>
        </div>

        <ScrollArea className="flex-1">
            <div className="flex h-full items-center justify-center text-center text-muted-foreground text-sm p-4">
                <p>Email fetching functionality will be implemented in the next step.</p>
            </div>
        </ScrollArea>
        
      </div>
      <div className="flex-1 p-4">
        <div className="flex h-full items-center justify-center text-muted-foreground">
            <p>Select an email to read.</p>
        </div>
      </div>
    </div>
  );
}
