'use client';

import React from 'react';
import { CurrentWeather, TempUnit, DailyForecastItem } from '@/lib/lobo-weather/types';
import { Droplets, Wind, Thermometer, Sun, CloudSun, CloudRain, CloudLightning, Snowflake } from 'lucide-react';

interface TemperatureHeroProps {
  current: CurrentWeather;
  todayForecast?: DailyForecastItem;
  unit: TempUnit;
}

export const TemperatureHero: React.FC<TemperatureHeroProps> = ({
  current,
  todayForecast,
  unit,
}) => {
  const temp = unit === 'F' ? current.temperatureF : current.temperatureC;
  const feelsLike = unit === 'F' ? current.feelsLikeF : current.feelsLikeC;
  const maxTemp = todayForecast 
    ? (unit === 'F' ? todayForecast.maxTempF : todayForecast.maxTempC)
    : temp + 2;
  const minTemp = todayForecast 
    ? (unit === 'F' ? todayForecast.minTempF : todayForecast.minTempC)
    : temp - 12;

  const windSpeed = unit === 'F' ? `${current.windSpeedMph} mph` : `${current.windSpeedKmh} km/h`;

  const getConditionIcon = (code: number) => {
    if (code >= 95) return <CloudLightning className="w-6 h-6 text-purple-400 animate-pulse" />;
    if ((code >= 71 && code <= 77) || code === 85 || code === 86) return <Snowflake className="w-6 h-6 text-blue-300" />;
    if ((code >= 51 && code <= 67) || (code >= 80 && code <= 82)) return <CloudRain className="w-6 h-6 text-sky-400" />;
    if (code === 3) return <CloudSun className="w-6 h-6 text-slate-400" />;
    if (code === 1 || code === 2) return <CloudSun className="w-6 h-6 text-amber-400" />;
    return <Sun className="w-6 h-6 text-amber-400 animate-spin" style={{ animationDuration: '25s' }} />;
  };

  return (
    <div className="w-full flex flex-col gap-3 py-1">
      {/* Fila Principal de Temperatura y Condición */}
      <div className="flex items-center justify-between">
        {/* Número de Temperatura Grande (Alto Contraste Blanco) */}
        <div className="flex items-start">
          <span className="text-7xl font-extrabold text-white tracking-tight leading-none drop-shadow-md">
            {temp}
          </span>
          <span className="text-3xl font-bold text-amber-400 ml-1.5 mt-1">
            °{unit}
          </span>
        </div>

        {/* Estado y Rangos del Día */}
        <div className="flex flex-col items-end text-right">
          <div className="flex items-center gap-2 text-base font-bold text-white">
            {getConditionIcon(current.weatherCode)}
            <span className="capitalize">{current.conditionText}</span>
          </div>
          <div className="text-xs font-semibold text-slate-300 mt-1">
            Máx: <span className="text-amber-400 font-bold">{maxTemp}°</span> • Mín: <span className="text-sky-300 font-bold">{minTemp}°</span>
          </div>
          <div className="text-xs font-semibold text-sky-400 flex items-center gap-1 mt-1 bg-sky-500/10 px-2 py-0.5 rounded-full border border-sky-500/20">
            <Thermometer className="w-3.5 h-3.5" />
            <span>Sensación: {feelsLike}°{unit}</span>
          </div>
        </div>
      </div>

      {/* Tres Estadísticas Clave en estilo Liquid Glass */}
      <div className="grid grid-cols-3 gap-2.5 pt-2 border-t border-white/[0.08]">
        <div className="flex items-center gap-2.5 p-2.5 rounded-2xl bg-white/[0.04] border border-white/[0.07] shadow-[inset_0_1px_0.5px_rgba(255,255,255,0.12)]">
          <div className="p-1.5 rounded-xl bg-sky-500/15 text-sky-400 flex-shrink-0">
            <Droplets className="w-4 h-4" />
          </div>
          <div className="truncate">
            <span className="block text-[10px] uppercase font-bold text-slate-400">Lluvia</span>
            <span className="text-sm font-extrabold text-white">{current.precipitationProbability}%</span>
          </div>
        </div>

        <div className="flex items-center gap-2.5 p-2.5 rounded-2xl bg-white/[0.04] border border-white/[0.07] shadow-[inset_0_1px_0.5px_rgba(255,255,255,0.12)]">
          <div className="p-1.5 rounded-xl bg-indigo-500/15 text-indigo-400 flex-shrink-0">
            <Droplets className="w-4 h-4" />
          </div>
          <div className="truncate">
            <span className="block text-[10px] uppercase font-bold text-slate-400">Humedad</span>
            <span className="text-sm font-extrabold text-white">{current.humidity}%</span>
          </div>
        </div>

        <div className="flex items-center gap-2.5 p-2.5 rounded-2xl bg-white/[0.04] border border-white/[0.07] shadow-[inset_0_1px_0.5px_rgba(255,255,255,0.12)]">
          <div className="p-1.5 rounded-xl bg-teal-500/15 text-teal-400 flex-shrink-0">
            <Wind className="w-4 h-4" />
          </div>
          <div className="truncate">
            <span className="block text-[10px] uppercase font-bold text-slate-400">Viento</span>
            <span className="text-sm font-extrabold text-white">{windSpeed}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
