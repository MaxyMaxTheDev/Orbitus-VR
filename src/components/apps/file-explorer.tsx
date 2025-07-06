"use client";

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Folder, File, Server, Home } from 'lucide-react';

type FileSystemItem = {
  name: string;
  type: 'folder' | 'file';
  size: string;
  lastModified: string;
};

const mockFileSystem: Record<string, FileSystemItem[]> = {
  root: [
    { name: 'apps', type: 'folder', size: '1.2 GB', lastModified: '2099-03-15' },
    { name: 'system', type: 'folder', size: '4.5 GB', lastModified: '2099-03-14' },
    { name: 'users', type: 'folder', size: '8.7 GB', lastModified: '2099-03-16' },
  ],
  apps: [
    { name: 'Browser.app', type: 'folder', size: '150 MB', lastModified: '2099-03-12' },
    { name: 'SculptVR.app', type: 'folder', size: '320 MB', lastModified: '2099-03-10' },
    { name: 'ThemeStudio.app', type: 'folder', size: '50 MB', lastModified: '2099-03-11' },
  ],
  system: [
    { name: 'kernel.bin', type: 'file', size: '2.1 GB', lastModified: '2099-03-14' },
    { name: 'boot.log', type: 'file', size: '512 KB', lastModified: '2099-03-14' },
    { name: 'drivers', type: 'folder', size: '1.8 GB', lastModified: '2099-03-13' },
  ],
  users: [
    { name: 'NexusUser', type: 'folder', size: '5.2 GB', lastModified: '2099-03-16' },
    { name: 'Guest', type: 'folder', size: '128 KB', lastModified: '2099-03-16' },
  ],
};

export function FileExplorer() {
  const [currentPath, setCurrentPath] = useState<string[]>(['root']);
  
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
                  onDoubleClick={item.type === 'folder' ? () => navigateTo(item.name) : undefined}
                  className={item.type === 'folder' ? 'cursor-pointer' : ''}
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
    </div>
  );
}
