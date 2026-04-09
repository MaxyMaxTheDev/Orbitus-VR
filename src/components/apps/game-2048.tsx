"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ShieldCheck, Play } from 'lucide-react';

const LICENSE_TEXT = `MIT License

Copyright (c) 2025 Rahul Parihar

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.`;

export function Game2048App() {
  const [hasAcceptedLicense, setHasAcceptedLicense] = useState(false);

  if (!hasAcceptedLicense) {
    return (
      <div className="h-full w-full flex items-center justify-center bg-black/40 p-4">
        <Card className="max-w-2xl w-full bg-card/90 border-primary/30 backdrop-blur-xl">
          <CardHeader className="flex flex-row items-center gap-3">
            <ShieldCheck className="w-8 h-8 text-accent" />
            <div>
              <CardTitle className="text-xl font-headline tracking-wider">License Agreement</CardTitle>
              <p className="text-xs text-muted-foreground">Please review and accept to continue</p>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <ScrollArea className="h-64 rounded-md border border-border p-4 bg-black/20">
              <pre className="text-xs font-mono whitespace-pre-wrap text-foreground/80 leading-relaxed">
                {LICENSE_TEXT}
              </pre>
            </ScrollArea>
            <div className="flex justify-end gap-4">
              <Button 
                onClick={() => setHasAcceptedLicense(true)} 
                className="bg-accent hover:bg-accent/80 text-accent-foreground font-bold"
              >
                <Play className="mr-2 w-4 h-4" />
                Accept & Start Game
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="w-full h-full bg-[#faf8ef] flex items-center justify-center">
      <div className="relative w-full h-full max-w-[500px] max-h-[700px] shadow-2xl shadow-black/20">
        <iframe
          src="https://parihar-dev.github.io/2048-Online-Game/"
          className="w-full h-full border-0"
          title="2048"
          sandbox="allow-scripts allow-same-origin allow-forms"
        />
      </div>
    </div>
  );
}
