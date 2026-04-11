
"use client";

import { useState, useEffect } from 'react';
import { 
    Loader2, Terminal, Plus, Play, Maximize2, 
    Trash2, Monitor, Cpu, HardDrive, ArrowLeft, 
    ShieldAlert, Info, Globe, FileUp
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
    Dialog, 
    DialogContent, 
    DialogHeader, 
    DialogTitle, 
    DialogTrigger,
    DialogFooter,
    DialogDescription
} from '@/components/ui/dialog';
import { useSettings } from '@/contexts/settings-context';
import { get, set } from '@/lib/idb';
import { cn } from '@/lib/utils';
import { ScrollArea } from '../ui/scroll-area';
import { AnimatePresence, motion } from 'framer-motion';

type VM = {
    id: string;
    name: string;
    isoUrl: string;
    arch: 'x86_64' | 'i386';
    memory: string;
    fileName?: string;
};

const DEFAULT_LINUX_ISO = "https://copy.sh/v86/?profile=linux26";

export function XenovaVM() {
  const { isGuest } = useSettings();
  const [vms, setVms] = useState<VM[]>([]);
  const [activeVm, setActiveVm] = useState<VM | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isBooting, setIsBooting] = useState(false);
  
  // New VM Form State
  const [newVmName, setNewVmName] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  useEffect(() => {
    const loadVms = async () => {
        setIsLoading(true);
        const storedVms = await get<VM[]>('xenova-vms');
        if (storedVms) {
            setVms(storedVms);
        } else {
            // Default VM for new users
            const defaultVm: VM = {
                id: 'default-linux',
                name: 'Xenova Linux (Default)',
                isoUrl: DEFAULT_LINUX_ISO,
                arch: 'x86_64',
                memory: '512MB'
            };
            setVms([defaultVm]);
            if (!isGuest) await set('xenova-vms', [defaultVm]);
        }
        setIsLoading(false);
    };
    loadVms();
  }, [isGuest]);

  const handleCreateVM = async () => {
      if (!newVmName.trim()) return;

      let isoUrl = DEFAULT_LINUX_ISO;
      let fileName = undefined;

      if (selectedFile) {
          // Create an object URL for the local file
          // Note: These URLs are session-based and won't work after reload.
          isoUrl = URL.createObjectURL(selectedFile);
          fileName = selectedFile.name;
      }

      const newVm: VM = {
          id: Date.now().toString(),
          name: newVmName,
          isoUrl: isoUrl,
          arch: 'x86_64',
          memory: '512MB',
          fileName: fileName
      };

      const updatedVms = [...vms, newVm];
      setVms(updatedVms);
      
      // Only persist if it's the cloud default, as Blobs can't be saved to IDB as strings
      if (!isGuest && !selectedFile) {
          await set('xenova-vms', updatedVms);
      }
      
      setNewVmName('');
      setSelectedFile(null);
      setIsCreateOpen(false);
  };

  const handleDeleteVM = async (id: string, e: React.MouseEvent) => {
      e.stopPropagation();
      const updatedVms = vms.filter(v => v.id !== id);
      setVms(updatedVms);
      if (!isGuest) await set('xenova-vms', updatedVms);
  };

  const launchVm = (vm: VM, fullscreen: boolean = false) => {
      setIsBooting(true);
      setActiveVm(vm);
      setIsFullscreen(fullscreen);
      
      // Simulate hardware initialization
      setTimeout(() => {
          setIsBooting(false);
      }, 2000);
  };

  if (activeVm) {
      return (
          <div className={cn(
              "bg-[#0c0c0c] flex flex-col relative overflow-hidden",
              isFullscreen ? "fixed inset-0 z-[100] w-screen h-screen" : "w-full h-full"
          )}>
              {/* VM Header / Status Bar */}
              <div className="h-10 bg-black/60 border-b border-white/5 flex items-center justify-between px-4 text-[10px] font-mono text-white/40 select-none">
                <div className="flex items-center gap-4">
                  <span className="flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                    VM: {activeVm.name.toUpperCase()}
                  </span>
                  <span className="hidden sm:inline">ARCH: {activeVm.arch}</span>
                  <span className="hidden sm:inline">MEM: {activeVm.memory}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-6 text-[10px] hover:bg-white/10 text-white/60"
                    onClick={() => {
                        setActiveVm(null);
                        setIsFullscreen(false);
                    }}
                  >
                    <ArrowLeft className="w-3 h-3 mr-1" /> EXIT VM
                  </Button>
                  {!isFullscreen && (
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-6 text-[10px] hover:bg-white/10 text-white/60"
                        onClick={() => setIsFullscreen(true)}
                      >
                        <Maximize2 className="w-3 h-3 mr-1" /> FULLSCREEN
                      </Button>
                  )}
                </div>
              </div>

              <div className="flex-1 relative">
                {isBooting ? (
                  <div className="absolute inset-0 z-10 bg-black flex flex-col items-center justify-center gap-4">
                    <div className="font-mono text-xs text-green-500 space-y-1">
                      <p>[    0.000000] Linux version 4.19.0-x86_64</p>
                      <p>[    0.004512] Xenova Hypervisor detected</p>
                      <p>[    0.124851] Initializing CPU modules...</p>
                      <p>[    0.458712] Mounting virtual drives...</p>
                      <p>[    0.895124] Starting systemd-journald...</p>
                    </div>
                    <Loader2 className="w-8 h-8 animate-spin text-primary mt-4" />
                  </div>
                ) : (
                  <iframe
                    src={activeVm.isoUrl}
                    className="w-full h-full border-0"
                    title={`VM: ${activeVm.name}`}
                    sandbox="allow-scripts allow-same-origin allow-forms"
                  />
                )}
              </div>

              <div className="absolute bottom-4 right-4 p-2 px-3 bg-black/60 backdrop-blur-md border border-white/10 rounded text-[10px] font-mono text-white/60 pointer-events-none">
                <span className="flex items-center gap-2 uppercase tracking-widest">
                  <Terminal className="w-3 h-3 text-primary" />
                  XenovaVM Secure Runtime
                </span>
              </div>
          </div>
      );
  }

  return (
    <div className="h-full w-full flex flex-col bg-black/20">
      <header className="p-6 border-b border-primary/10 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-black/20">
        <div>
            <h1 className="text-3xl font-bold font-headline tracking-widest text-accent flex items-center gap-3">
                <Monitor className="w-8 h-8"/> VM DASHBOARD
            </h1>
            <p className="text-sm text-muted-foreground mt-1">Manage your virtual hardware and environments</p>
        </div>
        
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
            <DialogTrigger asChild>
                <Button className="bg-accent hover:bg-accent/80 text-accent-foreground font-bold tracking-widest">
                    <Plus className="mr-2 w-5 h-5" /> CREATE NEW VM
                </Button>
            </DialogTrigger>
            <DialogContent className="bg-card border-border sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle className="text-accent font-headline tracking-widest">PROVISION VIRTUAL MACHINE</DialogTitle>
                    <DialogDescription className="text-xs">Select a local bootable image to configure your new virtual environment.</DialogDescription>
                </DialogHeader>
                <div className="grid gap-6 py-4">
                    <div className="space-y-2">
                        <Label htmlFor="vm-name">VM Identifier</Label>
                        <Input 
                            id="vm-name" 
                            placeholder="e.g., Debian-Stable-01" 
                            value={newVmName}
                            onChange={(e) => setNewVmName(e.target.value)}
                            className="bg-black/30 border-primary/30"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="vm-iso">Boot Image (ISO/IMG)</Label>
                        <div className="relative">
                            <Input 
                                id="vm-iso" 
                                type="file"
                                onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                                className="bg-black/30 border-primary/30 file:bg-accent file:text-accent-foreground file:border-0 file:rounded file:text-[10px] file:font-bold file:mr-4 file:px-2 file:py-1 h-12 pt-3 cursor-pointer"
                                accept=".iso,.img,.bin"
                            />
                            {selectedFile && (
                                <p className="mt-2 text-[10px] text-accent font-mono truncate px-1">
                                    SELECTED: {selectedFile.name} ({ (selectedFile.size / (1024 * 1024)).toFixed(2) } MB)
                                </p>
                            )}
                            {!selectedFile && (
                                <p className="mt-2 text-[10px] text-muted-foreground italic px-1">
                                    Leave empty to use the default Xenova Linux cloud profile.
                                </p>
                            )}
                        </div>
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={() => setIsCreateOpen(false)}>Cancel</Button>
                    <Button onClick={handleCreateVM} className="bg-accent text-accent-foreground" disabled={!newVmName}>Provision</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
      </header>

      <ScrollArea className="flex-1 p-6">
        {isLoading ? (
            <div className="flex flex-col items-center justify-center py-24 gap-4">
                <Loader2 className="w-12 h-12 animate-spin text-accent" />
                <p className="font-headline tracking-widest opacity-50 uppercase">Accessing Hypervisor...</p>
            </div>
        ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <AnimatePresence>
                    {vms.map((vm) => (
                        <motion.div
                            key={vm.id}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            layout
                        >
                            <Card className="group bg-transparent border-primary/20 hover:border-accent transition-all duration-300 overflow-hidden shadow-lg shadow-black/20">
                                <CardHeader className="pb-2 bg-black/20 border-b border-primary/5">
                                    <div className="flex items-start justify-between">
                                        <div className="p-3 rounded-xl bg-black/30 text-accent group-hover:bg-accent group-hover:text-accent-foreground transition-colors">
                                            <Terminal className="w-6 h-6" />
                                        </div>
                                        <div className="flex gap-1">
                                            <Button 
                                                variant="ghost" 
                                                size="icon" 
                                                className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                                                onClick={(e) => handleDeleteVM(vm.id, e)}
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </div>
                                    <CardTitle className="mt-4 text-xl tracking-tight">{vm.name}</CardTitle>
                                    <CardDescription className="flex items-center gap-2 pt-1 text-[10px] font-mono">
                                        <Cpu className="w-3 h-3" /> {vm.arch} &bull; <HardDrive className="w-3 h-3" /> {vm.memory}
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="pt-4 flex flex-col gap-2">
                                    <div className="flex items-center gap-2 text-[10px] text-muted-foreground mb-2 truncate">
                                        {vm.fileName ? <FileUp className="w-3 h-3 flex-shrink-0" /> : <Globe className="w-3 h-3 flex-shrink-0" />}
                                        {vm.fileName || 'Cloud Image'}
                                    </div>
                                    <div className="grid grid-cols-2 gap-2">
                                        <Button 
                                            onClick={() => launchVm(vm)}
                                            className="bg-primary/20 hover:bg-primary text-primary-foreground border border-primary/30 transition-all font-bold text-xs"
                                        >
                                            <Play className="mr-2 w-3 h-3" /> RUN
                                        </Button>
                                        <Button 
                                            onClick={() => launchVm(vm, true)}
                                            className="bg-accent/20 hover:bg-accent text-accent-foreground border border-accent/30 transition-all font-bold text-xs"
                                        >
                                            <Maximize2 className="mr-2 w-3 h-3" /> FULLSCREEN
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>
        )}

        {!isLoading && vms.length === 0 && (
            <div className="flex flex-col items-center justify-center py-24 text-muted-foreground gap-4 text-center">
                <ShieldAlert className="w-16 h-16 opacity-20" />
                <div className="space-y-1">
                    <p className="text-xl font-headline opacity-50 uppercase tracking-widest">No VMs provisioned</p>
                    <p className="text-xs max-w-xs mx-auto">Create a new virtual machine to start testing software in a secure sandbox.</p>
                </div>
            </div>
        )}
      </ScrollArea>
    </div>
  );
}
