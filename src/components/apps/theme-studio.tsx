"use client";

import { useState, useEffect } from 'react';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RotateCcw, Sparkles } from 'lucide-react';

const ColorSetting = ({ label, value, onChange }: { label: string; value: number[]; onChange: (value: number[]) => void }) => {
  const [h, s, l] = value;
  const hslColor = `hsl(${h}, ${s}%, ${l}%)`;

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <Label className="text-lg font-medium font-headline">{label}</Label>
        <div className="w-10 h-10 rounded-full border-2 border-border" style={{ backgroundColor: hslColor }} />
      </div>
      <div className="space-y-3">
        <Label className="text-sm text-muted-foreground">Hue ({h})</Label>
        <Slider trackClassName="bg-gradient-to-r from-red-500 via-yellow-500 to-red-500" value={[h]} max={360} step={1} onValueChange={([newH]) => onChange([newH, s, l])} />
      </div>
      <div className="space-y-3">
        <Label className="text-sm text-muted-foreground">Saturation ({s}%)</Label>
        <Slider trackClassName={`bg-gradient-to-r from-slate-500 to-[${hslColor}]`} value={[s]} max={100} step={1} onValueChange={([newS]) => onChange([h, newS, l])} />
      </div>
      <div className="space-y-3">
        <Label className="text-sm text-muted-foreground">Lightness ({l}%)</Label>
        <Slider trackClassName={`bg-gradient-to-r from-black via-[${hslColor}] to-white`} value={[l]} max={100} step={1} onValueChange={([newL]) => onChange([h, s, newL])} />
      </div>
    </div>
  );
};

const defaultTheme = {
  primary: [217, 91, 60],
  accent: [217, 91, 60],
  background: [220, 13, 18],
  card: [220, 13, 22],
  uiBlur: 16,
  bgBlur: 0,
};

export function ThemeStudio() {
    const [primaryColor, setPrimaryColor] = useState(defaultTheme.primary);
    const [accentColor, setAccentColor] = useState(defaultTheme.accent);
    const [backgroundColor, setBackgroundColor] = useState(defaultTheme.background);
    const [cardColor, setCardColor] = useState(defaultTheme.card);
    const [uiBlur, setUiBlur] = useState(defaultTheme.uiBlur);
    const [bgBlur, setBgBlur] = useState(defaultTheme.bgBlur);
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
    }, []);

    const updateCssVar = (varName: string, value: string) => {
        document.documentElement.style.setProperty(varName, value);
    }

    const handleReset = () => {
        setPrimaryColor(defaultTheme.primary);
        setAccentColor(defaultTheme.accent);
        setBackgroundColor(defaultTheme.background);
        setCardColor(defaultTheme.card);
        setUiBlur(defaultTheme.uiBlur);
        setBgBlur(defaultTheme.bgBlur);
    };

    useEffect(() => {
        if (!isClient) return;
        updateCssVar('--primary', `${primaryColor[0]} ${primaryColor[1]}% ${primaryColor[2]}%`);
    }, [primaryColor, isClient]);
    
    useEffect(() => {
        if (!isClient) return;
        updateCssVar('--accent', `${accentColor[0]} ${accentColor[1]}% ${accentColor[2]}%`);
        updateCssVar('--ring', `${accentColor[0]} ${accentColor[1]}% ${accentColor[2]}%`);
    }, [accentColor, isClient]);

    useEffect(() => {
        if (!isClient) return;
        updateCssVar('--card', `${cardColor[0]} ${cardColor[1]}% ${cardColor[2]}%`);
    }, [cardColor, isClient]);

    useEffect(() => {
        if (!isClient) return;
        updateCssVar('--ui-blur', `${uiBlur}px`);
    }, [uiBlur, isClient]);

    useEffect(() => {
        if (!isClient) return;
        updateCssVar('--bg-blur', `${bgBlur}px`);
    }, [bgBlur, isClient]);

    useEffect(() => {
        if (!isClient) return;
        const [h, s, l] = backgroundColor;
        updateCssVar('--background', `${h} ${s}% ${l}%`);
        
        const isDark = l < 50;
        const foregroundLightness = isDark ? 98 : 10;
        updateCssVar('--foreground', `210 40% ${foregroundLightness}%`);
        
        const calculateLightness = (base: number, offset: number) => Math.max(0, Math.min(100, base + (isDark ? offset : -offset)));

        updateCssVar('--popover', `${h} ${s}% ${calculateLightness(l, 4)}%`);
        updateCssVar('--secondary', `${h} ${s}% ${calculateLightness(l, 10)}%`);
        updateCssVar('--muted', `${h} ${s}% ${calculateLightness(l, 10)}%`);
        updateCssVar('--muted-foreground', `215 20% ${calculateLightness(foregroundLightness, -33)}%`);
        updateCssVar('--border', `${h} ${s}% ${calculateLightness(l, 13)}%`);
        updateCssVar('--input', `${h} ${s}% ${calculateLightness(l, 13)}%`);
        
        const primaryIsDark = primaryColor[2] < 50;
        updateCssVar('--primary-foreground', `0 0% ${primaryIsDark ? 98 : 10}%`);

        const accentIsDark = accentColor[2] < 50;
        updateCssVar('--accent-foreground', `0 0% ${accentIsDark ? 98 : 10}%`);

    }, [backgroundColor, primaryColor, accentColor, isClient]);

    if (!isClient) {
        return <div className="flex items-center justify-center h-full"><p className="text-muted-foreground font-headline animate-pulse">Loading Theme Studio...</p></div>;
    }

  return (
    <div className="p-4 sm:p-6 h-full w-full overflow-y-auto bg-black/20">
        <div className="flex justify-end items-center gap-4 mb-6">
            <Button onClick={handleReset} variant="outline" className="border-accent text-accent hover:bg-accent hover:text-accent-foreground">
                <RotateCcw className="mr-2 h-4 w-4" />
                Reset to Default
            </Button>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            <Card className="bg-transparent border-primary/20">
                <CardHeader>
                    <CardTitle className="text-primary text-xl font-headline tracking-wider">PRIMARY</CardTitle>
                </CardHeader>
                <CardContent>
                    <ColorSetting label="Primary Color" value={primaryColor} onChange={setPrimaryColor} />
                </CardContent>
            </Card>
             <Card className="bg-transparent border-accent/20">
                <CardHeader>
                    <CardTitle className="text-accent text-xl font-headline tracking-wider">ACCENT</CardTitle>
                </CardHeader>
                <CardContent>
                    <ColorSetting label="Accent Color" value={accentColor} onChange={setAccentColor} />
                </CardContent>
            </Card>
            <Card className="bg-transparent border-foreground/20">
                <CardHeader>
                    <CardTitle className="text-xl font-headline tracking-wider">BACKGROUND</CardTitle>
                </CardHeader>
                <CardContent>
                    <ColorSetting label="Background" value={backgroundColor} onChange={setBackgroundColor} />
                </CardContent>
            </Card>
            <Card className="bg-transparent border-border/50">
                <CardHeader>
                    <CardTitle className="text-xl font-headline tracking-wider">CARD</CardTitle>
                </CardHeader>
                <CardContent>
                    <ColorSetting label="Card Color" value={cardColor} onChange={setCardColor} />
                </CardContent>
            </Card>
            <Card className="bg-transparent border-accent/20 xl:col-span-2">
                <CardHeader>
                    <CardTitle className="text-accent text-xl font-headline tracking-wider flex items-center gap-2">
                        <Sparkles className="w-5 h-5"/>
                        EFFECTS
                    </CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-4">
                        <Label className="text-lg font-medium font-headline">UI Blur ({uiBlur}px)</Label>
                        <Slider 
                            value={[uiBlur]} 
                            max={40} 
                            step={1} 
                            onValueChange={([val]) => setUiBlur(val)} 
                        />
                        <p className="text-xs text-muted-foreground">Adjust transparency and blur depth for windows and the dock.</p>
                    </div>
                    <div className="space-y-4">
                        <Label className="text-lg font-medium font-headline">Background Blur ({bgBlur}px)</Label>
                        <Slider 
                            value={[bgBlur]} 
                            max={100} 
                            step={1} 
                            onValueChange={([val]) => setBgBlur(val)} 
                        />
                        <p className="text-xs text-muted-foreground">Control how much the desktop background is blurred.</p>
                    </div>
                </CardContent>
            </Card>
        </div>
    </div>
  );
}
