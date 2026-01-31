
"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { BrainCircuit, Code, Rocket, Loader2 } from 'lucide-react';
import { useSettings } from '@/contexts/settings-context';
import { useToast } from '@/hooks/use-toast';
import { get, set } from '@/lib/idb';

const placeholderCode = `
import {createElement} from 'react';

function MyNewApp() {
    return createElement(
        'div',
        {className: 'h-full w-full flex items-center justify-center'},
        'Hello from my new app!'
    );
}
`.trim();

export type UserApp = {
    name: string;
    description: string;
    creator: string;
    code?: string;
    aiPrompt?: string;
};

export function XenovaDev() {
  const [appName, setAppName] = useState('');
  const [appDescription, setAppDescription] = useState('');
  const [activeTab, setActiveTab] = useState('ai-creator');

  const [aiPrompt, setAiPrompt] = useState("A simple pomodoro timer app with a start, stop, and reset button.");
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
    <div className="h-full w-full p-4 flex flex-col gap-4">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3">
            <BrainCircuit className="w-8 h-8 text-accent"/>
            <h1 className="text-2xl font-bold font-headline tracking-wider">XenovaDEV</h1>
        </div>
        <Button onClick={handlePublish} disabled={isPublishing}>
            {isPublishing ? <Loader2 className="mr-2 animate-spin" /> : <Rocket className="mr-2"/>}
            Publish to App Store
        </Button>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
          <div>
              <Label htmlFor="app-name">App Name</Label>
              <Input 
                id="app-name"
                placeholder="My Awesome App"
                value={appName}
                onChange={(e) => setAppName(e.target.value)}
                className="bg-black/20"
              />
          </div>
          <div>
              <Label htmlFor="app-desc">App Description</Label>
              <Input 
                id="app-desc"
                placeholder="A short description of what your app does."
                value={appDescription}
                onChange={(e) => setAppDescription(e.target.value)}
                className="bg-black/20"
              />
          </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="ai-creator">
            <BrainCircuit className="mr-2" />
            AI Creator
          </TabsTrigger>
          <TabsTrigger value="code-editor">
            <Code className="mr-2" />
            Code Editor
          </TabsTrigger>
        </TabsList>
        <TabsContent value="ai-creator" className="flex-1 mt-2">
          <Card className="h-full bg-transparent border-primary/20 flex flex-col">
            <CardHeader>
                <CardTitle>Create with AI</CardTitle>
                <CardDescription>Describe the app you want to build in plain English. The AI will generate the code for you.</CardDescription>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col gap-4">
              <Textarea 
                value={aiPrompt}
                onChange={(e) => setAiPrompt(e.target.value)}
                className="flex-1 bg-black/20 text-base resize-none"
              />
              <Button size="lg" disabled>Generate Code</Button>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="code-editor" className="flex-1 mt-2">
             <Card className="h-full bg-transparent border-primary/20 flex flex-col">
                <CardHeader>
                    <CardTitle>Code Editor</CardTitle>
                    <CardDescription>Write your application code using React and TypeScript. (Note: Running code is not yet implemented).</CardDescription>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col gap-4">
                    <Textarea 
                        value={code}
                        onChange={(e) => setCode(e.target.value)}
                        className="flex-1 bg-black/20 font-mono text-xs resize-none"
                    />
                    <Button size="lg" disabled>Run App</Button>
                </CardContent>
            </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
