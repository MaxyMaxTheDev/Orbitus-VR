
"use client";

import { useState } from 'react';
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
import { useSettings, type NotificationPosition, type WidgetName } from '@/contexts/settings-context';
import { clearAll } from '@/lib/idb';
import { Trash2, Maximize, Save, Loader2, LayoutDashboard, Download } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Slider } from '../ui/slider';
import { useToast } from '@/hooks/use-toast';
import { useDesktopActions } from '@/contexts/desktop-actions-context';
import { useUpdate } from '@/contexts/update-context';

export function SettingsApp() {
  const {
    showAppBanners,
    setShowAppBanners,
    username: currentUsername,
    setUsername: setContextUsername,
    notificationPosition,
    setNotificationPosition,
    uiScale,
    setUiScale,
    setIsEditingDashboard,
  } = useSettings();

  const [newUsername, setNewUsername] = useState(currentUsername);
  const { toast } = useToast();
  const { openApp } = useDesktopActions();
  const { updateAvailable, startUpdate } = useUpdate();

  const handleUsernameSave = () => {
    const nextUsername = newUsername.trim();
    if (!nextUsername || nextUsername === currentUsername) {
      return;
    }
    // Identity lives at Google, so the display name is just a local setting
    // now: there is no profile record on a server to write it back to.
    setContextUsername(nextUsername);
    toast({
      title: 'Success',
      description: `Your username has been updated to ${nextUsername} on this device.`,
    });
  };

  const handlePowerwash = async () => {
    try {
      await clearAll();
      window.location.reload();
    } catch (error) {
      console.error('Failed to clear data:', error);
    }
  };
  
  const handleEditWidgets = () => {
    setIsEditingDashboard(true);
    openApp('Dashboard');
  };

  return (
    <div className="h-full w-full p-4 sm:p-6 overflow-y-auto">
      <div className="max-w-2xl mx-auto space-y-8">
        {updateAvailable && (
          <Card className="border-accent/60 bg-accent/5">
            <CardHeader>
              <CardTitle className="text-accent text-xl flex items-center gap-2">
                <Download className="w-5 h-5" />
                Update Available
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between gap-4 p-4 rounded-lg bg-black/20">
                <p className="text-sm text-muted-foreground">
                  A new version of OrbitusVR has been deployed. Updating will
                  restart the system.
                </p>
                <Button onClick={startUpdate} className="shrink-0">
                  <Download className="mr-2" />
                  Update
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        <Card className="bg-transparent border-primary/30">
          <CardHeader>
            <CardTitle className="text-accent text-xl">Profile</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 p-4 rounded-lg bg-black/20">
              <Label htmlFor="username" className="font-medium">
                Username
              </Label>
              <div className="flex items-center gap-2">
                <Input
                  id="username"
                  value={newUsername}
                  onChange={(e) => setNewUsername(e.target.value)}
                  className="bg-black/30 border-primary/50"
                />
                <Button
                  onClick={handleUsernameSave}
                  disabled={!newUsername.trim() || newUsername.trim() === currentUsername}
                >
                  <Save className="mr-2" />
                  Save
                </Button>
              </div>
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
              <Label htmlFor="show-banners" className="font-medium">
                Show App Banners
              </Label>
              <Switch
                id="show-banners"
                checked={showAppBanners}
                onCheckedChange={setShowAppBanners}
                className="data-[state=checked]:bg-accent"
              />
            </div>
             <div className="space-y-2 p-4 rounded-lg bg-black/20">
              <Label
                htmlFor="ui-scale"
                className="font-medium"
              >
                UI Scale ({uiScale}%)
              </Label>
               <div className="flex justify-between items-center gap-4 text-muted-foreground">
                    <Maximize className="w-4 h-4" />
                    <Slider
                        id="ui-scale"
                        value={[uiScale]}
                        onValueChange={(value) =>
                          setUiScale(value[0])
                        }
                        min={75}
                        max={125}
                        step={5}
                    />
                    <Maximize className="w-6 h-6" />
                </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-transparent border-primary/30">
          <CardHeader>
              <CardTitle className="text-accent text-xl">Dashboard</CardTitle>
          </CardHeader>
          <CardContent>
              <div className="flex items-center justify-between p-4 rounded-lg bg-black/20">
                  <div>
                      <Label className="font-medium">Customize Widgets</Label>
                      <p className="text-sm text-muted-foreground mt-1">
                          Add, remove, and rearrange widgets.
                      </p>
                  </div>
                  <Button onClick={handleEditWidgets}>
                      <LayoutDashboard className="mr-2" />
                      Edit Widgets
                  </Button>
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
              <Label className="font-medium">
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
                  This will delete all your data and restore OrbitusVR to its
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

    
