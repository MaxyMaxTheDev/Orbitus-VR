"use client";

import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Folder, File, Server, Home, FileText } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { allApps } from '@/lib/apps-config';
import { useDesktopActions } from '@/contexts/desktop-actions-context';
import { useToast } from '@/hooks/use-toast';
import { useSettings } from '@/contexts/settings-context';
import { FileSystemItem, getMockFileSystem } from '@/lib/orbitus-files';

export function FileExplorer() {
  const { username } = useSettings();
  const mockFileSystem = useMemo(() => getMockFileSystem(username), [username]);
  
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
