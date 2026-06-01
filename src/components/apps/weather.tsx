'use client';

import { FormEvent, useEffect, useState } from 'react';
import { CloudSun, Droplets, Loader2, MapPin, Search, Thermometer, Wind } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

type WeatherResponse = {
  location: {
    name: string;
    region?: string;
    country?: string;
  };
  current: {
    text: string;
    isDayTime: boolean;
    temperature: { Value: number; Unit: string };
    metricTemperature: { Value: number; Unit: string };
    realFeel?: { Value: number; Unit: string };
    humidity?: number;
    windSpeed?: { Value: number; Unit: string };
  };
};

export function WeatherApp() {
  const [query, setQuery] = useState('New York');
  const [weather, setWeather] = useState<WeatherResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const loadWeather = async (location: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/weather?q=${encodeURIComponent(location)}`);
      const payload = await response.json();

      if (!response.ok) {
        throw new Error(payload.error || 'Weather lookup failed.');
      }

      setWeather(payload);
    } catch (error: any) {
      setError(error.message || 'Weather lookup failed.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadWeather(query);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (query.trim()) {
      loadWeather(query.trim());
    }
  };

  return (
    <div className="h-full w-full overflow-y-auto p-6">
      <div className="mx-auto max-w-2xl space-y-6">
        <div>
          <h1 className="flex items-center gap-3 text-3xl font-bold text-accent">
            <CloudSun className="h-8 w-8" /> Weather
          </h1>
          <p className="text-sm text-muted-foreground">Live conditions powered by AccuWeather.</p>
        </div>

        <form onSubmit={handleSubmit} className="flex gap-2">
          <Input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search city or place"
            className="bg-black/30 border-primary/30"
          />
          <Button type="submit" disabled={isLoading}>
            {isLoading ? <Loader2 className="animate-spin" /> : <Search />}
            Search
          </Button>
        </form>

        {error && (
          <Card className="border-destructive/40 bg-destructive/10">
            <CardContent className="p-4 text-sm text-destructive">{error}</CardContent>
          </Card>
        )}

        {weather && (
          <Card className="overflow-hidden border-primary/30 bg-black/20">
            <CardHeader className="bg-primary/10">
              <CardTitle className="flex items-center gap-2 text-foreground">
                <MapPin className="h-5 w-5 text-accent" />
                {weather.location.name}
                {weather.location.region ? `, ${weather.location.region}` : ''}
                {weather.location.country ? `, ${weather.location.country}` : ''}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 p-6">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <p className="text-6xl font-black text-accent">
                    {Math.round(weather.current.temperature.Value)}°{weather.current.temperature.Unit}
                  </p>
                  <p className="text-lg text-muted-foreground">{weather.current.text}</p>
                </div>
                <div className="rounded-2xl border border-primary/20 bg-black/30 p-4 text-sm">
                  {weather.current.isDayTime ? 'Daytime conditions' : 'Nighttime conditions'}
                </div>
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                <div className="rounded-xl border border-primary/20 bg-black/30 p-4">
                  <Thermometer className="mb-2 h-5 w-5 text-accent" />
                  <p className="text-xs uppercase text-muted-foreground">RealFeel</p>
                  <p className="font-bold">
                    {weather.current.realFeel ? `${Math.round(weather.current.realFeel.Value)}°${weather.current.realFeel.Unit}` : 'N/A'}
                  </p>
                </div>
                <div className="rounded-xl border border-primary/20 bg-black/30 p-4">
                  <Droplets className="mb-2 h-5 w-5 text-accent" />
                  <p className="text-xs uppercase text-muted-foreground">Humidity</p>
                  <p className="font-bold">{weather.current.humidity ?? 'N/A'}%</p>
                </div>
                <div className="rounded-xl border border-primary/20 bg-black/30 p-4">
                  <Wind className="mb-2 h-5 w-5 text-accent" />
                  <p className="text-xs uppercase text-muted-foreground">Wind</p>
                  <p className="font-bold">
                    {weather.current.windSpeed ? `${Math.round(weather.current.windSpeed.Value)} ${weather.current.windSpeed.Unit}` : 'N/A'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
