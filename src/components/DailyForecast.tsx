'use client';

import React, { useState } from 'react';
import { DailyForecastItem, TempUnit, CurrentWeather } from '@/lib/lobo-weather/types';
import { Sun, CloudRain, CloudSun, CloudLightning, Snowflake, Cloud, ChevronDown, ChevronUp, Sparkles, Heart } from 'lucide-react';

interface DailyForecastProps {
  daily: DailyForecastItem[];
  unit: TempUnit;
  currentTemp?: number;
}

export const DailyForecast: React.FC<DailyForecastProps> = ({ daily, unit, currentTemp = 70 }) => {
  const [expandedIdx, setExpandedIdx] = useState<number | null>(null);

  if (!daily || daily.length === 0) return null;

  // Encontrar el rango global para las barras proporcionales
  const allMins = daily.map(d => (unit === 'F' ? d.minTempF : d.minTempC));
  const allMaxs = daily.map(d => (unit === 'F' ? d.maxTempF : d.maxTempC));
  const globalMin = Math.min(...allMins);
  const globalMax = Math.max(...allMaxs);
  const globalRange = Math.max(1, globalMax - globalMin);

  // Sanitización de iconos estricta: Jamás poner nieve si la temperatura es cálida (>50°F / 10°C)
  const getWeatherIcon = (code: number, maxF: number) => {
    if (code >= 95) return <CloudLightning className="w-4 h-4 text-purple-400" />;
    if (code >= 71 && maxF <= 45) return <Snowflake className="w-4 h-4 text-blue-300" />;
    if (code >= 51 || code >= 80) return <CloudRain className="w-4 h-4 text-sky-400" />;
    if (code === 3) return <Cloud className="w-4 h-4 text-slate-400" />;
    if (code === 1 || code === 2) return <CloudSun className="w-4 h-4 text-amber-400" />;
    return <Sun className="w-4 h-4 text-amber-400" />;
  };

  // Consejos personalizados de Lobo para cada día de la semana
  const getLoboDayTip = (dayName: string, maxF: number, code: number) => {
    if (code >= 95) {
      return "Lobo dice: Hay pronóstico de tormenta... día oficial para que Corazoncillo me abrace en la sala 🥺⚡";
    }
    if (code >= 51 || code >= 80) {
      return "Lobo dice: Día con lluvia agradable en Juárez. Perfecto para café caliente y botitas amarillas 🌧️☕";
    }
    if (maxF >= 94) {
      return "Lobo dice: ¡Mucho calor en Juárez! No salgas al sol a mediodía Corazoncillo, quédate en el aire fresquito 🔥";
    }
    if (maxF >= 88) {
      return "Lobo dice: Tarde calurosa y soleada. Lobo aprueba helados y una salida tranquila con amorcillo 🍦🐾";
    }
    return "Lobo dice: Clima templado y precioso en Campestre Senecú. ¡Día de 10 para pasear juntos! ✨";
  };

  const toggleDay = (idx: number) => {
    setExpandedIdx(prev => (prev === idx ? null : idx));
  };

  return (
    <div className="w-full rounded-3xl bg-slate-900/55 p-4 border border-white/[0.08] shadow-[inset_0_1px_1px_rgba(255,255,255,0.14),0_12px_32px_rgba(0,0,0,0.35)] backdrop-blur-2xl select-none">
      <div className="flex items-center justify-between mb-3 pb-2 border-b border-white/[0.08]">
        <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-300 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-sky-400 animate-pulse" />
          Pronóstico de 7 Días
        </h3>
        <span className="text-[10px] text-slate-400 font-medium">
          Toca un día para ver el plan 🐾
        </span>
      </div>

      <div className="flex flex-col divide-y divide-white/[0.06]">
        {daily.map((day, idx) => {
          const min = unit === 'F' ? day.minTempF : day.minTempC;
          const max = unit === 'F' ? day.maxTempF : day.maxTempC;
          const isToday = idx === 0;
          const isExpanded = expandedIdx === idx;

          // Cálculo proporcional de la barra
          const leftPercent = ((min - globalMin) / globalRange) * 100;
          const widthPercent = Math.max(20, ((max - min) / globalRange) * 100);

          // Posición del punto de temperatura actual (estilo Apple Weather) en "Hoy"
          let currentMarkerPercent = 50;
          if (max > min) {
            currentMarkerPercent = Math.min(100, Math.max(0, ((currentTemp - min) / (max - min)) * 100));
          }

          return (
            <div key={idx} className="flex flex-col">
              {/* Fila del Día (Tocable para expandir) */}
              <div
                onClick={() => toggleDay(idx)}
                className={`flex items-center justify-between py-2.5 px-2 rounded-2xl cursor-pointer transition-all ${
                  isExpanded
                    ? 'bg-slate-850 border border-slate-700/60'
                    : isToday
                    ? 'bg-sky-500/5 hover:bg-slate-850/60'
                    : 'hover:bg-slate-850/60'
                }`}
              >
                {/* Día y Fecha */}
                <div className="w-16 flex-shrink-0">
                  <div className="flex items-center gap-1.5">
                    <span className={`font-extrabold text-xs ${isToday ? 'text-amber-300' : 'text-white'}`}>
                      {day.dayName}
                    </span>
                    {isToday && (
                      <span className="text-[9px] font-black px-1.5 py-0.2 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                        HOY
                      </span>
                    )}
                  </div>
                  <span className="text-[10px] text-slate-400 block mt-0.5">
                    {day.dateLabel}
                  </span>
                </div>

                {/* Ícono de clima y probabilidad */}
                <div className="flex items-center gap-1.5 w-14 flex-shrink-0">
                  {getWeatherIcon(day.weatherCode, day.maxTempF)}
                  {day.precipitationProb > 15 ? (
                    <span className="text-[10px] font-bold text-sky-400">
                      {day.precipitationProb}%
                    </span>
                  ) : (
                    <span className="text-[10px] text-slate-600">•</span>
                  )}
                </div>

                {/* Barra Térmica Inteligente estilo Apple Weather */}
                <div className="flex-1 flex items-center gap-2 max-w-[165px]">
                  <span className="text-[11px] font-semibold text-slate-400 w-6 text-right">
                    {min}°
                  </span>

                  <div className="flex-1 h-2 bg-white/[0.08] rounded-full relative overflow-hidden border border-white/[0.06]">
                    {/* Gradiente térmico (azul/verde -> ámbar -> rojo) */}
                    <div
                      className="absolute top-0 bottom-0 rounded-full bg-gradient-to-r from-sky-400 via-amber-400 to-rose-500"
                      style={{
                        left: `${leftPercent}%`,
                        width: `${widthPercent}%`,
                      }}
                    />

                    {/* Indicador de temperatura actual ● en la barra de "Hoy" */}
                    {isToday && (
                      <div
                        className="absolute top-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full bg-white shadow-[0_0_6px_white] border border-slate-900"
                        style={{ left: `calc(${currentMarkerPercent}% - 5px)` }}
                        title={`Ahora: ${currentTemp}°`}
                      />
                    )}
                  </div>

                  <span className="text-[11px] font-bold text-white w-6 text-left">
                    {max}°
                  </span>

                  <div className="text-slate-500 ml-1">
                    {isExpanded ? <ChevronUp className="w-3.5 h-3.5 text-amber-400" /> : <ChevronDown className="w-3.5 h-3.5" />}
                  </div>
                </div>
              </div>

              {/* Fila Desplegable: "El Plan de Lobo" estilo Liquid Glass */}
              {isExpanded && (
                <div className="mb-2 p-3 rounded-2xl bg-white/[0.04] border border-white/[0.08] shadow-[inset_0_1px_0.5px_rgba(255,255,255,0.1)] backdrop-blur-md animate-fadeIn">
                  <div className="flex items-start gap-2.5">
                    <div className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0 border border-amber-400 shadow">
                      <img src="/lobo/icon.jpg" alt="Lobo" className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-0.5">
                        <span className="text-[11px] font-bold text-amber-300">
                          Plan de Lobo para {day.dayName}:
                        </span>
                        <span className="text-[10px] text-slate-400">
                          {day.conditionText}
                        </span>
                      </div>
                      <p className="text-xs font-semibold text-slate-100 leading-snug">
                        {getLoboDayTip(day.dayName, day.maxTempF, day.weatherCode)}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
