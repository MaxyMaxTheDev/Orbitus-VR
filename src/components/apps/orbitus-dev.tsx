"use client";

import { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { 
    BrainCircuit, Code, Rocket, Loader2, Folder, File, 
    FileCode, FileJson, Play, Settings, FilePlus, 
    ChevronRight, ChevronDown 
} from 'lucide-react';
import { useSettings } from '@/contexts/settings-context';
import { useToast } from '@/hooks/use-toast';
import { get, set } from '@/lib/idb';
import { cn } from '@/lib/utils';

const DEFAULT_CODE = `
import {createElement} from 'react';

function MyNewApp() {
    return createElement(
        'div',
        {className: 'h-full w-full flex items-center justify-center bg-blue-900 text-white text-2xl'},
        'Hello from my new app!'
    );
}

// Important: Your component must be the default export.
export default MyNewApp;
`.trim();

export type UserApp = {
    name: string;
    description: string;
    creator: string;
    code?: string;
    aiPrompt?: string;
    files?: Record<string, string>;
};

type FileTreeNode = {
    name: string;
    path: string;
    icon: any;
    children?: FileTreeNode[];
};

export function OrbitusDev() {
  const [appName, setAppName] = useState('');
  const [appDescription, setAppDescription] = useState('');
  const [activeTab, setActiveTab] = useState('ai-creator');
  
  // Project State
  const [aiPrompt, setAiPrompt] = useState("A simple pomodoro timer app with a start, stop, and reset button, on a dark background.");
  const [selectedFilePath, setSelectedFilePath] = useState('src/app.tsx');
  const [files, setFiles] = useState<Record<string, string>>({
      'src/app.tsx': DEFAULT_CODE,
      'src/styles.css': '/* App styles */',
      'package.json': '{\n  "name": "my-awesome-app",\n  "version": "1.0.0"\n}',
  });

  const [isCreateFileDialogOpen, setIsCreateFileDialogOpen] = useState(false);
  const [newFileName, setNewFileName] = useState('');
  const [isPublishing, setIsPublishing] = useState(false);
  const { username } = useSettings();
  const { toast } = useToast();

  // File Tree Logic
  const fileTree = useMemo(() => {
      const root: FileTreeNode[] = [
          {
              name: 'src',
              path: 'src',
              icon: Folder,
              children: Object.keys(files)
                  .filter(f => f.startsWith('src/'))
                  .map(f => ({
                      name: f.replace('src/', ''),
                      path: f,
                      icon: f.endsWith('.tsx') || f.endsWith('.jsx') ? FileCode : File
                  }))
          },
          {
              name: 'package.json',
              path: 'package.json',
              icon: FileJson
          }
      ];
      return root;
  }, [files]);

  const handlePublish = async () => {
      if (!appName || !appDescription) {
          toast({
              variant: 'destructive',
              title: 'Missing Information',
              description: 'Please provide an app name and description before publishing.',
          });
          return;
      }
      setIsPublishing(true);
      try {
          const existingApps = await get<UserApp[]>('published-apps') || [];
          if (existingApps.some(app => app.name === appName)) {
              toast({
                  variant: 'destructive',
                  title: 'App Name Taken',
                  description: 'An app with this name has already been published. Please choose a different name.',
              });
              setIsPublishing(false);
              return;
          }

          const newApp: UserApp = {
              name: appName,
              description: appDescription,
              creator: username,
              code: files['src/app.tsx'], // Main entry point
              aiPrompt: activeTab === 'ai-creator' ? aiPrompt : undefined,
              files: files
          };

          await set('published-apps', [...existingApps, newApp]);

          toast({
              title: 'App Published!',
              description: `"${appName}" is now available in the App Store.`,
          });
          setAppName('');
          setAppDescription('');

      } catch (error) {
          toast({
              variant: 'destructive',
              title: 'Publishing Failed',
              description: 'There was an error publishing your app.',
          });
      } finally {
          setIsPublishing(false);
      }
  };

  const handleCreateFile = () => {
      const name = newFileName.trim();
      if (!name) return;
      
      const path = `src/${name}`;
      if (files[path]) {
          toast({ variant: 'destructive', title: 'Error', description: 'File already exists.' });
          return;
      }

      setFiles(prev => ({
          ...prev,
          [path]: `// New file: ${name}`
      }));
      setSelectedFilePath(path);
      setNewFileName('');
      setIsCreateFileDialogOpen(false);
      setActiveTab('code-editor');
  };

  const handleFileContentChange = (content: string) => {
      setFiles(prev => ({
          ...prev,
          [selectedFilePath]: content
      }));
  };

  const FileTreeItem = ({ item, level = 0 }: { item: FileTreeNode, level?: number }) => {
      const [isOpen, setIsOpen] = useState(true);
      const isSelected = selectedFilePath === item.path;
      const Icon = item.icon;

      return (
          <div>
              <div 
                  className={cn(
                      "flex items-center gap-2 py-1 pr-2 rounded hover:bg-primary/10 cursor-pointer text-xs transition-colors",
                      isSelected && "bg-primary/20 text-accent",
                      level > 0 && "ml-2"
                  )}
                  style={{ paddingLeft: `${level * 12}px`}}
                  onClick={() => {
                      if (item.children) {
                          setIsOpen(!isOpen);
                      } else {
                          setSelectedFilePath(item.path);
                          setActiveTab('code-editor');
                      }
                  }}
              >
                  {item.children ? (
                      isOpen ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />
                  ) : <div className="w-3" />}
                  <Icon className={cn("w-4 h-4", item.children ? "text-accent/70" : "text-muted-foreground")} />
                  <span className="truncate">{item.name}</span>
              </div>
              {item.children && isOpen && (
                  <div>
                      {item.children.map(child => <FileTreeItem key={child.path} item={child} level={level + 1} />)}
                  </div>
              )}
          </div>
      );
  };

  return (
    <div className="h-full w-full flex flex-col bg-card/50 text-sm overflow-hidden">
        {/* Toolbar */}
        <header className="flex-shrink-0 h-12 flex items-center justify-between px-4 border-b border-border bg-background/50 backdrop-blur-md">
            <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                    <BrainCircuit className="w-5 h-5 text-accent"/>
                    <h1 className="text-sm font-bold font-headline tracking-wider uppercase">OrbitusDEV</h1>
                </div>
                 <div className="flex items-center gap-1 bg-black/20 rounded-md p-0.5">
                    <Button variant="ghost" size="icon" className="w-8 h-8 hover:bg-green-500/20 text-green-500"><Play className="w-4 h-4"/></Button>
                    <div className="w-px h-4 bg-border mx-1" />
                    <Button variant="ghost" size="icon" className="w-8 h-8"><Settings className="w-4 h-4"/></Button>
                 </div>
            </div>
            <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono text-muted-foreground bg-black/20 px-2 py-1 rounded">v1.0.4-beta</span>
                <Button onClick={handlePublish} disabled={isPublishing} size="sm" className="bg-accent hover:bg-accent/80 text-accent-foreground">
                    {isPublishing ? <Loader2 className="mr-2 animate-spin w-4 h-4" /> : <Rocket className="mr-2 w-4 h-4"/>}
                    Publish
                </Button>
            </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 grid grid-cols-[240px_minmax(0,1fr)_300px] overflow-hidden">
            
            {/* Left Navigator (Xcode-like) */}
            <div className="border-r border-border bg-black/20 flex flex-col overflow-hidden">
                <div className="flex justify-between items-center px-4 py-3 border-b border-border/50">
                    <h2 className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Project Navigator</h2>
                    <Dialog open={isCreateFileDialogOpen} onOpenChange={setIsCreateFileDialogOpen}>
                        <DialogTrigger asChild>
                            <Button variant="ghost" size="icon" className="w-6 h-6 hover:bg-accent/20">
                                <FilePlus className="w-4 h-4 text-accent" />
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="bg-card border-border">
                            <DialogHeader>
                                <DialogTitle className="text-accent font-headline">New Source File</DialogTitle>
                            </DialogHeader>
                            <div className="py-4 space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="file-name">Filename</Label>
                                    <Input
                                        id="file-name"
                                        value={newFileName}
                                        onChange={(e) => setNewFileName(e.target.value)}
                                        placeholder="e.g., utils.tsx"
                                        autoFocus
                                        className="bg-black/30 border-border"
                                        onKeyDown={(e) => e.key === 'Enter' && handleCreateFile()}
                                    />
                                    <p className="text-[10px] text-muted-foreground italic">File will be created in /src</p>
                                </div>
                            </div>
                            <DialogFooter>
                                <Button variant="outline" onClick={() => setIsCreateFileDialogOpen(false)}>Cancel</Button>
                                <Button onClick={handleCreateFile} className="bg-accent text-accent-foreground">Create</Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </div>
                <div className="flex-1 overflow-y-auto p-2">
                    {fileTree.map(item => <FileTreeItem key={item.path} item={item} />)}
                </div>
            </div>

            {/* Center Editor */}
            <div className="flex flex-col bg-background/30">
                <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col overflow-hidden">
                    <div className="flex items-center justify-between px-2 bg-black/10 border-b border-border">
                        <TabsList className="h-9 bg-transparent border-0 gap-1">
                            <TabsTrigger value="ai-creator" className="data-[state=active]:bg-accent/10 data-[state=active]:text-accent text-[11px] h-7 px-4">
                                <BrainCircuit className="mr-2 w-3 h-3" />
                                AI Architect
                            </TabsTrigger>
                            <TabsTrigger value="code-editor" className="data-[state=active]:bg-accent/10 data-[state=active]:text-accent text-[11px] h-7 px-4">
                                <Code className="mr-2 w-3 h-3" />
                                Source Editor
                            </TabsTrigger>
                        </TabsList>
                        <div className="text-[10px] text-muted-foreground italic px-2">
                            {selectedFilePath}
                        </div>
                    </div>
                    
                    <TabsContent value="ai-creator" className="flex-1 m-0 p-0 rounded-none focus-visible:ring-0">
                        <Textarea 
                            value={aiPrompt}
                            onChange={(e) => setAiPrompt(e.target.value)}
                            placeholder="Describe the application features, layout, and logic..."
                            className="w-full h-full bg-transparent border-0 text-sm leading-relaxed p-6 resize-none focus-visible:ring-0"
                        />
                    </TabsContent>
                    
                    <TabsContent value="code-editor" className="flex-1 m-0 p-0 rounded-none focus-visible:ring-0">
                        <div className="relative h-full">
                            <div className="absolute left-0 top-0 bottom-0 w-10 bg-black/20 border-r border-border/30 flex flex-col items-center pt-4 text-[10px] text-muted-foreground select-none">
                                {Array.from({ length: 20 }).map((_, i) => (
                                    <div key={i} className="h-5">{i + 1}</div>
                                ))}
                            </div>
                            <Textarea 
                                value={files[selectedFilePath] || ''}
                                onChange={(e) => handleFileContentChange(e.target.value)}
                                placeholder="// Start coding..."
                                className="w-full h-full pl-12 bg-transparent border-0 font-mono text-[13px] p-4 resize-none focus-visible:ring-0 leading-5"
                            />
                        </div>
                    </TabsContent>
                </Tabs>
            </div>

            {/* Right Inspector (Xcode-like) */}
            <div className="border-l border-border bg-black/20 flex flex-col overflow-hidden">
                <div className="px-4 py-3 border-b border-border/50 bg-black/10">
                    <h2 className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Attributes Inspector</h2>
                </div>
                <div className="flex-1 overflow-y-auto p-4 space-y-6">
                    <section className="space-y-4">
                        <h3 className="text-[11px] font-semibold text-accent/80 flex items-center gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-accent" />
                            APP IDENTITY
                        </h3>
                        <div className="space-y-3 p-3 rounded-lg bg-black/30 border border-border/30">
                            <div className="space-y-1.5">
                                <Label htmlFor="app-name" className="text-[10px] text-muted-foreground">Product Name</Label>
                                <Input 
                                    id="app-name"
                                    placeholder="My Awesome App"
                                    value={appName}
                                    onChange={(e) => setAppName(e.target.value)}
                                    className="h-8 text-xs bg-background/50 border-border/50"
                                />
                            </div>
                            <div className="space-y-1.5">
                                <Label htmlFor="app-desc" className="text-[10px] text-muted-foreground">Description</Label>
                                <Textarea 
                                    id="app-desc"
                                    placeholder="Brief summary of functions..."
                                    value={appDescription}
                                    onChange={(e) => setAppDescription(e.target.value)}
                                    className="text-xs bg-background/50 border-border/50 min-h-[80px] resize-none"
                                />
                            </div>
                        </div>
                    </section>

                    <section className="space-y-4">
                        <h3 className="text-[11px] font-semibold text-accent/80 flex items-center gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-accent" />
                            TARGET INFO
                        </h3>
                        <div className="space-y-3 p-3 rounded-lg bg-black/30 border border-border/30">
                            <div className="flex justify-between text-[10px]">
                                <span className="text-muted-foreground">Team</span>
                                <span className="text-foreground font-medium">{username}</span>
                            </div>
                            <div className="flex justify-between text-[10px]">
                                <span className="text-muted-foreground">Deployment</span>
                                <span className="text-foreground font-medium">OrbitusVR 3.0+</span>
                            </div>
                            <div className="flex justify-between text-[10px]">
                                <span className="text-muted-foreground">Status</span>
                                <span className="text-yellow-500 font-medium">Ready to Build</span>
                            </div>
                        </div>
                    </section>
                </div>
            </div>
        </main>
    </div>
  );
}
