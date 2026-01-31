
"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BrainCircuit, Code, Rocket, Loader2, Folder, File, FileCode, FileJson, Play, Settings } from 'lucide-react';
import { useSettings } from '@/contexts/settings-context';
import { useToast } from '@/hooks/use-toast';
import { get, set } from '@/lib/idb';

const placeholderCode = `
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
};

// A static file tree for the navigator
const fileTree = [
    { name: 'MyAwesomeApp', icon: Folder, children: [
        { name: 'node_modules', icon: Folder },
        { name: 'public', icon: Folder },
        { name: 'src', icon: Folder, children: [
            { name: 'app.tsx', icon: FileCode },
            { name: 'styles.css', icon: File },
        ]},
        { name: 'package.json', icon: FileJson },
    ]}
];

const FileTreeItem = ({ name, icon: Icon, level = 0, children }: { name: string, icon: React.ElementType, level?: number, children?: any[] }) => {
    const isFolder = !!children;
    return (
        <div>
            <div className="flex items-center gap-2 py-1 pr-2 rounded hover:bg-primary/10 cursor-pointer" style={{ paddingLeft: `${level * 16}px`}}>
                <Icon className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                <span className="text-sm truncate">{name}</span>
            </div>
            {isFolder && (
                <div>
                    {children.map(child => <FileTreeItem key={child.name} {...child} level={level + 1} />)}
                </div>
            )}
        </div>
    )
}

export function XenovaDev() {
  const [appName, setAppName] = useState('');
  const [appDescription, setAppDescription] = useState('');
  const [activeTab, setActiveTab] = useState('ai-creator');

  const [aiPrompt, setAiPrompt] = useState("A simple pomodoro timer app with a start, stop, and reset button, on a dark background.");
  const [code, setCode] = useState(placeholderCode);

  const [isPublishing, setIsPublishing] = useState(false);
  const { username } = useSettings();
  const { toast } = useToast();

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
              ...(activeTab === 'code-editor' && { code }),
              ...(activeTab === 'ai-creator' && { aiPrompt }),
          };

          await set('published-apps', [...existingApps, newApp]);

          toast({
              title: 'App Published!',
              description: `"${appName}" is now available in the App Store for everyone to see.`,
          });
          setAppName('');
          setAppDescription('');

      } catch (error) {
          toast({
              variant: 'destructive',
              title: 'Publishing Failed',
              description: 'There was an error publishing your app.',
          });
          console.error(error);
      } finally {
          setIsPublishing(false);
      }
  };

  return (
    <div className="h-full w-full flex flex-col bg-card/50 text-sm">
        {/* Toolbar */}
        <header className="flex-shrink-0 h-12 flex items-center justify-between px-4 border-b border-border bg-background/50">
            <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                    <BrainCircuit className="w-5 h-5 text-accent"/>
                    <h1 className="text-base font-bold font-headline tracking-wider">XenovaDEV</h1>
                </div>
                 <div className="flex items-center gap-1">
                    <Button variant="ghost" size="icon" className="w-8 h-8"><Play className="w-4 h-4"/></Button>
                    <Button variant="ghost" size="icon" className="w-8 h-8"><Settings className="w-4 h-4"/></Button>
                 </div>
            </div>
            <Button onClick={handlePublish} disabled={isPublishing} size="sm">
                {isPublishing ? <Loader2 className="mr-2 animate-spin" /> : <Rocket className="mr-2"/>}
                Publish
            </Button>
        </header>

        {/* Main Content */}
        <main className="flex-1 grid grid-cols-[240px_minmax(0,1fr)_300px] overflow-hidden">
            
            {/* Left Navigator */}
            <div className="border-r border-border bg-background/30 p-2 overflow-y-auto">
                <h2 className="text-xs font-bold text-muted-foreground px-2 py-1 uppercase">Navigator</h2>
                {fileTree.map(item => <FileTreeItem key={item.name} {...item} />)}
            </div>

            {/* Center Editor */}
            <div className="flex flex-col">
                <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col overflow-hidden">
                    <TabsList className="m-2">
                        <TabsTrigger value="ai-creator" className="flex-1">
                            <BrainCircuit className="mr-2" />
                            AI Creator
                        </TabsTrigger>
                        <TabsTrigger value="code-editor" className="flex-1">
                            <Code className="mr-2" />
                            Code Editor
                        </TabsTrigger>
                    </TabsList>
                    <TabsContent value="ai-creator" className="flex-1 m-2 mt-0 rounded-lg overflow-hidden">
                        <Textarea 
                            value={aiPrompt}
                            onChange={(e) => setAiPrompt(e.target.value)}
                            placeholder="Describe the app you want to build..."
                            className="w-full h-full bg-black/50 border-0 text-base resize-none focus-visible:ring-0 focus-visible:ring-offset-0"
                        />
                    </TabsContent>
                    <TabsContent value="code-editor" className="flex-1 m-2 mt-0 rounded-lg overflow-hidden">
                        <Textarea 
                            value={code}
                            onChange={(e) => setCode(e.target.value)}
                            placeholder="// Your React component code here"
                            className="w-full h-full bg-black/50 border-0 font-mono text-xs resize-none focus-visible:ring-0 focus-visible:ring-offset-0"
                        />
                    </TabsContent>
                </Tabs>
            </div>

            {/* Right Inspector */}
            <div className="border-l border-border bg-background/30 p-4 space-y-6 overflow-y-auto">
                <div>
                    <h2 className="text-xs font-bold text-muted-foreground px-2 py-1 uppercase">Identity</h2>
                    <div className="p-4 space-y-4 rounded-lg bg-black/20 mt-1">
                        <div>
                            <Label htmlFor="app-name">App Name</Label>
                            <Input 
                                id="app-name"
                                placeholder="My Awesome App"
                                value={appName}
                                onChange={(e) => setAppName(e.target.value)}
                                className="bg-background"
                            />
                        </div>
                        <div>
                            <Label htmlFor="app-desc">Description</Label>
                            <Textarea 
                                id="app-desc"
                                placeholder="A short description of what your app does."
                                value={appDescription}
                                onChange={(e) => setAppDescription(e.target.value)}
                                className="bg-background h-24 resize-none"
                            />
                        </div>
                    </div>
                </div>

                <div>
                    <h2 className="text-xs font-bold text-muted-foreground px-2 py-1 uppercase">Deployment</h2>
                     <div className="p-4 space-y-4 rounded-lg bg-black/20 mt-1">
                        <div className="text-sm">
                            <p className="font-medium">Status</p>
                            <p className="text-muted-foreground">Not Published</p>
                        </div>
                        <div className="text-sm">
                            <p className="font-medium">Creator</p>
                            <p className="text-muted-foreground">{username}</p>
                        </div>
                     </div>
                </div>
            </div>
        </main>
    </div>
  );
}
