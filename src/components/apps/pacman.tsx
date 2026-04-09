
"use client";

import { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';

export function PacmanApp() {
  const [htmlContent, setHtmlContent] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchGame = async () => {
      try {
        const url = 'https://raw.githubusercontent.com/MaxyMaxTheDev/pacman/refs/heads/main/index.html';
        const response = await fetch(url);
        if (!response.ok) throw new Error('Failed to fetch PAC-MAN source.');
        let text = await response.text();
        
        // Use raw.githack.com as base to ensure relative JS/CSS files load with correct MIME types
        const baseTag = `<base href="https://raw.githack.com/MaxyMaxTheDev/pacman/main/">`;
        
        if (text.includes('<head>')) {
            text = text.replace('<head>', `<head>${baseTag}`);
        } else if (text.includes('<html>')) {
            text = text.replace('<html>', `<html><head>${baseTag}</head>`);
        } else {
            text = baseTag + text;
        }

        setHtmlContent(text);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchGame();
  }, []);

  if (loading) {
    return (
      <div className="w-full h-full bg-black flex items-center justify-center">
        <Loader2 className="w-12 h-12 animate-spin text-yellow-400" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full h-full bg-black flex items-center justify-center p-4 text-center">
        <div className="space-y-2">
            <p className="text-destructive font-headline text-lg uppercase tracking-widest">Source Error</p>
            <p className="text-muted-foreground text-sm">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full bg-black flex items-center justify-center">
      <div className="relative w-full max-w-[600px] aspect-[4/3] shadow-2xl shadow-yellow-500/10">
        <iframe
          srcDoc={htmlContent}
          className="w-full h-full border-0 rounded-lg"
          title="PAC-MAN"
          sandbox="allow-scripts allow-same-origin allow-forms"
        />
      </div>
    </div>
  );
}
