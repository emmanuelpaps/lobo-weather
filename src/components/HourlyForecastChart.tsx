'use client';

import React, { useState } from 'react';
import { HourlyForecastItem, TempUnit, LoboMood } from '@/lib/lobo-weather/types';
import { calculateLoboMood } from '@/lib/lobo-weather/weatherConditions';
import { MOOD_DETAILS } from '@/lib/lobo-weather/weatherConditions';
import { Sun, CloudRain, CloudSun, Moon, CloudLightning, Snowflake, Cloud, Droplets, Wind, Thermometer, RotateCcw, Clock, Sparkles } from 'lucide-react';

interface HourlyForecastChartProps {
  hourly: HourlyForecastItem[];
  unit: TempUnit;
}

export const HourlyForecastChart: React.FC<HourlyForecastChartProps> = ({ hourly, unit }) => {
  const [activeTab, setActiveTab] = useState<'temp' | 'rain' | 'wind'>('temp');
  const [selectedHourIdx, setSelectedHourIdx] = useState<number | null>(null);

  const items = hourly.slice(0, 18);
  if (items.length === 0) return null;

  const temps = items.map(item => (unit === 'F' ? item.tempF : item.tempC));
  const rawMin = Math.min(...temps);
  const rawMax = Math.max(...temps);

  // Escala adaptativa inteligente: si la variación es muy pequeña (ej. 69°-70°),
  // expandimos la escala visual para que la curva siempre tenga ondulación suave y orgánica, nunca una línea plana
  const isNearlyFlat = rawMax - rawMin < 4;
  const effectiveMin = isNearlyFlat ? rawMin - 3 : rawMin - 1;
  const effectiveMax = isNearlyFlat ? rawMax + 3 : rawMax + 1;
  const tempRange = Math.max(2, effectiveMax - effectiveMin);

  // Dimensiones SVG
  const itemWidth = 62;
  const chartHeight = 90;
  const paddingY = 24;
  const availableHeight = chartHeight - paddingY * 2;
  const svgWidth = items.length * itemWidth;

  // Puntos calculados con escala adaptativa
  const points = temps.map((temp, i) => {
    const x = i * itemWidth + itemWidth / 2;
    // Si es casi plano, añadimos una sutil micro-ondulación senoidal imperceptible para dar vida orgánica
    const subtleSine = isNearlyFlat ? Math.sin(i * 0.8) * 3.5 : 0;
    const normalized = (temp - effectiveMin) / tempRange;
    const y = chartHeight - paddingY - (normalized * availableHeight) - subtleSine;
    return { x, y, temp };
  });

  // Curva bezier cúbica suave (Google Weather style)
  let pathD = `M ${points[0].x} ${points[0].y}`;
  for (let i = 0; i < points.length - 1; i++) {
    const curr = points[i];
    const next = points[i + 1];
    const cp1x = curr.x + (next.x - curr.x) / 2;
    const cp1y = curr.y;
    const cp2x = curr.x + (next.x - curr.x) / 2;
    const cp2y = next.y;
    pathD += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${next.x} ${next.y}`;
  }

  const areaD = `${pathD} L ${points[points.length - 1].x} ${chartHeight} L ${points[0].x} ${chartHeight} Z`;

  // Sanitización de iconos: si la temperatura es cálida (>55°F), nunca mostrar nieve
  const getWeatherIcon = (code: number, isDay: boolean, tempF: number) => {
    if (code >= 95) return <CloudLightning className="w-4 h-4 text-purple-400" />;
    if (code >= 71 && tempF <= 45) return <Snowflake className="w-4 h-4 text-blue-300" />;
    if (code >= 51 || code >= 80) return <CloudRain className="w-4 h-4 text-sky-400" />;
    if (code === 3) return <Cloud className="w-4 h-4 text-slate-400" />;
    if (code === 1 || code === 2) {
      return isDay ? <CloudSun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-300" />;
    }
    return isDay ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-300" />;
  };

  return (
    <div className="w-full rounded-3xl bg-slate-900/55 p-4 border border-white/[0.08] shadow-[inset_0_1px_1px_rgba(255,255,255,0.14),0_12px_32px_rgba(0,0,0,0.35)] backdrop-blur-2xl select-none">
      {/* 1. Header con 3 Pestañas Interactivas estilo Liquid Glass */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 mb-3 pb-2.5 border-b border-white/[0.08]">
        <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-300 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
          Pronóstico por Hora
        </h3>

        {/* Selector de Pestañas [ Temperatura | Lluvia | Viento ] */}
        <div className="flex items-center gap-1 p-1 rounded-2xl bg-white/[0.04] border border-white/[0.08] backdrop-blur-md self-start sm:self-auto">
          <button
            onClick={() => setActiveTab('temp')}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'temp'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30 shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Thermometer className="w-3 h-3" />
            <span>Temp</span>
          </button>
          <button
            onClick={() => setActiveTab('rain')}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'rain'
                ? 'bg-sky-500/20 text-sky-300 border border-sky-500/30 shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Droplets className="w-3 h-3" />
            <span>Lluvia</span>
          </button>
          <button
            onClick={() => setActiveTab('wind')}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'wind'
                ? 'bg-teal-500/20 text-teal-300 border border-teal-500/30 shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Wind className="w-3 h-3" />
            <span>Viento</span>
          </button>
        </div>
      </div>

      {/* 2. Contenedor Deslizable con Scrollbar Invisible y Deslizamiento Táctil Nativo */}
      <div className="w-full overflow-x-auto overflow-y-hidden pb-1 -mx-1 px-1 no-scrollbar cursor-grab active:cursor-grabbing">
        <div style={{ width: `${svgWidth}px` }} className="relative">
          {/* VISTA 1: CURVA CONTINUA DE TEMPERATURA */}
          {activeTab === 'temp' && (
            <svg width={svgWidth} height={chartHeight} className="overflow-visible">
              <defs>
                <linearGradient id="loboCurvaGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#f59e0b" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              <path d={areaD} fill="url(#loboCurvaGradient)" />
              <path d={pathD} fill="none" stroke="#fbbf24" strokeWidth="2.5" strokeLinecap="round" />

              {points.map((p, idx) => {
                const isSelected = selectedHourIdx === idx;
                const isNow = idx === 0 && selectedHourIdx === null;

                return (
                  <g key={idx} className="cursor-pointer" onClick={() => setSelectedHourIdx(idx === selectedHourIdx ? null : idx)}>
                    {isSelected && (
                      <line
                        x1={p.x}
                        y1={0}
                        x2={p.x}
                        y2={chartHeight}
                        stroke="#fbbf24"
                        strokeWidth="1.5"
                        strokeDasharray="3,3"
                        className="opacity-75 animate-pulse"
                      />
                    )}
                    <circle
                      cx={p.x}
                      cy={p.y}
                      r={isSelected ? 6 : isNow ? 5 : 3.5}
                      className={`${
                        isSelected
                          ? 'fill-amber-300 stroke-white stroke-2 ring-4 ring-amber-400/60 shadow-lg'
                          : isNow
                          ? 'fill-amber-300 stroke-amber-500 stroke-2 ring-4 ring-amber-400/30 animate-pulse'
                          : 'fill-amber-400 stroke-slate-900 stroke-2 hover:fill-amber-300'
                      }`}
                    />
                    <text
                      x={p.x}
                      y={p.y - 8}
                      textAnchor="middle"
                      className={`font-extrabold text-[12px] ${
                        isSelected || isNow ? 'fill-amber-300 font-black text-[13px]' : 'fill-white'
                      }`}
                    >
                      {p.temp}°
                    </text>
                  </g>
                );
              })}
            </svg>
          )}

          {/* VISTA 2: BARRAS VERTICALES DE PROBABILIDAD DE LLUVIA */}
          {activeTab === 'rain' && (
            <div className="h-[90px] flex items-end justify-between px-2 pt-4">
              {items.map((item, idx) => {
                const prob = item.precipitationProb;
                const barHeight = Math.max(6, Math.round((prob / 100) * 55));
                const isSelected = selectedHourIdx === idx;

                return (
                  <div
                    key={idx}
                    onClick={() => setSelectedHourIdx(idx === selectedHourIdx ? null : idx)}
                    style={{ width: `${itemWidth}px` }}
                    className="flex flex-col items-center justify-end h-full cursor-pointer group"
                  >
                    <span className={`text-[11px] font-extrabold mb-1 ${isSelected ? 'text-white font-black' : 'text-sky-300'}`}>
                      {prob}%
                    </span>
                    <div className={`w-5 rounded-t-lg bg-slate-800 relative overflow-hidden h-[55px] flex items-end ${
                      isSelected ? 'ring-2 ring-sky-400' : 'group-hover:bg-slate-750'
                    }`}>
                      <div
                        className="w-full rounded-t-lg bg-gradient-to-t from-sky-600 to-sky-400 shadow-md transition-all"
                        style={{ height: `${barHeight}px` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* VISTA 3: BARRAS DE VELOCIDAD DE VIENTO REAL DE JUÁREZ */}
          {activeTab === 'wind' && (
            <div className="h-[90px] flex items-end justify-between px-2 pt-4">
              {items.map((item, idx) => {
                const windVal = unit === 'F' ? item.windSpeedMph : item.windSpeedKmh;
                const isGust = item.windSpeedMph >= 14;
                const barHeight = Math.max(6, Math.min(55, Math.round((windVal / 25) * 55)));
                const isSelected = selectedHourIdx === idx;

                return (
                  <div
                    key={idx}
                    onClick={() => setSelectedHourIdx(idx === selectedHourIdx ? null : idx)}
                    style={{ width: `${itemWidth}px` }}
                    className="flex flex-col items-center justify-end h-full cursor-pointer group"
                  >
                    <span className={`text-[11px] font-extrabold mb-1 ${
                      isSelected ? 'text-white font-black' : isGust ? 'text-amber-300' : 'text-teal-300'
                    }`}>
                      {windVal}{unit === 'F' ? 'm' : 'k'}
                    </span>
                    <div className={`w-5 rounded-t-lg bg-slate-800 relative overflow-hidden h-[55px] flex items-end ${
                      isSelected ? 'ring-2 ring-amber-400' : 'group-hover:bg-slate-750'
                    }`}>
                      <div
                        className={`w-full rounded-t-lg transition-all ${
                          isGust
                            ? 'bg-gradient-to-t from-amber-600 to-amber-400'
                            : 'bg-gradient-to-t from-teal-600 to-teal-400'
                        }`}
                        style={{ height: `${barHeight}px` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Fila Inferior de Horas e Íconos */}
          <div className="flex justify-between mt-2 pt-2 border-t border-slate-800">
            {items.map((item, idx) => {
              const isSelected = selectedHourIdx === idx;
              const isNow = idx === 0 && selectedHourIdx === null;

              return (
                <div
                  key={idx}
                  onClick={() => setSelectedHourIdx(idx === selectedHourIdx ? null : idx)}
                  style={{ width: `${itemWidth}px` }}
                  className="flex flex-col items-center justify-center text-center flex-shrink-0 cursor-pointer"
                >
                  <div className="mb-1">
                    {getWeatherIcon(item.weatherCode, item.isDay, item.tempF)}
                  </div>
                  <span
                    className={`text-[11px] font-extrabold transition-all ${
                      isSelected
                        ? 'text-slate-950 bg-amber-400 px-2 py-0.5 rounded-full font-black shadow-md scale-105'
                        : isNow
                        ? 'text-amber-300 bg-amber-500/20 px-1.5 py-0.5 rounded-full'
                        : 'text-slate-300 hover:text-white'
                    }`}
                  >
                    {item.timeLabel}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* 3. Viaje en el Tiempo con Lobo (Scrubber Preview Card) */}
      {selectedHourIdx !== null ? (
        (() => {
          const selected = items[selectedHourIdx];
          const predictedMood = calculateLoboMood({
            weatherCode: selected.weatherCode,
            tempF: selected.tempF,
            windSpeedMph: selected.windSpeedMph,
            isDay: selected.isDay,
          });
          const moodInfo = MOOD_DETAILS[predictedMood];
          const temp = unit === 'F' ? selected.tempF : selected.tempC;
          const feels = unit === 'F' ? selected.feelsLikeF : selected.feelsLikeC;
          const wind = unit === 'F' ? `${selected.windSpeedMph} mph` : `${selected.windSpeedKmh} km/h`;

          let loboCustomQuote = `A las ${selected.timeLabel} el clima estará templado y agradable en Campestre Senecú. ¡Lobo listo para un buen paseo!`;
          if (selected.tempF >= 90) {
            loboCustomQuote = `A las ${selected.timeLabel} habrá calor fuerte en Juárez (${temp}°). Lobo recomienda aire fresco, agua fría y no pisar pavimento caliente Corazoncillo.`;
          } else if (selected.precipitationProb >= 40) {
            loboCustomQuote = `A las ${selected.timeLabel} se prevé lluvia (${selected.precipitationProb}%). ¡Día de cafecito caliente y botitas para Amorcillo!`;
          } else if (selected.windSpeedMph >= 16) {
            loboCustomQuote = `A las ${selected.timeLabel} habrá viento fuerte (${wind}). Cierra bien ventanas en casa y cuidado con la tierrita al salir.`;
          } else if (predictedMood === 'cloudy') {
            loboCustomQuote = `A las ${selected.timeLabel} el cielo estará nubladito y fresco (${temp}°). ¡Ideal para caminar sin el calor del sol, Corazoncillo!`;
          } else if (!selected.isDay) {
            loboCustomQuote = `A las ${selected.timeLabel} la noche estará fresca y tranquila (${temp}°). Lobo hecho rosquilla durmiendo a tus pies.`;
          }

          return (
            <div className="mt-3 p-3.5 rounded-2xl bg-slate-950/70 border border-amber-400/35 shadow-[inset_0_1px_1px_rgba(255,255,255,0.15),0_8px_24px_rgba(0,0,0,0.4)] backdrop-blur-xl animate-fadeIn">
              <div className="flex items-start justify-between pb-2 mb-2 border-b border-white/[0.08]">
                <div className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-amber-400" />
                  <span className="text-xs font-black uppercase tracking-wider text-amber-300">
                    Viaje en el Tiempo • {selected.timeLabel}
                  </span>
                </div>
                <button
                  onClick={() => setSelectedHourIdx(null)}
                  className="flex items-center gap-1 text-[10px] font-bold text-slate-400 hover:text-white bg-slate-800/80 px-2 py-0.5 rounded-full border border-slate-700 transition-colors"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Volver a Ahora</span>
                </button>
              </div>

              <div className="flex items-start gap-3">
                {/* Mini Avatar de Lobo correspondiente a esa hora */}
                <div className="w-12 h-12 rounded-2xl overflow-hidden flex-shrink-0 border-2 border-amber-400 shadow-md">
                  <img
                    src={moodInfo.imageSrc}
                    alt={`Lobo a las ${selected.timeLabel}`}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-baseline justify-between mb-1">
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-xl font-black text-white">
                        {temp}°{unit}
                      </span>
                      <span className="text-[11px] text-sky-400 font-semibold">
                        Sensación: {feels}°
                      </span>
                    </div>
                    <span className="text-[10px] font-extrabold text-slate-400">
                      {moodInfo.title}
                    </span>
                  </div>

                  <p className="text-xs text-slate-100 font-medium leading-snug">
                    "{loboCustomQuote}"
                  </p>

                  <div className="mt-2 flex items-center gap-3 text-[10px] text-slate-400 font-semibold">
                    <span className="flex items-center gap-1 text-sky-300">
                      <Droplets className="w-3 h-3" /> Lluvia: {selected.precipitationProb}%
                    </span>
                    <span className="flex items-center gap-1 text-teal-300">
                      <Wind className="w-3 h-3" /> Viento: {wind}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          );
        })()
      ) : (
        <div className="mt-2.5 pt-2 border-t border-slate-800/80 text-center text-[11px] text-slate-400 font-medium flex items-center justify-center gap-1.5">
          <Sparkles className="w-3 h-3 text-amber-400" />
          <span>Toca cualquier hora arriba para ver cómo estará Lobo en ese momento 🐺🕒</span>
        </div>
      )}
    </div>
  );
};
