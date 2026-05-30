"use client";

import { useState } from 'react';
import { Archive, File, Inbox, Send, Trash2, Users, Mail as MailIcon, Search, LogIn, Loader2, RefreshCcw } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useSession, signIn, signOut } from 'next-auth/react';

type Email = {
    id: string;
    from: string;
    fromAddress: string;
    subject: string;
    body: string;
    date: string;
    fullDate: string;
    isUnread: boolean;
    avatar: string;
};

const NavLink = ({ icon: Icon, text, count, isActive }: { icon: React.ElementType, text: string, count?: number, isActive?: boolean }) => (
  <a
    href="#"
    onClick={(e) => e.preventDefault()}
    className={cn(
      "flex items-center justify-between p-2 rounded-lg text-sm font-medium",
      isActive ? "bg-blue-100 text-blue-700" : "text-gray-600 hover:bg-gray-100"
    )}
  >
    <div className="flex items-center gap-3">
      <Icon className="w-5 h-5" />
      <span>{text}</span>
    </div>
    {count !== undefined && <span className="text-xs bg-gray-200 rounded-full px-2 py-0.5">{count}</span>}
  </a>
);

export function MailApp() {
  const { data: session, status } = useSession();
  const [emails, setEmails] = useState<Email[]>([]);
  const [selectedEmail, setSelectedEmail] = useState<Email | null>(null);

  if (status === "loading") {
    return (
        <div className="h-full w-full flex items-center justify-center bg-white text-gray-900">
            <Loader2 className="w-12 h-12 animate-spin text-blue-600" />
        </div>
    );
  }

  if (!session) {
    return (
        <div className="h-full w-full flex flex-col items-center justify-center bg-white text-gray-900 p-8 text-center space-y-6 rounded-b-2xl">
            <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center">
                <MailIcon className="w-10 h-10 text-blue-600" />
            </div>
            <div className="space-y-2">
                <h2 className="text-2xl font-bold">Connect Your Email</h2>
                <p className="text-gray-500 max-w-sm mx-auto">Access your real messages directly from NovaVR. Connect your Google account to get started.</p>
            </div>
            <Button size="lg" onClick={() => signIn('google')} className="bg-blue-600 hover:bg-blue-700 text-white px-8">
                <LogIn className="mr-2" /> Sign in with Google
            </Button>
            <p className="text-xs text-gray-400 italic">Integration required: set GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET in Vercel Environment Variables.</p>
        </div>
    );
  }

  return (
    <div className="h-full w-full flex bg-white text-gray-900 rounded-b-2xl overflow-hidden">
      <TooltipProvider>
        {/* Sidebar */}
        <div className="flex flex-col items-center w-20 p-2 bg-gray-50 border-r border-gray-200 space-y-4 flex-shrink-0">
          <div className="p-2">
             <Avatar className="w-10 h-10 border border-gray-200">
                <AvatarFallback className="bg-blue-600 text-white">{session.user?.name?.charAt(0)}</AvatarFallback>
             </Avatar>
          </div>
          <nav className="flex flex-col items-center space-y-2 w-full">
            <Tooltip>
              <TooltipTrigger asChild>
                <a href="#" onClick={(e) => e.preventDefault()} className="p-3 rounded-full bg-blue-100 text-blue-600">
                  <MailIcon className="w-6 h-6" />
                </a>
              </TooltipTrigger>
              <TooltipContent side="right"><p>Inbox</p></TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <button onClick={() => signOut()} className="p-3 rounded-full text-gray-400 hover:bg-red-50 hover:text-red-600 transition-colors">
                  <RefreshCcw className="w-6 h-6" />
                </button>
              </TooltipTrigger>
              <TooltipContent side="right"><p>Disconnect Account</p></TooltipContent>
            </Tooltip>
          </nav>
        </div>

        {/* Folder List */}
        <div className="w-64 p-4 bg-gray-100/80 border-r border-gray-200 flex-shrink-0 flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold">Inbox</h2>
            <button className="text-blue-600 font-semibold text-sm">Compose</button>
          </div>
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input placeholder="Search Mail" className="pl-9 bg-white border-gray-300" />
          </div>
          <nav className="space-y-1">
            <NavLink icon={Inbox} text="Inbox" count={emails.filter(e => e.isUnread).length} isActive />
            <NavLink icon={File} text="Drafts" />
            <NavLink icon={Send} text="Sent" />
            <NavLink icon={Archive} text="Archive" />
            <NavLink icon={Trash2} text="Trash" />
            <NavLink icon={Users} text="Contacts" />
          </nav>
        </div>

        {/* Email List / Fallback for no emails */}
        <div className="w-80 border-r border-gray-200 flex flex-col flex-shrink-0">
          <div className="p-4 border-b border-gray-200 flex-shrink-0">
            <h3 className="font-bold">Recent</h3>
          </div>
          <div className="overflow-y-auto flex-1 flex items-center justify-center p-8 text-center">
             {emails.length > 0 ? (
                 <div className="w-full">
                    {/* Render emails here */}
                 </div>
             ) : (
                 <div className="space-y-2">
                    <p className="text-sm font-semibold text-gray-400">No emails found.</p>
                    <p className="text-xs text-gray-400">Your inbox is empty or sync is pending.</p>
                 </div>
             )}
          </div>
        </div>

        {/* Email Content */}
        <div className="flex-1 p-6 overflow-y-auto flex items-center justify-center">
          {selectedEmail ? (
            <div>
              <h1 className="text-2xl font-bold mb-2">{selectedEmail.subject}</h1>
              <div className="flex items-center gap-4 mb-6">
                <Avatar>
                  <AvatarFallback className="bg-blue-500 text-white">{selectedEmail.avatar}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-semibold">{selectedEmail.from} <span className="text-gray-500 font-normal text-sm">&lt;{selectedEmail.fromAddress}&gt;</span></p>
                  <p className="text-sm text-gray-500">to me</p>
                </div>
                <p className="text-sm text-gray-500 ml-auto">{selectedEmail.fullDate}</p>
              </div>
              <Separator />
              <div className="mt-6 prose prose-sm max-w-none text-gray-800">
                <p className="whitespace-pre-wrap">{selectedEmail.body}</p>
              </div>
            </div>
          ) : (
            <div className="text-gray-400 space-y-4 text-center">
              <MailIcon className="w-16 h-16 mx-auto opacity-20" strokeWidth={1} />
              <p>Select a message to preview its content.</p>
            </div>
          )}
        </div>
      </TooltipProvider>
    </div>
  );
}
