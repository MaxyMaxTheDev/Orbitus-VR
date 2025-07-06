"use client";

import { useState } from 'react';
import { Archive, File, Inbox, Send, Trash2, Users, Mail as MailIcon, Search } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { getMockEmails, type Email } from '@/lib/mail';
import { cn } from '@/lib/utils';
import Image from 'next/image';

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
  const [emails, setEmails] = useState<Email[]>(getMockEmails());
  const [selectedEmail, setSelectedEmail] = useState<Email | null>(emails[0]);

  const unreadCount = emails.filter(e => e.isUnread).length;

  const handleSelectEmail = (email: Email) => {
    setSelectedEmail(email);
    // Mark as read when selected
    setEmails(emails.map(e => e.id === email.id ? { ...e, isUnread: false } : e));
  };

  return (
    <div className="h-full w-full flex bg-white text-gray-900 rounded-b-2xl overflow-hidden">
      <TooltipProvider>
        {/* Sidebar */}
        <div className="flex flex-col items-center w-20 p-2 bg-gray-50 border-r border-gray-200 space-y-4 flex-shrink-0">
          <a href="#" onClick={(e) => e.preventDefault()} className="p-2">
            <Image src="https://s.yimg.com/rz/p/yahoo_frontpage_en-US_s_f_p_bestfit_frontpage_2x.png" alt="Yahoo Logo" width={40} height={40} />
          </a>
          <nav className="flex flex-col items-center space-y-2 w-full">
            <Tooltip>
              <TooltipTrigger asChild>
                <a href="#" onClick={(e) => e.preventDefault()} className="p-3 rounded-full bg-blue-100 text-blue-600">
                  <MailIcon className="w-6 h-6" />
                </a>
              </TooltipTrigger>
              <TooltipContent side="right"><p>Mail</p></TooltipContent>
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
            <NavLink icon={Inbox} text="Inbox" count={unreadCount} isActive />
            <NavLink icon={File} text="Drafts" count={2} />
            <NavLink icon={Send} text="Sent" />
            <NavLink icon={Archive} text="Archive" />
            <NavLink icon={Trash2} text="Trash" />
            <NavLink icon={Users} text="Contacts" />
          </nav>
        </div>

        {/* Email List */}
        <div className="w-80 border-r border-gray-200 flex flex-col flex-shrink-0">
          <div className="p-4 border-b border-gray-200 flex-shrink-0">
            <h3 className="font-bold">Recent</h3>
          </div>
          <div className="overflow-y-auto flex-1">
            {emails.map(email => (
              <div
                key={email.id}
                onClick={() => handleSelectEmail(email)}
                className={cn(
                  "p-4 border-b border-gray-200 cursor-pointer",
                  selectedEmail?.id === email.id ? 'bg-blue-50' : 'hover:bg-gray-50'
                )}
              >
                <div className="flex justify-between items-center mb-1">
                  <p className={cn("font-bold text-sm", email.isUnread && "text-gray-900", !email.isUnread && "text-gray-600")}>{email.from}</p>
                  <p className="text-xs text-gray-500">{email.date}</p>
                </div>
                <p className="text-sm font-semibold text-gray-800 truncate">{email.subject}</p>
                <p className="text-xs text-gray-500 truncate">{email.body}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Email Content */}
        <div className="flex-1 p-6 overflow-y-auto">
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
            <div className="flex items-center justify-center h-full text-gray-400">
              <p>Select an email to read</p>
            </div>
          )}
        </div>
      </TooltipProvider>
    </div>
  );
}
