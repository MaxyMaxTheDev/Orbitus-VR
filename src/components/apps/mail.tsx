
"use client";

import { useState } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardContent } from '@/components/ui/card';
import { Archive, Inbox, Send, File, Trash2, User } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

const emails = [
  {
    id: 1,
    sender: 'SynthRider',
    subject: 'New track is fire!',
    body: `Yo, just dropped a new synthwave track called "Digital Sunset". It's got some real glitchy vibes I think you'll dig. Let me know what you think!\n\nCatch you in the data streams,\nSynthRider`,
    read: false,
  },
  {
    id: 2,
    sender: 'Oracle',
    subject: 'A whisper from the ether',
    body: `The signal flickers, and a pattern emerges. A choice, a path, a variable yet to be defined. The stream flows towards a new constant. Contemplate the echo.\n\n::Oracle::`,
    read: false,
  },
  {
    id: 3,
    sender: 'XenovaVR Support',
    subject: 'Welcome to your new reality!',
    body: `Welcome to XenovaVR! We're excited to have you. Your virtual home environment is fully customizable. Try the 'Theme Studio' app to personalize your space, or say hello to our AI Assistant.\n\nIf you have any questions, consult the DevKit or contact support.\n\nBest,\nThe XenovaVR Team`,
    read: true,
  },
  {
    id: 4,
    sender: 'Ana Digital',
    subject: 'Collaboration on SculptVR project?',
    body: `Hey, I saw your latest creation in SculptVR – that "Cybernetic Bonsai" was rad! I'm working on a virtual gallery exhibition and I think your style would be a perfect fit. Are you open to a collaboration?\n\nLet me know,\nAna`,
    read: true,
  },
];

type Email = typeof emails[0];

export function MailApp() {
  const [mailList, setMailList] = useState(emails);
  const [selectedMail, setSelectedMail] = useState<Email | null>(emails[0]);

  const handleSelectMail = (mail: Email) => {
    setSelectedMail(mail);
    setMailList(
      mailList.map(m => (m.id === mail.id ? { ...m, read: true } : m))
    );
  };

  return (
    <div className="flex h-full w-full">
      <div className="w-1/3 border-r border-primary/30 p-2 flex flex-col gap-2">
        <h2 className="p-2 text-lg font-bold text-accent">Inbox</h2>
        <ScrollArea>
          <div className="flex flex-col gap-1 pr-2">
            {mailList.map((mail) => (
              <div
                key={mail.id}
                onClick={() => handleSelectMail(mail)}
                className={cn(
                  'flex flex-col gap-1 p-3 rounded-lg transition-colors duration-200',
                  selectedMail?.id === mail.id ? 'bg-primary/50' : 'hover:bg-primary/20'
                )}
              >
                <div className="flex justify-between items-center">
                  <p className="font-semibold text-foreground truncate">{mail.sender}</p>
                  {!mail.read && <div className="w-2 h-2 rounded-full bg-accent flex-shrink-0"></div>}
                </div>
                <p className="text-sm text-foreground truncate">{mail.subject}</p>
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>
      <div className="flex-1 p-4">
        {selectedMail ? (
          <ScrollArea className="h-full pr-4">
            <div className="flex flex-col gap-4">
              <h1 className="text-2xl font-bold text-foreground">{selectedMail.subject}</h1>
              <Separator />
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarFallback className="bg-secondary">{selectedMail.sender.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-semibold text-foreground">{selectedMail.sender}</p>
                  <p className="text-sm text-muted-foreground">to: You</p>
                </div>
              </div>
              <Separator />
              <p className="text-foreground whitespace-pre-wrap leading-relaxed">{selectedMail.body}</p>
            </div>
          </ScrollArea>
        ) : (
          <div className="flex h-full items-center justify-center text-muted-foreground">
            <p>Select an email to read.</p>
          </div>
        )}
      </div>
    </div>
  );
}
