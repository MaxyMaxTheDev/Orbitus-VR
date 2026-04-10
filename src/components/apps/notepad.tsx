"use client";

import { useState, useEffect } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { get, set } from '@/lib/idb';
import { Save, Loader2, AlertCircle } from 'lucide-react';
import { useSettings } from '@/contexts/settings-context';

const STORAGE_KEY = 'notepad-content';

export function NotepadApp() {
  const [content, setContent] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();
  const { isGuest } = useSettings();

  useEffect(() => {
    const loadContent = async () => {
      try {
        const savedContent = await get<string>(STORAGE_KEY);
        if (savedContent) {
          setContent(savedContent);
        }
      } catch (error) {
        console.error("Failed to load note:", error);
        toast({
          variant: 'destructive',
          title: 'Error',
          description: 'Could not load your saved note.',
        });
      } finally {
        setIsLoading(false);
      }
    };
    loadContent();
  }, [toast]);

  const handleSave = async () => {
    if (isGuest) {
        toast({
            variant: 'destructive',
            icon: <AlertCircle className="w-5 h-5"/>,
            title: 'Guest Mode',
            description: 'Persistence is disabled for Guest accounts. Your notes will not be saved.',
        });
        return;
    }

    setIsSaving(true);
    try {
      await set(STORAGE_KEY, content);
      toast({
        title: 'Saved!',
        description: 'Your note has been saved successfully.',
      });
    } catch (error) {
      console.error("Failed to save note:", error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Could not save your note.',
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="h-full w-full flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-accent" />
      </div>
    );
  }

  return (
    <div className="h-full w-full p-4 flex flex-col gap-4">
      <Textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder={isGuest ? "Notes written here will disappear after your session..." : "Type your notes here..."}
        className="flex-1 bg-background/50 border-primary/30 focus:ring-accent resize-none text-base font-sans"
      />
      <div className="flex justify-between items-center">
        {isGuest && <p className="text-xs text-muted-foreground italic flex items-center gap-1"><AlertCircle className="w-3 h-3"/> Session-only mode</p>}
        <div className="flex-1" />
        <Button onClick={handleSave} disabled={isSaving} className="bg-accent hover:bg-accent/80">
          {isSaving ? <Loader2 className="animate-spin" /> : <Save />}
          Save Note
        </Button>
      </div>
    </div>
  );
}
