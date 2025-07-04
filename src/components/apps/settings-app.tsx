
"use client";

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { ImportModelDialog } from '@/components/settings-panel';
import { useSettings } from '@/contexts/settings-context';
import { Input } from '../ui/input';

export function SettingsApp() {
  const { showAppBanners, setShowAppBanners, username, setUsername } = useSettings();

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
            <CardTitle className="text-accent text-xl">Interface Settings</CardTitle>
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
            <CardTitle className="text-accent text-xl">Environment</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between p-4 rounded-lg bg-black/20">
                <Label className="text-lg font-medium">Custom Environment</Label>
                <ImportModelDialog />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
