'use client';

import React, { useState } from 'react';
import { DayPartItem, TempUnit } from '@/lib/lobo-weather/types';
import { Coffee, Sun, Sunset, Moon, Sparkles, ChevronDown, ChevronUp } from 'lucide-react';

interface DayPartsOverviewProps {
  dayParts: DayPartItem[];
  unit: TempUnit;
}

export const DayPartsOverview: React.FC<DayPartsOverviewProps> = ({ dayParts, unit }) => {
  const [expandedKey, setExpandedKey] = useState<string | null>(null);

  if (!dayParts || dayParts.length === 0) return null;

  const getPartIcon = (key: string) => {
    switch (key) {
      case 'morning':
        return <Coffee className="w-4 h-4 text-amber-300" />;
      case 'afternoon':
        return <Sun className="w-4 h-4 text-orange-400" />;
      case 'sunset':
        return <Sunset className="w-4 h-4 text-rose-400" />;
      case 'night':
        return <Moon className="w-4 h-4 text-indigo-300" />;
      default:
        return <Sun className="w-4 h-4 text-amber-400" />;
    }
  };

  const getCardTheme = (key: string, isCurrent: boolean) => {
    if (isCurrent) {
      return 'bg-amber-500/15 backdrop-blur-xl border-amber-400/50 shadow-[inset_0_1px_1px_rgba(255,255,255,0.2),0_8px_20px_rgba(245,158,11,0.15)] ring-1 ring-amber-400/30';
    }
    return 'bg-white/[0.04] hover:bg-white/[0.07] border-white/[0.07] shadow-[inset_0_1px_0.5px_rgba(255,255,255,0.1)]';
  };

  const toggleExpand = (key: string) => {
    setExpandedKey(prev => (prev === key ? null : key));
  };

  return (
    <div className="w-full rounded-3xl bg-slate-900/55 p-4 border border-white/[0.08] shadow-[inset_0_1px_1px_rgba(255,255,255,0.14),0_12px_32px_rgba(0,0,0,0.35)] backdrop-blur-2xl select-none">
      {/* Header */}
      <div className="flex items-center justify-between mb-3 pb-2.5 border-b border-white/[0.08]">
        <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-300 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
          4 Momentos del Día en Juárez
        </h3>
        <span className="text-[10px] text-slate-400 font-medium">
          Toca para ver el tip 🐺
        </span>
      </div>

      {/* Grid 2x2 de los 4 momentos */}
      <div className="grid grid-cols-2 gap-2.5">
        {dayParts.map(part => {
          const temp = unit === 'F' ? part.tempF : part.tempC;
          const isExpanded = expandedKey === part.key;

          return (
            <div
              key={part.key}
              onClick={() => toggleExpand(part.key)}
              className={`rounded-2xl p-3 border transition-all cursor-pointer flex flex-col justify-between ${getCardTheme(
                part.key,
                part.isCurrent
              )}`}
            >
              {/* Parte Superior: Icono y Nombre */}
              <div>
                <div className="flex items-center justify-between gap-1 mb-1.5">
                  <div className="flex items-center gap-1.5">
                    <div className="p-1 rounded-lg bg-slate-950/70 border border-slate-800">
                      {getPartIcon(part.key)}
                    </div>
                    <span className="text-xs font-extrabold text-white">
                      {part.name}
                    </span>
                  </div>

                  {part.isCurrent ? (
                    <span className="text-[9px] font-black px-1.5 py-0.2 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/40 animate-pulse">
                      AHORA
                    </span>
                  ) : (
                    <span className="text-slate-500">
                      {isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                    </span>
                  )}
                </div>

                <span className="text-[10px] text-slate-400 block font-medium">
                  {part.timeRange}
                </span>

                {/* Temperatura del bloque */}
                <div className="mt-2 flex items-baseline gap-1">
                  <span className="text-2xl font-black text-white tracking-tight">
                    {temp}°
                  </span>
                  <span className="text-xs font-bold text-amber-400">
                    {unit}
                  </span>
                </div>
              </div>

              {/* Mensaje Cariñoso para Miriam */}
              <p className="text-[11px] text-slate-300 mt-2 line-clamp-2 leading-tight font-medium">
                {part.advice}
              </p>

              {/* Tip de Lobo desplegable */}
              {isExpanded && (
                <div className="mt-2.5 pt-2 border-t border-slate-700/60 animate-fadeIn">
                  <div className="flex items-start gap-1.5">
                    <Sparkles className="w-3 h-3 text-amber-400 flex-shrink-0 mt-0.5" />
                    <p className="text-[10px] text-amber-300 font-semibold leading-snug">
                      {part.loboTip}
                    </p>
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
