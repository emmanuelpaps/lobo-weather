'use client';

import React from 'react';
import { CurrentWeather, TempUnit } from '@/lib/lobo-weather/types';
import { getPawWalkSafety } from '@/lib/lobo-weather/weatherService';
import { ShieldAlert, Wind, Droplets, Sun, Sunrise, Sunset, Flame, Compass } from 'lucide-react';

interface WeatherDetailsGridProps {
  current: CurrentWeather;
  unit: TempUnit;
}

export const WeatherDetailsGrid: React.FC<WeatherDetailsGridProps> = ({ current, unit }) => {
  const pawSafety = getPawWalkSafety(current.temperatureF, current.isDay);
  const windSpeed = unit === 'F' ? `${current.windSpeedMph} mph` : `${current.windSpeedKmh} km/h`;

  const getUvInfo = (uv: number) => {
    if (uv >= 8) return { label: 'Muy Alto', color: 'bg-rose-500/20 text-rose-400 border-rose-500/30' };
    if (uv >= 6) return { label: 'Alto', color: 'bg-amber-500/20 text-amber-400 border-amber-500/30' };
    if (uv >= 3) return { label: 'Moderado', color: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' };
    return { label: 'Bajo', color: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' };
  };

  const uvInfo = getUvInfo(current.uvIndex);

  return (
    <div className="w-full flex flex-col gap-3 select-none">
      {/* 1. Tarjeta Destacada: Semáforo de Patitas estilo Liquid Glass */}
      <div className={`w-full rounded-3xl p-4 border shadow-[inset_0_1px_1px_rgba(255,255,255,0.15),0_12px_36px_rgba(0,0,0,0.35)] backdrop-blur-2xl relative overflow-hidden ${
        pawSafety.level === 'danger'
          ? 'bg-gradient-to-r from-rose-950/60 via-slate-900/60 to-rose-950/50 border-rose-500/40 shadow-rose-950/40'
          : pawSafety.level === 'caution'
          ? 'bg-gradient-to-r from-amber-950/60 via-slate-900/60 to-amber-950/50 border-amber-500/40 shadow-amber-950/40'
          : 'bg-gradient-to-r from-emerald-950/60 via-slate-900/60 to-emerald-950/50 border-emerald-500/40 shadow-emerald-950/40'
      }`}>
        <div className="flex items-start gap-3.5">
          <div className={`p-3 rounded-2xl shadow-md flex-shrink-0 ${
            pawSafety.level === 'danger'
              ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
              : pawSafety.level === 'caution'
              ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
              : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
          }`}>
            {pawSafety.level === 'danger' ? (
              <Flame className="w-6 h-6 animate-bounce text-rose-400" />
            ) : (
              <ShieldAlert className="w-6 h-6" />
            )}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-0.5">
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400">
                Semáforo de Patitas • Ciudad Juárez
              </span>
              <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full border ${
                pawSafety.level === 'danger'
                  ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                  : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
              }`}>
                {pawSafety.level === 'danger' ? '¡Cuidado!' : 'Seguro'}
              </span>
            </div>

            <h4 className="text-base font-extrabold text-white leading-snug">
              {pawSafety.title}
            </h4>

            <p className="text-xs text-slate-200 mt-1 leading-relaxed font-medium">
              {pawSafety.advice}
            </p>
          </div>
        </div>
      </div>

      {/* 2. Grid de 4 Métricas Detalladas estilo Liquid Glass */}
      <div className="grid grid-cols-2 gap-3">
        {/* Viento de Juárez */}
        <div className="rounded-3xl bg-slate-900/55 p-4 border border-white/[0.08] shadow-[inset_0_1px_1px_rgba(255,255,255,0.14),0_12px_32px_rgba(0,0,0,0.35)] backdrop-blur-2xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-[11px] font-extrabold uppercase tracking-wider">Viento</span>
              <Wind className="w-4 h-4 text-teal-400" />
            </div>
            <p className="text-2xl font-extrabold text-white tracking-tight">
              {windSpeed}
            </p>
          </div>
          <div className="mt-2 pt-2 border-t border-white/[0.08] flex items-center justify-between text-[11px]">
            <span className="text-slate-400 truncate">
              {current.windSpeedMph >= 18 ? 'Tolvanera juarense 💨' : 'Brisa suave'}
            </span>
            <Compass className="w-3.5 h-3.5 text-teal-400 flex-shrink-0" />
          </div>
        </div>

        {/* Humedad */}
        <div className="rounded-3xl bg-slate-900/55 p-4 border border-white/[0.08] shadow-[inset_0_1px_1px_rgba(255,255,255,0.14),0_12px_32px_rgba(0,0,0,0.35)] backdrop-blur-2xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-[11px] font-extrabold uppercase tracking-wider">Humedad</span>
              <Droplets className="w-4 h-4 text-sky-400" />
            </div>
            <p className="text-2xl font-extrabold text-white tracking-tight">
              {current.humidity}%
            </p>
          </div>
          <div className="mt-2 pt-2 border-t border-white/[0.08] text-[11px] text-slate-400">
            <span>{current.humidity < 30 ? 'Ambiente seco (Desierto)' : 'Humedad agradable'}</span>
          </div>
        </div>

        {/* Índice UV */}
        <div className="rounded-3xl bg-slate-900/55 p-4 border border-white/[0.08] shadow-[inset_0_1px_1px_rgba(255,255,255,0.14),0_12px_32px_rgba(0,0,0,0.35)] backdrop-blur-2xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-[11px] font-extrabold uppercase tracking-wider">Índice UV</span>
              <Sun className="w-4 h-4 text-amber-400" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-extrabold text-white tracking-tight">
                {current.uvIndex}
              </span>
              <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full border ${uvInfo.color}`}>
                {uvInfo.label}
              </span>
            </div>
          </div>
          <div className="mt-2 pt-2 border-t border-white/[0.08] text-[11px] text-slate-400">
            <span>{current.uvIndex >= 6 ? 'Protección solar recomendada' : 'No requiere protección'}</span>
          </div>
        </div>

        {/* Sol en Juárez (Amanecer y Atardecer lado a lado) */}
        <div className="rounded-3xl bg-slate-900/55 p-4 border border-white/[0.08] shadow-[inset_0_1px_1px_rgba(255,255,255,0.14),0_12px_32px_rgba(0,0,0,0.35)] backdrop-blur-2xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-[11px] font-extrabold uppercase tracking-wider">Sol en Juárez</span>
              <Sunset className="w-4 h-4 text-rose-400" />
            </div>

            <div className="flex items-center justify-between gap-1 mt-1">
              <div className="text-left">
                <span className="text-[10px] text-amber-300 font-bold flex items-center gap-1">
                  <Sunrise className="w-3 h-3 text-amber-400" /> Salida
                </span>
                <span className="text-xs font-extrabold text-white block mt-0.5">
                  {current.sunriseTime}
                </span>
              </div>

              <div className="text-right">
                <span className="text-[10px] text-rose-300 font-bold flex items-center justify-end gap-1">
                  <Sunset className="w-3 h-3 text-rose-400" /> Puesta
                </span>
                <span className="text-xs font-extrabold text-white block mt-0.5">
                  {current.sunsetTime}
                </span>
              </div>
            </div>
          </div>

          <div className="mt-2 pt-2 border-t border-slate-800 text-[10px] text-slate-400 flex items-center justify-between">
            <span>Horario de verano</span>
            <span className="text-amber-400 font-bold">Juárez ☀️</span>
          </div>
        </div>
      </div>
    </div>
  );
};
