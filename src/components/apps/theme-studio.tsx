
"use client";

import { useState, useEffect } from 'react';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RotateCcw } from 'lucide-react';
import { Switch } from '@/components/ui/switch';

const ColorSetting = ({ label, value, onChange, disabled }: { label: string; value: number[]; onChange: (value: number[]) => void, disabled?: boolean }) => {
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
        <Slider trackClassName="bg-gradient-to-r from-red-500 via-yellow-500 to-red-500" value={[h]} max={360} step={1} onValueChange={([newH]) => onChange([newH, s, l])} disabled={disabled} />
      </div>
      <div className="space-y-3">
        <Label className="text-sm text-muted-foreground">Saturation ({s}%)</Label>
        <Slider trackClassName={`bg-gradient-to-r from-slate-500 to-[${hslColor}]`} value={[s]} max={100} step={1} onValueChange={([newS]) => onChange([h, newS, l])} disabled={disabled}/>
      </div>
      <div className="space-y-3">
        <Label className="text-sm text-muted-foreground">Lightness ({l}%)</Label>
        <Slider trackClassName={`bg-gradient-to-r from-black via-[${hslColor}] to-white`} value={[l]} max={100} step={1} onValueChange={([newL]) => onChange([h, s, newL])} disabled={disabled}/>
      </div>
    </div>
  );
};

const defaultTheme = {
  primary: [217, 91, 60],
  accent: [217, 91, 60],
  background: [220, 13, 18],
  card: [220, 13, 22],
};

const glassTheme = {
    primary: [265, 90, 65], // Vibrant Purple
    accent: [180, 90, 60], // Bright Cyan
    background: [225, 20, 15], // Very Dark Blue
    card: [220, 15, 90], // Light Grey (for frosted glass)
};

export function ThemeStudio() {
    const [primaryColor, setPrimaryColor] = useState(defaultTheme.primary);
    const [accentColor, setAccentColor] = useState(defaultTheme.accent);
    const [backgroundColor, setBackgroundColor] = useState(defaultTheme.background);
    const [cardColor, setCardColor] = useState(defaultTheme.card);
    const [isGlassTheme, setIsGlassTheme] = useState(false);
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
    }, []);

    const updateCssVar = (varName: string, hsl: number[]) => {
        document.documentElement.style.setProperty(varName, `${hsl[0]} ${hsl[1]}% ${hsl[2]}%`);
    }

    const handleReset = () => {
        setIsGlassTheme(false);
        setPrimaryColor(defaultTheme.primary);
        setAccentColor(defaultTheme.accent);
        setBackgroundColor(defaultTheme.background);
        setCardColor(defaultTheme.card);
    };
    
    useEffect(() => {
        if (!isClient) return;

        if (isGlassTheme) {
            setPrimaryColor(glassTheme.primary);
            setAccentColor(glassTheme.accent);
            setBackgroundColor(glassTheme.background);
            setCardColor(glassTheme.card);
        } else {
            // Revert to default when toggled off
            setPrimaryColor(defaultTheme.primary);
            setAccentColor(defaultTheme.accent);
            setBackgroundColor(defaultTheme.background);
            setCardColor(defaultTheme.card);
        }
    }, [isGlassTheme, isClient]);

    useEffect(() => {
        if (!isClient) return;
        updateCssVar('--primary', primaryColor);
    }, [primaryColor, isClient]);
    
    useEffect(() => {
        if (!isClient) return;
        updateCssVar('--accent', accentColor);
        updateCssVar('--ring', accentColor);
    }, [accentColor, isClient]);

    useEffect(() => {
        if (!isClient) return;
        updateCssVar('--card', cardColor);
    }, [cardColor, isClient]);

    useEffect(() => {
        if (!isClient) return;
        updateCssVar('--background', backgroundColor);
        
        const isDark = backgroundColor[2] < 50;
        const [hue, sat] = backgroundColor;

        const foregroundLightness = isDark ? 98 : 10;
        updateCssVar('--foreground', [210, 40, foregroundLightness]);
        
        const calculateLightness = (base: number, offset: number) => Math.max(0, Math.min(100, base + (isDark ? offset : -offset)));

        updateCssVar('--popover', [hue, sat, calculateLightness(backgroundColor[2], 4)]);
        updateCssVar('--secondary', [hue, sat, calculateLightness(backgroundColor[2], 10)]);
        updateCssVar('--muted', [hue, sat, calculateLightness(backgroundColor[2], 10)]);
        updateCssVar('--muted-foreground', [215, 20, calculateLightness(foregroundLightness, -33)]);
        updateCssVar('--border', [hue, sat, calculateLightness(backgroundColor[2], 13)]);
        updateCssVar('--input', [hue, sat, calculateLightness(backgroundColor[2], 13)]);
        
        const primaryIsDark = primaryColor[2] < 50;
        updateCssVar('--primary-foreground', [0, 0, primaryIsDark ? 98 : 10]);

        const accentIsDark = accentColor[2] < 50;
        updateCssVar('--accent-foreground', [0, 0, accentIsDark ? 98 : 10]);

    }, [backgroundColor, primaryColor, accentColor, isClient]);

    if (!isClient) {
        return <div className="flex items-center justify-center h-full"><p className="text-muted-foreground font-headline animate-pulse">Loading Theme Studio...</p></div>;
    }

  return (
    <div className="p-4 sm:p-6 h-full w-full overflow-y-auto bg-black/20">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
            <div className="flex items-center space-x-3 p-3 rounded-lg bg-card/50 border border-border">
                <Switch
                    id="glass-theme"
                    checked={isGlassTheme}
                    onCheckedChange={setIsGlassTheme}
                    className="data-[state=checked]:bg-accent"
                />
                <Label htmlFor="glass-theme" className="text-lg font-medium">Liquid Glass Theme</Label>
            </div>
            <Button onClick={handleReset} variant="outline" className="border-accent text-accent hover:bg-accent hover:text-accent-foreground">
                <RotateCcw className="mr-2 h-4 w-4" />
                Reset to Default
            </Button>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-6">
            <Card className="bg-transparent border-primary/20">
                <CardHeader>
                    <CardTitle className="text-primary text-xl font-headline tracking-wider">PRIMARY</CardTitle>
                </CardHeader>
                <CardContent>
                    <ColorSetting label="Primary Color" value={primaryColor} onChange={setPrimaryColor} disabled={isGlassTheme} />
                </CardContent>
            </Card>
             <Card className="bg-transparent border-accent/20">
                <CardHeader>
                    <CardTitle className="text-accent text-xl font-headline tracking-wider">ACCENT</CardTitle>
                </CardHeader>
                <CardContent>
                    <ColorSetting label="Accent Color" value={accentColor} onChange={setAccentColor} disabled={isGlassTheme} />
                </CardContent>
            </Card>
            <Card className="bg-transparent border-border/50">
                <CardHeader>
                    <CardTitle className="text-xl font-headline tracking-wider">CARD</CardTitle>
                </CardHeader>
                <CardContent>
                    <ColorSetting label="Card Color" value={cardColor} onChange={setCardColor} disabled={isGlassTheme} />
                </CardContent>
            </Card>
            <Card className="bg-transparent border-foreground/20">
                <CardHeader>
                    <CardTitle className="text-xl font-headline tracking-wider">BACKGROUND</CardTitle>
                </CardHeader>
                <CardContent>
                    <ColorSetting label="Background" value={backgroundColor} onChange={setBackgroundColor} disabled={isGlassTheme} />
                </CardContent>
            </Card>
        </div>
    </div>
  );
}
