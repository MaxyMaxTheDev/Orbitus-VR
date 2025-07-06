
"use client";

import { useSession, signIn, signOut } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { Loader2, LogIn, LogOut, Inbox, ServerCrash, RefreshCw } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '../ui/scroll-area';
import { useEffect, useState, useMemo } from 'react';
import { fetchEmails, type Email } from '@/lib/gmail';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

const GoogleIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22C17.5 22 22 17.5 22 12S17.5 2 12 2 2 6.5 2 12S6.5 22 12 22Z"/><path d="M12 12v-2.5a2.5 2.5 0 0 1 5 0v0a2.5 2.5 0 0 1-2.5 2.5zM12 12h-5a2.5 2.5 0 0 0 0 5h5z"/><path d="M12 12v5a2.5 2.5 0 0 0 0-5zM12 12c-1.657 0-3-1.12-3-2.5s1.343-2.5 3-2.5 3 1.12 3 2.5-1.343 2.5-3 2.5z"/></svg>
);

function MailAppContent() {
  const { data: session } = useSession();
  const [emails, setEmails] = useState<Email[]>([]);
  const [selectedEmail, setSelectedEmail] = useState<Email | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFetchEmails = async () => {
    if (!session?.accessToken) {
      setError("Authentication token is missing.");
      return;
    }
    setIsLoading(true);
    setError(null);
    setSelectedEmail(null);
    try {
      const fetchedEmails = await fetchEmails(session.accessToken);
      setEmails(fetchedEmails);
    } catch (e: any) {
      console.error("Failed to fetch emails:", e);
      setError(e.message || "An unknown error occurred while fetching emails.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (session?.accessToken) {
      handleFetchEmails();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session?.accessToken]);

  const unreadCount = useMemo(() => emails.filter(e => e.isUnread).length, [emails]);

  if (error) {
    return (
        <div className="flex h-full w-full flex-col items-center justify-center gap-4 text-center text-destructive">
            <ServerCrash className="h-12 w-12" />
            <h3 className="text-xl font-bold">Failed to Fetch Emails</h3>
            <p className="text-sm max-w-md">{error}</p>
            <Button onClick={handleFetchEmails} variant="destructive">
                <RefreshCw className="mr-2 h-4 w-4" />
                Try Again
            </Button>
        </div>
    );
  }

  return (
    <div className="flex h-full w-full">
      <div className="w-1/3 min-w-[300px] border-r border-primary/30 p-2 flex flex-col gap-4">
        <div className="flex items-center justify-between gap-3 p-2">
            <div className="flex items-center gap-3 overflow-hidden">
                <Avatar>
                    <AvatarImage src={session?.user?.image ?? ''} alt={session?.user?.name ?? ''} />
                    <AvatarFallback>{session?.user?.name?.charAt(0).toUpperCase()}</AvatarFallback>
                </Avatar>
                <div className="overflow-hidden">
                    <p className="font-semibold truncate text-sm">{session?.user?.name}</p>
                    <p className="text-xs text-muted-foreground truncate">{session?.user?.email}</p>
                </div>
            </div>
             <Button onClick={() => signOut()} variant="ghost" size="icon" className="h-8 w-8 rounded-full flex-shrink-0">
                <LogOut className="w-4 h-4" />
            </Button>
        </div>
        
        <div className="px-2">
            <Button onClick={handleFetchEmails} disabled={isLoading} className="w-full">
                {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <RefreshCw className="mr-2 h-4 w-4" />}
                {isLoading ? 'Fetching...' : 'Refresh'}
            </Button>
        </div>

        <div className="px-2 text-sm font-semibold text-muted-foreground flex justify-between items-center">
            <span>Inbox</span>
            {unreadCount > 0 && <span className="px-2 py-0.5 text-xs rounded-full bg-accent text-accent-foreground">{unreadCount}</span>}
        </div>

        <ScrollArea className="flex-1 -mx-2">
            <div className="flex flex-col gap-1 px-2">
                {emails.map((email) => (
                    <button
                        key={email.id}
                        onClick={() => setSelectedEmail(email)}
                        className={cn(
                            "w-full text-left p-3 rounded-lg border-2 border-transparent transition-colors",
                            selectedEmail?.id === email.id ? "bg-primary/20 border-primary" : "hover:bg-primary/10",
                            email.isUnread && "font-bold"
                        )}
                    >
                        <div className="flex justify-between items-baseline">
                            <p className="text-sm text-foreground truncate ">{email.from}</p>
                            <p className="text-xs text-muted-foreground flex-shrink-0">{email.date}</p>
                        </div>
                        <p className="text-sm text-foreground truncate mt-1">{email.subject}</p>
                        <p className="text-xs text-muted-foreground truncate mt-1">{email.snippet}</p>
                    </button>
                ))}
            </div>
        </ScrollArea>
      </div>

      <div className="flex-1 p-4 overflow-y-auto">
        {selectedEmail ? (
          <div>
            <h2 className="text-2xl font-bold">{selectedEmail.subject}</h2>
            <div className="flex items-center gap-3 mt-4 pb-4 border-b border-primary/30">
                <Avatar className="h-12 w-12">
                     <AvatarFallback>{selectedEmail.from.charAt(0).toUpperCase()}</AvatarFallback>
                </Avatar>
                <div>
                    <p className="font-semibold">{selectedEmail.from}</p>
                    <p className="text-sm text-muted-foreground">To: {session?.user?.email}</p>
                </div>
                 <p className="text-sm text-muted-foreground ml-auto">{selectedEmail.fullDate}</p>
            </div>
            <div className="mt-6 text-foreground/90 whitespace-pre-wrap text-sm leading-relaxed">
                {selectedEmail.snippet}
                <br /><br />
                <em className="text-muted-foreground">For security, this is a plain text preview. Full email content with formatting is not displayed.</em>
            </div>
          </div>
        ) : (
          <div className="flex h-full items-center justify-center text-muted-foreground flex-col gap-3">
              <Inbox className="w-16 h-16 text-primary/20"/>
              <p className="text-lg">Select an email to read</p>
              <p className="text-sm">Your inbox is waiting for you.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export function MailApp() {
  const { status } = useSession();

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

  return <MailAppContent />;
}
