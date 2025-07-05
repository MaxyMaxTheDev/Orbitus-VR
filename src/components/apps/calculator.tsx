
"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

export function CalculatorApp() {
  const [displayValue, setDisplayValue] = useState('0');
  const [firstOperand, setFirstOperand] = useState<number | null>(null);
  const [operator, setOperator] = useState<string | null>(null);
  const [waitingForSecondOperand, setWaitingForSecondOperand] = useState(false);

  const inputDigit = (digit: string) => {
    if (waitingForSecondOperand) {
      setDisplayValue(digit);
      setWaitingForSecondOperand(false);
    } else {
      setDisplayValue(displayValue === '0' ? digit : displayValue + digit);
    }
  };

  const inputDecimal = () => {
    if (waitingForSecondOperand) {
      setDisplayValue('0.');
      setWaitingForSecondOperand(false);
      return;
    }
    if (!displayValue.includes('.')) {
      setDisplayValue(displayValue + '.');
    }
  };

  const handleOperator = (nextOperator: string) => {
    const inputValue = parseFloat(displayValue);

    if (operator && waitingForSecondOperand) {
      setOperator(nextOperator);
      return;
    }

    if (firstOperand === null) {
      setFirstOperand(inputValue);
    } else if (operator) {
      const result = performCalculation();
      setDisplayValue(String(result));
      setFirstOperand(result);
    }

    setWaitingForSecondOperand(true);
    setOperator(nextOperator);
  };

  const performCalculation = () => {
    if (firstOperand === null || operator === null) return parseFloat(displayValue);
    
    const inputValue = parseFloat(displayValue);
    let result = 0;
    if (operator === '+') result = firstOperand + inputValue;
    else if (operator === '-') result = firstOperand - inputValue;
    else if (operator === '*') result = firstOperand * inputValue;
    else if (operator === '/') result = firstOperand / inputValue;

    return result;
  };
  
  const handleEquals = () => {
    const result = performCalculation();
    setDisplayValue(String(result));
    setFirstOperand(null);
    setOperator(null);
    setWaitingForSecondOperand(false);
  }

  const clearAll = () => {
    setDisplayValue('0');
    setFirstOperand(null);
    setOperator(null);
    setWaitingForSecondOperand(false);
  };

  const buttons = [
    { label: 'C', handler: clearAll, className: 'col-span-2 bg-destructive/80 hover:bg-destructive text-destructive-foreground' },
    { label: '÷', handler: () => handleOperator('/'), className: 'bg-accent hover:bg-accent/80' },
    { label: '×', handler: () => handleOperator('*'), className: 'bg-accent hover:bg-accent/80' },
    { label: '7', handler: () => inputDigit('7') },
    { label: '8', handler: () => inputDigit('8') },
    { label: '9', handler: () => inputDigit('9') },
    { label: '−', handler: () => handleOperator('-'), className: 'bg-accent hover:bg-accent/80' },
    { label: '4', handler: () => inputDigit('4') },
    { label: '5', handler: () => inputDigit('5') },
    { label: '6', handler: () => inputDigit('6') },
    { label: '+', handler: () => handleOperator('+'), className: 'bg-accent hover:bg-accent/80' },
    { label: '1', handler: () => inputDigit('1') },
    { label: '2', handler: () => inputDigit('2') },
    { label: '3', handler: () => inputDigit('3') },
    { label: '=', handler: handleEquals, className: 'row-span-2 bg-primary hover:bg-primary/90' },
    { label: '0', handler: () => inputDigit('0'), className: 'col-span-2' },
    { label: '.', handler: inputDecimal },
  ];

  return (
    <div className="h-full w-full p-4 flex justify-center items-center bg-black/20">
      <Card className="w-full max-w-xs bg-card/50 border-primary/30 p-4">
        <CardContent className="p-0 flex flex-col gap-4">
          <div className="bg-black/50 rounded-lg p-4 text-right text-4xl font-mono text-foreground break-all h-20 flex items-end justify-end">
            <span>{displayValue}</span>
          </div>
          <div className="grid grid-cols-4 grid-rows-5 gap-2">
            {buttons.map(({ label, handler, className }) => (
              <Button
                key={label}
                onClick={handler}
                className={cn('h-16 text-2xl', className)}
                variant="secondary"
              >
                {label}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
