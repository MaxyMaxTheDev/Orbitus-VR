
"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '../ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { ImportModelDialog } from '@/components/settings-panel';
import { useSettings, type NotificationPosition } from '@/contexts/settings-context';
import { clearAll } from '@/lib/idb';
import { Trash2 } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export function SettingsApp() {
  const {
    showAppBanners,
    setShowAppBanners,
    username,
    setUsername,
    notificationPosition,
    setNotificationPosition,
  } = useSettings();

  const handlePowerwash = async () => {
    try {
      await clearAll();
      window.location.reload();
    } catch (error) {
      console.error('Failed to clear data:', error);
      // In a real app, you might want to show a toast notification here
    }
  };

  return (
    <div className="h-full w-full p-4 sm:p-6 overflow-y-auto">
      <div className="max-w-2xl mx-auto space-y-8">
        <Card className="bg-transparent border-primary/30">
          <CardHeader>
            <CardTitle className="text-accent text-xl">Profile</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 p-4 rounded-lg bg-black/20">
              <Label htmlFor="username" className="font-medium">
                Username
              </Label>
              <Input
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="bg-black/30 border-primary/50"
              />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-transparent border-primary/30">
          <CardHeader>
            <CardTitle className="text-accent text-xl">
              Interface Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-4 rounded-lg bg-black/20">
              <Label htmlFor="show-banners" className="text-lg font-medium">
                Show App Banners
              </Label>
              <Switch
                id="show-banners"
                checked={showAppBanners}
                onCheckedChange={setShowAppBanners}
                className="data-[state=checked]:bg-accent"
              />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-transparent border-primary/30">
          <CardHeader>
            <CardTitle className="text-accent text-xl">
              Notification Settings
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 p-4 rounded-lg bg-black/20">
              <Label
                htmlFor="notification-position"
                className="font-medium"
              >
                Notification Position
              </Label>
              <Select
                value={notificationPosition}
                onValueChange={(value) =>
                  setNotificationPosition(value as NotificationPosition)
                }
              >
                <SelectTrigger
                  id="notification-position"
                  className="w-full bg-black/30 border-primary/50"
                >
                  <SelectValue placeholder="Select position" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="top-left">Top Left</SelectItem>
                  <SelectItem value="top-center">Top Center</SelectItem>
                  <SelectItem value="top-right">Top Right</SelectItem>
                  <SelectItem value="bottom-left">Bottom Left</SelectItem>
                  <SelectItem value="bottom-center">Bottom Center</SelectItem>
                  <SelectItem value="bottom-right">Bottom Right</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-transparent border-primary/30">
          <CardHeader>
            <CardTitle className="text-accent text-xl">Environment</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between p-4 rounded-lg bg-black/20">
              <Label className="text-lg font-medium">
                Custom Environment
              </Label>
              <ImportModelDialog />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-transparent border-destructive/50">
          <CardHeader>
            <CardTitle className="text-destructive text-xl">
              System Reset
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between p-4 rounded-lg bg-black/20">
              <div>
                <Label className="text-lg font-medium">Powerwash</Label>
                <p className="text-sm text-muted-foreground mt-1">
                  This will delete all your data and restore XenovaVR to its
                  factory state.
                </p>
              </div>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive">
                    <Trash2 className="mr-2" />
                    Factory Reset
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>
                      Are you absolutely sure?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. This will permanently delete
                      all your settings, including your username and
                      preferences. The application will restart and you will
                      see the initial setup screen.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={handlePowerwash}
                      className="bg-destructive hover:bg-destructive/90"
                    >
                      Confirm Reset
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
