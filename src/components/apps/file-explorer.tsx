
"use client";

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Folder, File, Server, Home, FileText } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { allApps } from '@/lib/apps-config';
import { useDesktopActions } from '@/contexts/desktop-actions-context';
import { useToast } from '@/hooks/use-toast';

type FileSystemItem = {
  name: string;
  type: 'folder' | 'file';
  size: string;
  lastModified: string;
  content?: string;
};

const mockFileSystem: Record<string, FileSystemItem[]> = {
  root: [
    { name: 'apps', type: 'folder', size: '1.2 GB', lastModified: '2099-03-15' },
    { name: 'system', type: 'folder', size: '4.5 GB', lastModified: '2099-03-14' },
    { name: 'users', type: 'folder', size: '8.7 GB', lastModified: '2099-03-16' },
    { name: 'README.txt', type: 'file', size: '2 KB', lastModified: '2099-01-01', content: 'Welcome to XenovaVR.\n\nThis is a virtual operating system designed to be a customizable home environment.\nUse the dock below to launch applications and explore your new digital world.' },
  ],
  apps: [
    { name: 'Browser.app', type: 'file', size: '150 MB', lastModified: '2099-03-12' },
    { name: 'SculptVR.app', type: 'file', size: '320 MB', lastModified: '2099-03-10' },
    { name: 'Theme Studio.app', type: 'file', size: '50 MB', lastModified: '2099-03-11' },
    { name: 'System Monitor.app', type: 'file', size: '120 MB', lastModified: '2099-03-13' },
  ],
  system: [
    { name: 'kernel.bin', type: 'file', size: '2.1 GB', lastModified: '2099-03-14', content: '01001011 01000101 01010010 01001110 01000101 01001100\n494e4954 2e2e2e2e 564f4944 2e2e2e2e 4c4f4144 494e47\n... [BINARY DATA REDACTED FOR SECURITY] ...' },
    { name: 'boot.log', type: 'file', size: '512 KB', lastModified: '2099-03-14', content: '[0.0001] XenovaVR Kernel v3.14 initializing...\n[0.0002] Aetheric interface online.\n[0.0003] Quantum entanglement module loaded.\n[0.0004] Loading user profile: NexusUser\n[0.0005] All systems nominal. Welcome to the future.' },
    { name: 'drivers', type: 'folder', size: '1.8 GB', lastModified: '2099-03-13' },
  ],
  users: [
    { name: 'NexusUser', type: 'folder', size: '5.2 GB', lastModified: '2099-03-16' },
    { name: 'Guest', type: 'folder', size: '128 KB', lastModified: '2099-03-16' },
  ],
  NexusUser: [
    { name: 'documents', type: 'folder', size: '1.1 GB', lastModified: '2099-03-15'},
    { name: 'holorecordings', type: 'folder', size: '4.1 GB', lastModified: '2099-03-16'},
    { name: 'config.ini', type: 'file', size: '5 KB', lastModified: '2099-03-16', content: '[Settings]\nTheme=Dark\nAccent=Blue\nHandCursors=true' },
  ],
  documents: [
      { name: 'project_phoenix.txt', type: 'file', size: '12 KB', lastModified: '2099-02-28', content: 'Project Phoenix - Top Secret\n\nPhase 1: Complete\nPhase 2: In Progress\n\nNotes: The simulation is more stable than anticipated. The subjects are adapting well to the virtual environment.'}
  ],
  holorecordings: [],
  drivers: [],
  Guest: [],
};

export function FileExplorer() {
  const [currentPath, setCurrentPath] = useState<string[]>(['root']);
  const [viewingFile, setViewingFile] = useState<FileSystemItem | null>(null);
  const { openApp } = useDesktopActions();
  const { toast } = useToast();
  
  const currentDirectory = currentPath[currentPath.length - 1];
  const items = mockFileSystem[currentDirectory as keyof typeof mockFileSystem] || [];

  const navigateTo = (folderName: string) => {
    if (mockFileSystem[folderName as keyof typeof mockFileSystem]) {
        setCurrentPath([...currentPath, folderName]);
    }
  };

  const navigateUp = (index: number) => {
    setCurrentPath(currentPath.slice(0, index + 1));
  };
  
  const handleDoubleClick = (item: FileSystemItem) => {
    if (item.type === 'folder') {
      navigateTo(item.name);
    } else if (item.name.endsWith('.app')) {
      const appName = item.name.replace('.app', '');
      const appExists = allApps.some(app => app.name === appName);
      if (appExists) {
        openApp(appName);
      } else {
        toast({
            variant: "destructive",
            title: "Application Not Found",
            description: `The app "${appName}" could not be found in your library.`
        });
      }
    } else {
      setViewingFile(item);
    }
  };

  return (
    <div className="h-full w-full p-4 flex flex-col">
      <div className="flex-shrink-0 mb-4 p-2 rounded-lg bg-black/20 flex items-center gap-2 text-sm">
        {currentPath.map((part, index) => (
          <div key={index} className="flex items-center gap-2">
            <button
              onClick={() => navigateUp(index)}
              className="hover:underline text-accent flex items-center gap-1"
            >
              {part === 'root' ? <Home className="w-4 h-4" /> : part}
            </button>
            {index < currentPath.length - 1 && <span className="text-muted-foreground">/</span>}
          </div>
        ))}
      </div>

      <Card className="flex-1 bg-transparent border-primary/30 overflow-hidden">
        <ScrollArea className="h-full">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead>Name</TableHead>
                <TableHead className="text-right">Size</TableHead>
                <TableHead className="text-right">Last Modified</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map(item => (
                <TableRow 
                  key={item.name} 
                  onDoubleClick={() => handleDoubleClick(item)}
                  className="cursor-pointer"
                >
                  <TableCell className="font-medium flex items-center gap-2">
                    {item.type === 'folder' ? <Folder className="text-accent w-5 h-5" /> : <File className="w-5 h-5 text-muted-foreground"/>}
                    {item.name}
                  </TableCell>
                  <TableCell className="text-right">{item.size}</TableCell>
                  <TableCell className="text-right">{item.lastModified}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </ScrollArea>
      </Card>

      <Dialog open={viewingFile !== null} onOpenChange={(isOpen) => !isOpen && setViewingFile(null)}>
        <DialogContent className="max-w-2xl h-[70vh] flex flex-col bg-card/90 backdrop-blur-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-accent">
                <FileText className="w-5 h-5" />
                {viewingFile?.name}
            </DialogTitle>
            <DialogDescription>
                Size: {viewingFile?.size} | Last Modified: {viewingFile?.lastModified}
            </DialogDescription>
          </DialogHeader>
          <div className="flex-1 overflow-hidden p-1 rounded-lg bg-black/30 border border-primary/20 mt-2">
            <ScrollArea className="h-full w-full">
              <pre className="p-4 text-sm text-foreground whitespace-pre-wrap font-mono">
                <code>
                  {viewingFile?.content || "File is empty or content cannot be displayed."}
                </code>
              </pre>
            </ScrollArea>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
