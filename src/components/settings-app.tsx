
"use client";

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { ImportModelDialog } from '@/components/settings-panel';
import { useSettings } from '@/contexts/settings-context';

export function SettingsApp() {
  const { showAppBanners, setShowAppBanners } = useSettings();
  const [isSpatialAudio, setIsSpatialAudio] = useState(true);
  const [showHandCursors, setShowHandCursors] = useState(true);
  const [enableHaptics, setEnableHaptics] = useState(false);

  return (
    <div className="h-full w-full p-4 sm:p-6 overflow-y-auto">
      <div className="max-w-2xl mx-auto space-y-8">
        <Card className="bg-transparent border-primary/30">
          <CardHeader>
            <CardTitle className="text-accent text-xl">Audio Settings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between p-4 rounded-lg bg-black/20">
              <Label htmlFor="spatial-audio" className="text-lg font-medium">
                Spatial Audio
              </Label>
              <Switch
                id="spatial-audio"
                checked={isSpatialAudio}
                onCheckedChange={setIsSpatialAudio}
                className="data-[state=checked]:bg-accent"
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
            <div className="flex items-center justify-between p-4 rounded-lg bg-black/20">
              <Label htmlFor="hand-cursors" className="text-lg font-medium">
                Show Hand Cursors
              </Label>
              <Switch
                id="hand-cursors"
                checked={showHandCursors}
                onCheckedChange={setShowHandCursors}
                className="data-[state=checked]:bg-accent"
              />
            </div>
            <div className="flex items-center justify-between p-4 rounded-lg bg-black/20">
              <Label htmlFor="haptics" className="text-lg font-medium">
                Enable Haptics (Controller)
              </Label>
              <Switch
                id="haptics"
                checked={enableHaptics}
                onCheckedChange={setEnableHaptics}
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
