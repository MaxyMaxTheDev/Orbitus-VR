import { NextResponse } from 'next/server';

import { getVercelEnv } from '@/lib/vercel-env';

type AccuWeatherLocation = {
  Key: string;
  LocalizedName: string;
  AdministrativeArea?: { LocalizedName?: string };
  Country?: { LocalizedName?: string };
};

type AccuWeatherCurrent = {
  WeatherText: string;
  WeatherIcon: number;
  IsDayTime: boolean;
  Temperature: {
    Metric: { Value: number; Unit: string };
    Imperial: { Value: number; Unit: string };
  };
  RealFeelTemperature?: {
    Imperial?: { Value: number; Unit: string };
  };
  RelativeHumidity?: number;
  Wind?: {
    Speed?: {
      Imperial?: { Value: number; Unit: string };
    };
  };
};

function weatherError(message: string, status = 400) {
  return NextResponse.json({ error: message }, { status });
}

export async function GET(request: Request) {
  const apiKey = getVercelEnv('ACCUWEATHER_API_KEY');

  if (!apiKey) {
    return weatherError('Weather is not configured. Set ACCUWEATHER_API_KEY in Vercel Environment Variables.', 503);
  }

  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q')?.trim() || 'New York';

  try {
    const locationResponse = await fetch(
      `https://dataservice.accuweather.com/locations/v1/cities/search?apikey=${encodeURIComponent(apiKey)}&q=${encodeURIComponent(query)}`
    );

    if (!locationResponse.ok) {
      return weatherError('AccuWeather location lookup failed.', locationResponse.status);
    }

    const locations = (await locationResponse.json()) as AccuWeatherLocation[];
    const location = locations[0];

    if (!location) {
      return weatherError(`No AccuWeather location found for "${query}".`, 404);
    }

    const currentResponse = await fetch(
      `https://dataservice.accuweather.com/currentconditions/v1/${location.Key}?apikey=${encodeURIComponent(apiKey)}&details=true`
    );

    if (!currentResponse.ok) {
      return weatherError('AccuWeather current conditions lookup failed.', currentResponse.status);
    }

    const conditions = (await currentResponse.json()) as AccuWeatherCurrent[];
    const current = conditions[0];

    if (!current) {
      return weatherError('No current weather conditions were returned.', 404);
    }

    return NextResponse.json({
      location: {
        name: location.LocalizedName,
        region: location.AdministrativeArea?.LocalizedName,
        country: location.Country?.LocalizedName,
      },
      current: {
        text: current.WeatherText,
        icon: current.WeatherIcon,
        isDayTime: current.IsDayTime,
        temperature: current.Temperature.Imperial,
        metricTemperature: current.Temperature.Metric,
        realFeel: current.RealFeelTemperature?.Imperial,
        humidity: current.RelativeHumidity,
        windSpeed: current.Wind?.Speed?.Imperial,
      },
    });
  } catch (error) {
    console.error('[Weather] AccuWeather request failed:', error);
    return weatherError('Unable to reach AccuWeather right now.', 502);
  }
}
