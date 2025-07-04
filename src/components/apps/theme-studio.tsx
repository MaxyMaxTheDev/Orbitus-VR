
"use client";

import { useState, useEffect } from 'react';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const ColorSetting = ({ label, value, onChange }: { label: string; value: number[]; onChange: (value: number[]) => void }) => {
  const [h, s, l] = value;
  const hslColor = `hsl(${h}, ${s}%, ${l}%)`;

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <Label className="text-lg font-medium">{label}</Label>
        <div className="w-10 h-10 rounded-full border-2 border-border" style={{ backgroundColor: hslColor }} />
      </div>
      <div className="space-y-3">
        <Label className="text-sm text-muted-foreground">Hue ({h})</Label>
        <Slider defaultValue={[h]} max={360} step={1} onValueChange={([newH]) => onChange([newH, s, l])} />
      </div>
      <div className="space-y-3">
        <Label className="text-sm text-muted-foreground">Saturation ({s}%)</Label>
        <Slider defaultValue={[s]} max={100} step={1} onValueChange={([newS]) => onChange([h, newS, l])} />
      </div>
      <div className="space-y-3">
        <Label className="text-sm text-muted-foreground">Lightness ({l}%)</Label>
        <Slider defaultValue={[l]} max={100} step={1} onValueChange={([newL]) => onChange([h, s, newL])} />
      </div>
    </div>
  );
};

export function ThemeStudio() {
    const [primaryColor, setPrimaryColor] = useState([261, 44, 68]);
    const [accentColor, setAccentColor] = useState([149, 81, 67]);
    const [backgroundColor, setBackgroundColor] = useState([0, 0, 13]);
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
        const rootStyle = getComputedStyle(document.documentElement);
        
        const parseHsl = (prop: string) => {
            const val = rootStyle.getPropertyValue(prop).trim();
            if (!val) return null;
            const parts = val.split(' ').map(parseFloat);
            return parts.length === 3 ? parts : null;
        }
        
        const initialPrimary = parseHsl('--primary');
        if (initialPrimary) setPrimaryColor(initialPrimary);
        
        const initialAccent = parseHsl('--accent');
        if (initialAccent) setAccentColor(initialAccent);

        const initialBackground = parseHsl('--background');
        if (initialBackground) setBackgroundColor(initialBackground);

    }, []);

    const updateCssVar = (varName: string, hsl: number[]) => {
        document.documentElement.style.setProperty(varName, `${hsl[0]} ${hsl[1]}% ${hsl[2]}%`);
    }

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
        updateCssVar('--background', backgroundColor);
        
        const isDark = backgroundColor[2] < 50;
        const [hue, sat] = backgroundColor;

        const foregroundLightness = isDark ? 98 : 13;
        updateCssVar('--foreground', [0, 0, foregroundLightness]);
        
        const calculateLightness = (base: number, offset: number) => Math.max(0, Math.min(100, base + (isDark ? offset : -offset)));

        updateCssVar('--card', [hue, sat, calculateLightness(backgroundColor[2], 2)]);
        updateCssVar('--card-foreground', [0, 0, foregroundLightness]);
        updateCssVar('--popover', [hue, sat, calculateLightness(backgroundColor[2], 2)]);
        updateCssVar('--popover-foreground', [0, 0, foregroundLightness]);
        updateCssVar('--secondary', [hue, sat, calculateLightness(backgroundColor[2], 7)]);
        updateCssVar('--secondary-foreground', [0, 0, foregroundLightness]);
        updateCssVar('--muted', [hue, sat, calculateLightness(backgroundColor[2], 7)]);
        updateCssVar('--muted-foreground', [0, 0, calculateLightness(foregroundLightness, -37)]);
        updateCssVar('--border', [hue, sat, calculateLightness(backgroundColor[2], 12)]);
        updateCssVar('--input', [hue, sat, calculateLightness(backgroundColor[2], 12)]);
        
        const primaryIsDark = primaryColor[2] < 50;
        updateCssVar('--primary-foreground', [0, 0, primaryIsDark ? 98 : 13]);

        const accentIsDark = accentColor[2] < 50;
        updateCssVar('--accent-foreground', [0, 0, accentIsDark ? 98 : 13]);

    }, [backgroundColor, primaryColor, accentColor, isClient]);

    if (!isClient) {
        return <div className="flex items-center justify-center h-full"><p className="text-muted-foreground">Loading Theme Studio...</p></div>;
    }

  return (
    <div className="p-4 sm:p-6 h-full w-full overflow-y-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="bg-transparent border-primary/30">
                <CardHeader>
                    <CardTitle className="text-accent text-xl">Primary Color</CardTitle>
                </CardHeader>
                <CardContent>
                    <ColorSetting label="Primary" value={primaryColor} onChange={setPrimaryColor} />
                </CardContent>
            </Card>
             <Card className="bg-transparent border-primary/30">
                <CardHeader>
                    <CardTitle className="text-accent text-xl">Accent Color</CardTitle>
                </CardHeader>
                <CardContent>
                    <ColorSetting label="Accent" value={accentColor} onChange={setAccentColor} />
                </CardContent>
            </Card>
             <Card className="bg-transparent border-primary/30">
                <CardHeader>
                    <CardTitle className="text-accent text-xl">Background</CardTitle>
                </CardHeader>
                <CardContent>
                    <ColorSetting label="Background" value={backgroundColor} onChange={setBackgroundColor} />
                </CardContent>
            </Card>
        </div>
    </div>
  );
}
