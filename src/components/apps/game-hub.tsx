"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
    RotateCcw, Trophy, Gamepad2, Blocks, Bird, Gamepad, 
    Hash, Download, Play, Search, Info, Loader2 
} from 'lucide-react';
import { useDesktopActions } from '@/contexts/desktop-actions-context';
import { get } from '@/lib/idb';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

// --- BUILT-IN MINI GAMES ---

function NumberGuesser({ onBack }: { onBack: () => void }) {
  const [secretNumber, setSecretNumber] = useState(0);
  const [guess, setGuess] = useState('');
  const [message, setMessage] = useState('Guess a number between 1 and 100.');
  const [attempts, setAttempts] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);

  const startNewGame = () => {
    setSecretNumber(Math.floor(Math.random() * 100) + 1);
    setGuess('');
    setMessage('Guess a number between 1 and 100.');
    setAttempts(0);
    setIsGameOver(false);
  };

  useEffect(() => {
    startNewGame();
  }, []);

  const handleGuess = (e: React.FormEvent) => {
    e.preventDefault();
    if (isGameOver) return;

    const numGuess = parseInt(guess, 10);
    if (isNaN(numGuess)) {
      setMessage('Please enter a valid number.');
      return;
    }

    setAttempts(prev => prev + 1);

    if (numGuess === secretNumber) {
      setMessage(`You got it in ${attempts + 1} attempts!`);
      setIsGameOver(true);
    } else if (numGuess < secretNumber) {
      setMessage('Too low! Try again.');
    } else {
      setMessage('Too high! Try again.');
    }
    setGuess('');
  };

  return (
    <div className="flex flex-col items-center gap-6 py-8">
        <div className="flex w-full items-center justify-between px-4">
            <Button variant="ghost" onClick={onBack} className="text-muted-foreground hover:text-foreground">Back to Hub</Button>
            <h2 className="text-xl font-bold font-headline tracking-widest text-accent">NUMBER GUESSER</h2>
            <div className="w-20" /> {/* Spacer */}
        </div>
        <Card className="w-full max-w-md bg-black/20 border-primary/30 text-center">
            <CardContent className="flex flex-col items-center gap-4 pt-6">
            <p className="text-4xl font-bold text-foreground">
                {isGameOver ? secretNumber : '?'}
            </p>
            <p className="text-lg text-muted-foreground h-6">{message}</p>
            
            {isGameOver ? (
                <div className='flex flex-col items-center gap-4'>
                    <Trophy className="w-24 h-24 text-yellow-400" />
                    <Button onClick={startNewGame} className="bg-accent hover:bg-accent/80 text-lg py-6 px-8">
                        <RotateCcw className="mr-2 h-5 w-5" />
                        Play Again
                    </Button>
                </div>
            ) : (
                <form onSubmit={handleGuess} className="flex flex-col items-center gap-4 w-full">
                <Input
                    type="number"
                    value={guess}
                    onChange={(e) => setGuess(e.target.value)}
                    placeholder="Enter your guess"
                    className="text-center text-lg h-12 bg-black/30 border-primary/50 focus:ring-accent"
                    disabled={isGameOver}
                />
                <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-lg py-6">
                    Submit Guess
                </Button>
                </form>
            )}
            <p className="text-sm text-muted-foreground">Attempts: {attempts}</p>
            </CardContent>
        </Card>
    </div>
  );
}

// --- HUB MAIN ---

const gameCatalog = [
    { id: 'minecraft', name: 'Minecraft', icon: Blocks, type: 'external', description: 'Infinite blocks, infinite worlds.' },
    { id: 'geometry dash', name: 'Geometry Dash', icon: Gamepad, type: 'external', description: 'Rhythm-based action platforming.' },
    { id: 'flappy bird', name: 'Flappy Bird', icon: Bird, type: 'external', description: 'Simple flapping, extreme challenge.' },
    { id: '2048', name: '2048', icon: Hash, type: 'external', description: 'The viral addictive puzzle.' },
    { id: 'number-guesser', name: 'Number Guesser', icon: Trophy, type: 'built-in', description: 'System diagnostic logic game.' },
];

export function GameHub() {
  const [installedApps, setInstalledApps] = useState<string[]>([]);
  const [activeGame, setActiveGame] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const { openApp } = useDesktopActions();

  useEffect(() => {
    const checkStatus = async () => {
      const installed = await get<string[]>('installed-apps') || [];
      setInstalledApps(installed);
      setIsLoading(false);
    };
    checkStatus();
  }, []);

  const filteredGames = gameCatalog.filter(game => 
    game.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    game.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleLaunch = (game: typeof gameCatalog[0]) => {
    if (game.type === 'built-in') {
        setActiveGame(game.id);
    } else {
        const isInstalled = installedApps.includes(game.id);
        if (isInstalled || game.id === 'number-guesser') {
            openApp(game.name);
        } else {
            openApp('App Store');
        }
    }
  };

  if (isLoading) {
      return <div className="h-full w-full flex items-center justify-center"><Loader2 className="w-12 h-12 animate-spin text-accent" /></div>;
  }

  if (activeGame === 'number-guesser') {
      return <NumberGuesser onBack={() => setActiveGame(null)} />;
  }

  return (
    <div className="h-full w-full flex flex-col bg-black/20">
      <header className="p-6 border-b border-primary/10 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
            <h1 className="text-3xl font-bold font-headline tracking-widest text-accent flex items-center gap-3">
                <Gamepad2 className="w-8 h-8"/> GAME HUB
            </h1>
            <p className="text-sm text-muted-foreground mt-1">Access your virtual gaming library</p>
        </div>
        <div className="relative max-w-sm w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input 
                placeholder="Search games..." 
                className="pl-10 bg-black/30 border-primary/30"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
            />
        </div>
      </header>

      <ScrollArea className="flex-1 p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            <AnimatePresence mode="popLayout">
                {filteredGames.map((game) => {
                    const isInstalled = game.type === 'built-in' || installedApps.includes(game.id);
                    const Icon = game.icon;

                    return (
                        <motion.div
                            key={game.id}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            layout
                        >
                            <Card className={cn(
                                "group h-full bg-transparent transition-all duration-300 border-primary/20 hover:border-accent",
                                !isInstalled && "opacity-75"
                            )}>
                                <CardHeader className="pb-2">
                                    <div className="flex items-start justify-between">
                                        <div className="p-3 rounded-xl bg-black/30 text-accent group-hover:bg-accent group-hover:text-accent-foreground transition-colors">
                                            <Icon className="w-8 h-8" />
                                        </div>
                                        {isInstalled ? (
                                            <span className="text-[10px] font-bold uppercase tracking-widest bg-green-500/20 text-green-400 px-2 py-1 rounded border border-green-500/20">Installed</span>
                                        ) : (
                                            <span className="text-[10px] font-bold uppercase tracking-widest bg-orange-500/20 text-orange-400 px-2 py-1 rounded border border-orange-500/20">Store Only</span>
                                        )}
                                    </div>
                                    <CardTitle className="mt-4 text-xl">{game.name}</CardTitle>
                                    <CardDescription>{game.description}</CardDescription>
                                </CardHeader>
                                <CardContent className="pt-4">
                                    {isInstalled ? (
                                        <Button 
                                            onClick={() => handleLaunch(game)}
                                            className="w-full bg-accent hover:bg-accent/80 text-accent-foreground font-bold tracking-widest"
                                        >
                                            <Play className="mr-2 w-4 h-4" /> PLAY
                                        </Button>
                                    ) : (
                                        <Button 
                                            variant="outline"
                                            onClick={() => openApp('App Store')}
                                            className="w-full border-primary/30 hover:bg-primary/10 font-bold tracking-widest"
                                        >
                                            <Download className="mr-2 w-4 h-4" /> GET GAME
                                        </Button>
                                    )}
                                </CardContent>
                            </Card>
                        </motion.div>
                    );
                })}
            </AnimatePresence>
        </div>

        {filteredGames.length === 0 && (
            <div className="flex flex-col items-center justify-center py-24 text-muted-foreground gap-4">
                <Info className="w-12 h-12 opacity-20" />
                <p className="text-xl font-headline opacity-50">No matches found in your database.</p>
            </div>
        )}
      </ScrollArea>
    </div>
  );
}
