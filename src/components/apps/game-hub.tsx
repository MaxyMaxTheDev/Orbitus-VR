
"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { RotateCcw, Trophy } from 'lucide-react';

export function GameHub() {
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
    <div className="h-full w-full p-4 flex justify-center items-center">
      <Card className="w-full max-w-md bg-transparent border-primary/30 text-center">
        <CardHeader>
          <CardTitle className="text-accent text-2xl tracking-wider">Guess the Number!</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center gap-4">
          <p className="text-4xl font-bold text-foreground">
            {isGameOver ? secretNumber : '?'}
          </p>
          <p className="text-lg text-muted-foreground h-6">{message}</p>
          
          {isGameOver ? (
            <div className='flex flex-col items-center gap-4'>
                <Trophy className="w-24 h-24 text-yellow-400" />
                <Button onClick={startNewGame} className="bg-accent hover:bg-accent/80 text-lg py-6">
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
