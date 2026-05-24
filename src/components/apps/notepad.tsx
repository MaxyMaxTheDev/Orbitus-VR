"use client";

import { useState, useEffect, useMemo, useRef, type ChangeEvent } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { get, set } from '@/lib/idb';
import { Save, Loader2, AlertCircle, Upload, Files, Laptop } from 'lucide-react';
import { useSettings } from '@/contexts/settings-context';
import { getMockFileSystem } from '@/lib/orbitus-files';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';

const STORAGE_KEY = 'notepad-content';
const SUPPORTED_IMPORT_EXTENSIONS = [
  'txt', 'ini', 'ts', 'tsx', 'js', 'jsx', 'json', 'md', 'log', 'csv', 'xml', 'html', 'css', 'yml', 'yaml', 'py', 'java', 'c', 'cpp', 'h',
];
const FILE_PICKER_ACCEPT = SUPPORTED_IMPORT_EXTENSIONS.map((ext) => `.${ext}`).join(',');

type ImportableOrbitusFile = {
  key: string;
  path: string;
  name: string;
  extension: string;
  content: string;
};

export function NotepadApp() {
  const [content, setContent] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isImportChooserOpen, setIsImportChooserOpen] = useState(false);
  const [isOrbitusPickerOpen, setIsOrbitusPickerOpen] = useState(false);
  const [lastImportedSource, setLastImportedSource] = useState<string | null>(null);
  const { toast } = useToast();
  const { isGuest, username } = useSettings();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const orbitusFileSystem = useMemo(() => getMockFileSystem(username), [username]);

  const importableOrbitusFiles = useMemo<ImportableOrbitusFile[]>(() => {
    return Object.entries(orbitusFileSystem)
      .flatMap(([directory, items]) =>
        items
          .filter((item) => item.type === 'file' && typeof item.content === 'string')
          .map((item) => {
            const extension = item.name.includes('.') ? item.name.split('.').pop()?.toLowerCase() ?? '' : '';
            return {
              key: `${directory}/${item.name}`,
              path: `${directory}/${item.name}`,
              name: item.name,
              extension,
              content: item.content ?? '',
            };
          })
      )
      .filter((file) => SUPPORTED_IMPORT_EXTENSIONS.includes(file.extension));
  }, [orbitusFileSystem]);

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

  const importTextIntoEditor = (nextContent: string, sourceLabel: string) => {
    setContent(nextContent);
    setLastImportedSource(sourceLabel);
    toast({
      title: 'File Imported',
      description: `${sourceLabel} imported into Notepad.`,
    });
  };

  const handleDeviceFileImport = async (event: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    event.target.value = '';

    if (!selectedFile) return;

    const extension = selectedFile.name.includes('.') ? selectedFile.name.split('.').pop()?.toLowerCase() ?? '' : '';
    if (!SUPPORTED_IMPORT_EXTENSIONS.includes(extension)) {
      toast({
        variant: 'destructive',
        title: 'Unsupported file type',
        description: `Supported imports include ${FILE_PICKER_ACCEPT}.`,
      });
      return;
    }

    try {
      const fileContent = await selectedFile.text();
      importTextIntoEditor(fileContent, selectedFile.name);
    } catch (error) {
      console.error('Failed to import file from device:', error);
      toast({
        variant: 'destructive',
        title: 'Import failed',
        description: 'Could not read the selected file from your device.',
      });
    }
  };

  const handleOrbitusImport = (file: ImportableOrbitusFile) => {
    importTextIntoEditor(file.content, file.path);
    setIsOrbitusPickerOpen(false);
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
      <div className="rounded-lg border border-primary/20 bg-background/30 p-3 space-y-3">
        <p className="text-xs text-muted-foreground">
          Import supported files into Notepad (.tsx, .ts, .txt, .ini and more)
        </p>
        <div className="flex flex-wrap gap-2">
          <Button onClick={() => setIsImportChooserOpen(true)} className="bg-accent hover:bg-accent/80">
            <Upload />
            Import File
          </Button>
        </div>
      </div>

      <Textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder={isGuest ? "Notes written here will disappear after your session..." : "Type your notes here..."}
        className="flex-1 bg-background/50 border-primary/30 focus:ring-accent resize-none text-base font-sans"
      />
      <div className="flex justify-between items-center">
        {isGuest && <p className="text-xs text-muted-foreground italic flex items-center gap-1"><AlertCircle className="w-3 h-3"/> Session-only mode</p>}
        <div className="flex-1" />
        <input
          ref={fileInputRef}
          type="file"
          accept={FILE_PICKER_ACCEPT}
          onChange={handleDeviceFileImport}
          className="hidden"
        />
        <Button onClick={handleSave} disabled={isSaving} className="bg-accent hover:bg-accent/80">
          {isSaving ? <Loader2 className="animate-spin" /> : <Save />}
          Save Note
        </Button>
      </div>
      <p className="text-xs text-muted-foreground">
        Supported imports: {FILE_PICKER_ACCEPT}
        {lastImportedSource ? ` · Last import: ${lastImportedSource}` : ''}
      </p>

      <Dialog open={isOrbitusPickerOpen} onOpenChange={setIsOrbitusPickerOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Import from OrbitusVR Files</DialogTitle>
            <DialogDescription>Select a file to load into Notepad.</DialogDescription>
          </DialogHeader>
          <div className="h-72 border border-primary/20 rounded-lg">
            <ScrollArea className="h-full">
              <div className="p-2 space-y-2">
                {importableOrbitusFiles.map((file) => (
                  <Button
                    key={file.key}
                    variant="ghost"
                    onClick={() => handleOrbitusImport(file)}
                    className="w-full justify-between h-auto py-2 px-3"
                  >
                    <span className="font-mono text-xs text-left">{file.path}</span>
                    <span className="text-[10px] text-muted-foreground uppercase">.{file.extension}</span>
                  </Button>
                ))}
                {importableOrbitusFiles.length === 0 && (
                  <p className="text-sm text-muted-foreground p-3">No importable files found in OrbitusVR Files.</p>
                )}
              </div>
            </ScrollArea>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={isImportChooserOpen} onOpenChange={setIsImportChooserOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Import File</DialogTitle>
            <DialogDescription>Choose how you want to import a file.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-3">
            <Button variant="outline" onClick={() => { setIsImportChooserOpen(false); setIsOrbitusPickerOpen(true); }} className="justify-start gap-2 border-primary/30">
              <Files />
              From OrbitusVR Files app
            </Button>
            <Button variant="outline" onClick={() => { setIsImportChooserOpen(false); fileInputRef.current?.click(); }} className="justify-start gap-2 border-primary/30">
              <Laptop />
              From your device
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
