'use client';

import React from 'react';
import { TempUnit } from '@/lib/lobo-weather/types';
import { MapPin, Sparkles, Clock } from 'lucide-react';

interface WeatherHeaderProps {
  unit: TempUnit;
  onToggleUnit: (unit: TempUnit) => void;
  city: string;
  neighborhood: string;
  lastUpdated: string;
  isGpsActive?: boolean;
  onRequestGps?: () => void;
}

export const WeatherHeader: React.FC<WeatherHeaderProps> = ({
  unit,
  onToggleUnit,
  city,
  neighborhood,
  lastUpdated,
  isGpsActive = false,
  onRequestGps,
}) => {
  const currentHour = new Date().getHours();
  let greeting = '¡Buenos días, Corazoncillo!';
  if (currentHour >= 12 && currentHour < 19) {
    greeting = '¡Buenas tardes, Amorcillo!';
  } else if (currentHour >= 19 || currentHour < 5) {
    greeting = '¡Buenas noches, Corazoncillo!';
  }

  return (
    <header className="w-full flex flex-col gap-2.5 pt-1 select-none">
      {/* 1. Barra Superior: Ubicación y Switch °F/°C */}
      <div className="flex items-center justify-between">
        <div 
          onClick={onRequestGps}
          className="flex items-center gap-2 cursor-pointer group"
          title="Toca para actualizar tu ubicación exacta"
        >
          <div className="p-2 rounded-xl bg-sky-500/10 border border-sky-500/20 text-sky-400 group-hover:bg-sky-500/20 transition-all">
            <MapPin className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h1 className="text-base font-extrabold text-white leading-tight">
                {neighborhood}
              </h1>
              {isGpsActive && (
                <span className="flex items-center gap-1 text-[9px] font-black text-emerald-300 bg-emerald-500/20 px-1.5 py-0.2 rounded-full border border-emerald-500/30">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  GPS
                </span>
              )}
            </div>
            <p className="text-xs font-medium text-slate-400 flex items-center gap-1">
              <span>{city}</span>
              <span className="text-[10px] text-sky-400 opacity-0 group-hover:opacity-100 transition-opacity">
                • Toca para ubicar
              </span>
            </p>
          </div>
        </div>

        {/* Toggle °F / °C estilo Google */}
        <div className="flex items-center p-1 rounded-2xl bg-slate-900 border border-slate-700/80 shadow-inner">
          <button
            onClick={() => onToggleUnit('F')}
            className={`px-3 py-1 text-xs font-extrabold rounded-xl transition-all ${
              unit === 'F'
                ? 'bg-sky-500 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            °F
          </button>
          <button
            onClick={() => onToggleUnit('C')}
            className={`px-3 py-1 text-xs font-extrabold rounded-xl transition-all ${
              unit === 'C'
                ? 'bg-sky-500 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            °C
          </button>
        </div>
      </div>

      {/* 2. Banner Cariñoso de Saludo para Corazoncillo / Amorcillo */}
      <div className="w-full flex items-center justify-between px-3.5 py-2 rounded-2xl bg-gradient-to-r from-rose-500/15 via-purple-500/10 to-sky-500/10 border border-rose-500/25 shadow-sm">
        <div className="flex items-center gap-2 text-xs font-bold text-rose-300">
          <Sparkles className="w-4 h-4 text-rose-400 animate-pulse" />
          <span>{greeting}</span>
        </div>
        <div className="flex items-center gap-1 text-[11px] font-medium text-slate-400">
          <Clock className="w-3 h-3 text-slate-500" />
          <span>Act. {lastUpdated}</span>
        </div>
      </div>
    </header>
  );
};
