
"use client";

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { BrainCircuit, Code, Rocket } from 'lucide-react';

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

export function XenovaDev() {
  return (
    <div className="h-full w-full p-4 flex flex-col gap-4">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3">
            <BrainCircuit className="w-8 h-8 text-accent"/>
            <h1 className="text-2xl font-bold font-headline tracking-wider">XenovaDEV</h1>
        </div>
        <Button disabled>
            <Rocket className="mr-2"/>
            Publish to App Store
        </Button>
      </div>
      <Tabs defaultValue="ai-creator" className="flex-1 flex flex-col">
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
                <CardDescription>Describe the app you want to build in plain English.</CardDescription>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col gap-4">
              <Textarea 
                placeholder="e.g., 'A simple pomodoro timer app with a start, stop, and reset button.'"
                className="flex-1 bg-black/20 text-base resize-none"
              />
              <Button size="lg" disabled>Generate App</Button>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="code-editor" className="flex-1 mt-2">
             <Card className="h-full bg-transparent border-primary/20 flex flex-col">
                <CardHeader>
                    <CardTitle>Code Editor</CardTitle>
                    <CardDescription>Write your application code using React and TypeScript.</CardDescription>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col gap-4">
                    <Textarea 
                        defaultValue={placeholderCode}
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
