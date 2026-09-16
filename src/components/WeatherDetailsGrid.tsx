'use client';

import React from 'react';
import { CurrentWeather, TempUnit } from '@/lib/lobo-weather/types';
import { getPawWalkSafety, getJuarezLocalTime } from '@/lib/lobo-weather/weatherService';
import { ShieldAlert, Droplets, Sun, Sunrise, Sunset, Flame, Moon, Sparkles } from 'lucide-react';

interface WeatherDetailsGridProps {
  current: CurrentWeather;
  unit: TempUnit;
}

export const WeatherDetailsGrid: React.FC<WeatherDetailsGridProps> = ({ current, unit }) => {
  const pawSafety = getPawWalkSafety(current.temperatureF, current.isDay);

  // 1. Cálculo de Temperatura Estimada de Asfalto en el Desierto de Juárez
  // En Juárez a pleno sol el pavimento negro absorbe calor y supera la temperatura ambiente por 25°F a 35°F
  const asphaltTempF = current.isDay && current.temperatureF >= 70
    ? Math.round(current.temperatureF + (current.uvIndex >= 6 ? 32 : 22))
    : current.temperatureF;
  const asphaltTempDisplay = unit === 'F' ? `${asphaltTempF}°F` : `${Math.round(((asphaltTempF - 32) * 5) / 9)}°C`;

  // 2. Parseo de Horarios de Sol (Amanecer / Puesta)
  const parseTimeToMinutes = (timeStr?: string): number => {
    if (!timeStr) return 408; // 6:48 AM
    const match = timeStr.match(/(\d+):(\d+)\s*(AM|PM)/i);
    if (!match) return 408;
    let h = parseInt(match[1], 10);
    const m = parseInt(match[2], 10);
    const ampm = match[3].toUpperCase();
    if (ampm === 'PM' && h < 12) h += 12;
    if (ampm === 'AM' && h === 12) h = 0;
    return h * 60 + m;
  };

  const sunriseMin = parseTimeToMinutes(current.sunriseTime);
  const sunsetMin = parseTimeToMinutes(current.sunsetTime);
  const jTime = getJuarezLocalTime();
  const currentMin = jTime.hour * 60 + jTime.minute;

  const isDaytime = currentMin >= sunriseMin && currentMin <= sunsetMin;
  const dayDurationMin = Math.max(60, sunsetMin - sunriseMin);
  const dayProgress = isDaytime
    ? Math.max(0.04, Math.min(0.96, (currentMin - sunriseMin) / dayDurationMin))
    : 0;

  // Coordenadas Bézier Cuadrática en SVG: M 20 72 Q 160 14 300 72
  const t = dayProgress;
  const sunX = (1 - t) * (1 - t) * 20 + 2 * (1 - t) * t * 160 + t * t * 300;
  const sunY = (1 - t) * (1 - t) * 72 + 2 * (1 - t) * t * 14 + t * t * 72;

  const remainingMin = isDaytime ? Math.max(0, sunsetMin - currentMin) : 0;
  const remHours = Math.floor(remainingMin / 60);
  const remM = remainingMin % 60;

  // 3. Medidor de Índice UV
  const uvMax = 11;
  const uvProgress = Math.min(1, current.uvIndex / uvMax);
  // Semi-círculo: radio = 36 -> longitud de arco = PI * 36 = 113.1
  const uvCircumference = Math.PI * 36;
  const uvStrokeDashoffset = uvCircumference * (1 - uvProgress);

  const getUvInfo = (uv: number) => {
    if (uv >= 8) {
      return {
        label: 'Muy Alto',
        badge: 'bg-rose-500/20 text-rose-400 border-rose-500/30',
        advice: '¡Bloqueador indispensable para Amorcillo! ☀️🧴',
      };
    }
    if (uv >= 6) {
      return {
        label: 'Alto',
        badge: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
        advice: 'Ponte protector solar al salir con Lobo 🧢',
      };
    }
    if (uv >= 3) {
      return {
        label: 'Moderado',
        badge: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
        advice: 'Cremita facial con FPS recomendada 🌤️',
      };
    }
    return {
      label: 'Bajo',
      badge: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
      advice: 'Piel 100% segura sin bloqueador ahorita ✨',
    };
  };

  const uvInfo = getUvInfo(current.uvIndex);

  // 4. Medidor de Humedad & Punto de Rocío (Dew Point)
  // Fórmula Magnus aproximada para punto de rocío
  const tC = current.temperatureC;
  const rh = Math.max(1, current.humidity);
  const b = 17.62;
  const c = 243.12;
  const gamma = (b * tC) / (c + tC) + Math.log(rh / 100);
  const dewC = Math.round((c * gamma) / (b - gamma));
  const dewF = Math.round((dewC * 9) / 5 + 32);
  const dewDisplay = unit === 'F' ? `${dewF}°F` : `${dewC}°C`;

  return (
    <div className="w-full flex flex-col gap-3 select-none">
      {/* 1. Semáforo de Patitas con Radar de Asfalto (Exclusivo de Lobo) */}
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
            <div className="flex items-center justify-between gap-1 mb-1">
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400">
                Semáforo de Patitas • Juárez
              </span>
              <span className="text-[11px] font-black px-2 py-0.5 rounded-full bg-white/[0.08] text-amber-300 border border-white/15">
                Piso ~{asphaltTempDisplay}
              </span>
            </div>

            <h4 className="text-base font-extrabold text-white leading-snug">
              {pawSafety.title}
            </h4>

            <p className="text-xs text-slate-200 mt-1 leading-relaxed font-medium">
              {pawSafety.advice}
            </p>

            {/* Barra Visual de Zonas Térmicas para Patitas */}
            <div className="mt-3 pt-2.5 border-t border-white/[0.08] flex items-center gap-2">
              <div className="flex-1 h-2 rounded-full bg-slate-950/80 p-0.5 flex gap-1 border border-white/10 overflow-hidden">
                <div className="flex-1 rounded-full bg-emerald-500/80" title="Zona Segura" />
                <div className="flex-1 rounded-full bg-amber-500/80" title="Zona de Precaución" />
                <div className="flex-1 rounded-full bg-rose-500/80" title="Zona Peligrosa" />
              </div>
              <span className="text-[10px] font-bold text-slate-300 flex items-center gap-1 flex-shrink-0">
                <span>Prueba de 7s</span>
                <span className="text-amber-400">🐾</span>
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Micro-gráfico 1: Arco Solar en Vivo de Ciudad Juárez (Ancho Completo) */}
      <div className="w-full rounded-3xl bg-slate-900/55 p-4 border border-white/[0.08] shadow-[inset_0_1px_1px_rgba(255,255,255,0.14),0_12px_32px_rgba(0,0,0,0.35)] backdrop-blur-2xl relative overflow-hidden">
        {/* Encabezado del Arco */}
        <div className="flex items-center justify-between mb-1">
          <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
            {isDaytime ? <Sun className="w-3.5 h-3.5 text-amber-400" /> : <Moon className="w-3.5 h-3.5 text-indigo-400" />}
            Horizonte Solar • Juárez
          </span>
          <span className="text-[11px] font-extrabold text-amber-300 bg-amber-400/10 px-2.5 py-0.5 rounded-full border border-amber-400/20">
            {isDaytime ? `Quedan ${remHours}h ${remM}m de sol` : 'Noche estrellada en el desierto'}
          </span>
        </div>

        {/* Gráfico Parabólico SVG del Sol en Vivo */}
        <div className="w-full pt-1 pb-0">
          <svg viewBox="0 0 320 85" className="w-full h-auto overflow-visible">
            <defs>
              {/* Gradiente del cielo bajo el arco */}
              <linearGradient id="solarGlow" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#F59E0B" stopOpacity="0.28" />
                <stop offset="100%" stopColor="#F59E0B" stopOpacity="0.0" />
              </linearGradient>
              <linearGradient id="arcStroke" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#F59E0B" />
                <stop offset="50%" stopColor="#FDE047" />
                <stop offset="100%" stopColor="#F43F5E" />
              </linearGradient>
            </defs>

            {/* Área sombreada bajo el arco diurno */}
            <path
              d="M 20 72 Q 160 14 300 72 L 300 72 L 20 72 Z"
              fill="url(#solarGlow)"
            />

            {/* Línea de horizonte de Juárez */}
            <line
              x1="10"
              y1="72"
              x2="310"
              y2="72"
              stroke="rgba(255,255,255,0.12)"
              strokeWidth="1.5"
              strokeDasharray="3 3"
            />

            {/* Arco parabólico del recorrido solar */}
            <path
              d="M 20 72 Q 160 14 300 72"
              fill="none"
              stroke="url(#arcStroke)"
              strokeWidth="2.5"
              strokeLinecap="round"
            />

            {/* Punto del Sol en Tiempo Real con pulso */}
            {isDaytime ? (
              <g>
                <circle
                  cx={sunX}
                  cy={sunY}
                  r="12"
                  fill="#F59E0B"
                  opacity="0.3"
                  className="animate-ping"
                  style={{ animationDuration: '2.5s', transformOrigin: `${sunX}px ${sunY}px` }}
                />
                <circle
                  cx={sunX}
                  cy={sunY}
                  r="7"
                  fill="#FBBF24"
                  stroke="#FFFFFF"
                  strokeWidth="2"
                  className="drop-shadow-[0_0_10px_rgba(251,191,36,0.95)]"
                />
              </g>
            ) : (
              <g>
                {/* Luna serena nocturna sobre el horizonte */}
                <circle
                  cx="160"
                  cy="45"
                  r="7"
                  fill="#E2E8F0"
                  className="drop-shadow-[0_0_8px_rgba(226,232,240,0.8)]"
                />
                <path
                  d="M 162 39 A 7 7 0 0 0 162 51 A 5.5 5.5 0 0 1 162 39"
                  fill="#0F172A"
                />
              </g>
            )}
          </svg>
        </div>

        {/* Marcadores de Salida y Puesta al pie del arco */}
        <div className="flex items-center justify-between text-xs font-semibold pt-1 border-t border-white/[0.08]">
          <div className="flex items-center gap-1 text-amber-300">
            <Sunrise className="w-4 h-4 text-amber-400" />
            <span>Salida {current.sunriseTime}</span>
          </div>
          <div className="flex items-center gap-1 text-rose-300">
            <Sunset className="w-4 h-4 text-rose-400" />
            <span>Puesta {current.sunsetTime}</span>
          </div>
        </div>
      </div>

      {/* 3. Grid de 2 Columnas: Índice UV & Humedad Desértica */}
      <div className="grid grid-cols-2 gap-3">
        {/* Micro-gráfico 2: Medidor Radial de Índice UV (Apple Watch Complication) */}
        <div className="rounded-3xl bg-slate-900/55 p-3.5 border border-white/[0.08] shadow-[inset_0_1px_1px_rgba(255,255,255,0.14),0_12px_32px_rgba(0,0,0,0.35)] backdrop-blur-2xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-slate-400 mb-1">
              <span className="text-[10px] font-extrabold uppercase tracking-wider">Índice UV</span>
              <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full border ${uvInfo.badge}`}>
                {uvInfo.label}
              </span>
            </div>

            {/* Dial Semicircular SVG */}
            <div className="relative flex justify-center items-center py-1">
              <svg width="86" height="50" viewBox="0 0 86 50" className="overflow-visible">
                <defs>
                  <linearGradient id="uvDialGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#10B981" />
                    <stop offset="35%" stopColor="#F59E0B" />
                    <stop offset="70%" stopColor="#F97316" />
                    <stop offset="100%" stopColor="#EC4899" />
                  </linearGradient>
                </defs>
                {/* Arco base de fondo */}
                <path
                  d="M 7 43 A 36 36 0 0 1 79 43"
                  fill="none"
                  stroke="rgba(255,255,255,0.1)"
                  strokeWidth="7"
                  strokeLinecap="round"
                />
                {/* Arco de progreso de UV */}
                <path
                  d="M 7 43 A 36 36 0 0 1 79 43"
                  fill="none"
                  stroke="url(#uvDialGradient)"
                  strokeWidth="7"
                  strokeLinecap="round"
                  strokeDasharray={uvCircumference}
                  strokeDashoffset={uvStrokeDashoffset}
                  className="transition-all duration-700 ease-out"
                />
              </svg>

              {/* Número central del UV */}
              <div className="absolute bottom-0 inset-x-0 text-center">
                <span className="text-xl font-black text-white tracking-tight">
                  {current.uvIndex}
                </span>
                <span className="text-[10px] text-slate-400 font-bold ml-0.5">/ 11+</span>
              </div>
            </div>
          </div>

          <div className="mt-2 pt-2 border-t border-white/[0.08] text-[10px] text-slate-300 font-medium leading-snug">
            {uvInfo.advice}
          </div>
        </div>

        {/* Micro-gráfico 3: Barra de Humedad & Confort Térmico Desértico */}
        <div className="rounded-3xl bg-slate-900/55 p-3.5 border border-white/[0.08] shadow-[inset_0_1px_1px_rgba(255,255,255,0.14),0_12px_32px_rgba(0,0,0,0.35)] backdrop-blur-2xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-slate-400 mb-1">
              <span className="text-[10px] font-extrabold uppercase tracking-wider">Humedad</span>
              <Droplets className="w-3.5 h-3.5 text-sky-400" />
            </div>

            <div className="flex items-baseline justify-between mt-1">
              <span className="text-2xl font-black text-white tracking-tight">
                {current.humidity}%
              </span>
              <span className="text-[10px] font-bold text-sky-300 bg-sky-500/15 px-2 py-0.5 rounded-full border border-sky-500/25">
                Rocío {dewDisplay}
              </span>
            </div>

            {/* Barra de Humedad Dinámica con Gradiente Líquido */}
            <div className="mt-2.5 w-full h-2 rounded-full bg-slate-950/80 p-0.5 border border-white/10 overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-sky-400 to-cyan-300 shadow-[0_0_8px_rgba(56,189,248,0.7)] transition-all duration-700"
                style={{ width: `${Math.max(8, Math.min(100, current.humidity))}%` }}
              />
            </div>
          </div>

          <div className="mt-2 pt-2 border-t border-white/[0.08] text-[10px] text-slate-300 font-medium leading-snug">
            {current.humidity < 30
              ? 'Desierto seco: ¡Toma agüita hoy, Amorcillo! 🥤'
              : 'Nivel de humedad confortable en Senecú 💧'}
          </div>
        </div>
      </div>
    </div>
  );
};
