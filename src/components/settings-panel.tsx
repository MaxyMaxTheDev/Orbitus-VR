"use client";

import { useState } from 'react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetDescription,
} from '@/components/ui/sheet';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { UploadCloud, HardDriveUpload } from 'lucide-react';

export function SettingsPanel({ children }: { children: React.ReactNode }) {
  const [isSpatialAudio, setIsSpatialAudio] = useState(true);

  return (
    <Sheet>
      <SheetTrigger asChild>{children}</SheetTrigger>
      <SheetContent className="bg-background/80 backdrop-blur-xl border-primary/30 text-foreground">
        <SheetHeader>
          <SheetTitle className="text-accent font-headline tracking-wider text-2xl">Settings</SheetTitle>
          <SheetDescription>Customize your NexusVR experience.</SheetDescription>
        </SheetHeader>
        <div className="grid gap-8 py-8">
          <div className="flex items-center justify-between p-4 rounded-lg bg-white/5">
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

          <div className="flex items-center justify-between p-4 rounded-lg bg-white/5">
            <Label className="text-lg font-medium">Custom Environment</Label>
            <ImportModelDialog />
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}

export function ImportModelDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="border-accent text-accent hover:bg-accent hover:text-accent-foreground">
          <HardDriveUpload className="mr-2 h-4 w-4" />
          Import
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] bg-background/90 backdrop-blur-xl border-primary/30 text-foreground">
        <DialogHeader>
          <DialogTitle className="text-accent font-headline">Import 3D Model</DialogTitle>
          <DialogDescription>
            Upload a .gltf or .glb file to customize your environment.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="flex items-center justify-center w-full">
            <label
              htmlFor="dropzone-file"
              className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-lg cursor-pointer border-border hover:border-accent hover:bg-white/5"
            >
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <UploadCloud className="w-10 h-10 mb-3 text-gray-400" />
                <p className="mb-2 text-sm text-gray-400">
                  <span className="font-semibold text-accent">Click to upload</span> or drag and drop
                </p>
                <p className="text-xs text-gray-500">GLTF, GLB (MAX. 10MB)</p>
              </div>
              <Input id="dropzone-file" type="file" className="hidden" />
            </label>
          </div>
        </div>
        <DialogFooter>
            <Button type="submit" className="bg-accent text-accent-foreground hover:bg-accent/80 w-full">Import</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
