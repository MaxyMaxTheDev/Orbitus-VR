
"use client";

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Mail, Trophy, Bot, CheckCircle, AlertTriangle, Trash2, Bell, X } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

const iconComponents: { [key: string]: LucideIcon } = {
  Mail,
  Trophy,
  Bot,
  CheckCircle,
  AlertTriangle,
  Bell,
};

const iconColorMap: Record<string, string> = {
  Mail: 'text-blue-400',
  Trophy: 'text-yellow-400',
  Bot: 'text-teal-400',
  CheckCircle: 'text-green-400',
  AlertTriangle: 'text-orange-400',
  Bell: 'text-foreground'
};

type Notification = {
  id: number;
  icon: keyof typeof iconComponents;
  title: string;
  description: string;
  timestamp: string;
  read: boolean;
};

const initialNotifications: Notification[] = [
  {
    id: 1,
    icon: 'Mail',
    title: 'New Mail from SynthRider',
    description: 'New track is fire!',
    timestamp: '5m ago',
    read: false,
  },
  {
    id: 2,
    icon: 'Trophy',
    title: 'Achievement Unlocked',
    description: 'You guessed the number in under 5 attempts!',
    timestamp: '1h ago',
    read: false,
  },
  {
    id: 3,
    icon: 'Bot',
    title: 'AI Insight Ready',
    description: 'A new quote of the day has been generated.',
    timestamp: '3h ago',
    read: true,
  },
  {
    id: 4,
    icon: 'CheckCircle',
    title: 'Minecraft Installed',
    description: 'The game is now available in your App Library.',
    timestamp: '1d ago',
    read: true,
  },
  {
    id: 5,
    icon: 'AlertTriangle',
    title: 'System Alert',
    description: 'High memory usage detected in SculptVR.',
    timestamp: '2d ago',
    read: true,
  },
];

export function NotificationsApp() {
  const [notifications, setNotifications] = useState<Notification[]>(initialNotifications);

  const markAsRead = (id: number) => {
    setNotifications(
      notifications.map(n => (n.id === id ? { ...n, read: true } : n))
    );
  };
  
  const deleteNotification = (id: number, e: React.MouseEvent) => {
    e.stopPropagation(); // prevent markAsRead from firing
    setNotifications(notifications.filter(n => n.id !== id));
  };

  const clearAll = () => {
    setNotifications([]);
  };

  return (
    <div className="h-full w-full p-4 flex justify-center">
      <TooltipProvider>
        <Card className="w-full max-w-3xl h-full flex flex-col bg-transparent border-primary/30">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-accent text-xl tracking-wider flex items-center gap-2">
              <Bell />
              Notifications
            </CardTitle>
            <Button variant="ghost" size="sm" onClick={clearAll} disabled={notifications.length === 0}>
              <Trash2 className="mr-2 h-4 w-4" />
              Clear All
            </Button>
          </CardHeader>
          <CardContent className="flex-1 overflow-hidden p-2">
            <ScrollArea className="h-full pr-2">
              {notifications.length > 0 ? (
                <div className="space-y-3">
                  {notifications.map((notification) => {
                    const Icon = iconComponents[notification.icon] || Bell;
                    return (
                    <div
                      key={notification.id}
                      className={cn(
                        'flex items-start gap-4 p-4 rounded-lg transition-colors duration-200 border group relative',
                        notification.read ? 'bg-black/10 border-transparent' : 'bg-primary/10 border-primary/30'
                      )}
                      onClick={() => markAsRead(notification.id)}
                    >
                      <div className="flex-shrink-0 mt-1">
                          <Icon className={cn("w-6 h-6", iconColorMap[notification.icon] || 'text-foreground')} />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-foreground">{notification.title}</h4>
                        <p className="text-sm text-muted-foreground">{notification.description}</p>
                      </div>
                      <div className="text-xs text-muted-foreground whitespace-nowrap">
                        {notification.timestamp}
                      </div>

                      <Tooltip>
                        <TooltipTrigger asChild>
                           <Button 
                                variant="ghost" 
                                size="icon" 
                                className="absolute top-1 right-1 h-6 w-6 rounded-full opacity-0 group-hover:opacity-100 hover:bg-destructive/20 hover:text-destructive"
                                onClick={(e) => deleteNotification(notification.id, e)}
                            >
                                <X className="w-4 h-4" />
                           </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                           <p>Dismiss</p>
                        </TooltipContent>
                      </Tooltip>
                    </div>
                    )
                })}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-muted-foreground gap-3">
                  <Bell className="w-20 h-20 text-primary/20" />
                  <h3 className="text-lg font-semibold">All caught up!</h3>
                  <p>You have no new notifications.</p>
                </div>
              )}
            </ScrollArea>
          </CardContent>
        </Card>
      </TooltipProvider>
    </div>
  );
}
