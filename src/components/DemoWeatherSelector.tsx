'use client';

import React, { useState } from 'react';
import { LoboMood } from '@/lib/lobo-weather/types';
import { Sparkles, ChevronUp, ChevronDown, Check, Wand2 } from 'lucide-react';

interface DemoWeatherSelectorProps {
  currentMood: LoboMood;
  isRealTime: boolean;
  onSelectMood: (mood: LoboMood | 'realtime') => void;
}

export const DemoWeatherSelector: React.FC<DemoWeatherSelectorProps> = ({
  currentMood,
  isRealTime,
  onSelectMood,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const scenes: { mood: LoboMood; label: string; emoji: string; desc: string }[] = [
    { mood: 'sunny', label: 'Soleado', emoji: '☀️', desc: '3 poses con helado y pelota' },
    { mood: 'cloudy', label: 'Nublado', emoji: '☁️', desc: 'La X, flor y deck fresco' },
    { mood: 'heat', label: 'Calor Extremo', emoji: '🔥', desc: 'Alberca, cooler y sandía' },
    { mood: 'thunderstorm', label: 'Tormenta', emoji: '⛈️', desc: 'Cobija, mesa y audífonos' },
    { mood: 'winter', label: 'Invierno', emoji: '❄️', desc: 'Bufanda, mono de nieve y trineo' },
    { mood: 'windy', label: 'Tolvanera', emoji: '💨', desc: 'Goggles, papalote y rey' },
    { mood: 'rain', label: 'Lluvia', emoji: '🌧️', desc: 'Impermeable, botas y chocolate' },
    { mood: 'sunset', label: 'Atardecer', emoji: '🌅', desc: 'Cielo rosa y parque Juárez' },
    { mood: 'night', label: 'Noche', emoji: '🌙', desc: 'Rosquita, telescopio y gorrito' },
  ];

  return (
    <div className="w-full select-none">
      {/* Botón de activación estilizado como barra premium Liquid Glass */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-4 py-3 rounded-2xl bg-slate-900/60 hover:bg-slate-850/70 active:scale-[0.98] border border-amber-500/30 text-xs font-bold text-amber-300 shadow-[inset_0_1px_1px_rgba(255,255,255,0.15),0_8px_24px_rgba(0,0,0,0.3)] backdrop-blur-2xl transition-all"
      >
        <div className="flex items-center gap-2">
          <Wand2 className="w-4 h-4 text-amber-400 animate-spin" style={{ animationDuration: '8s' }} />
          <span>Probar las 27 Escenas de Lobo</span>
          {!isRealTime && (
            <span className="text-[10px] bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded-full font-extrabold border border-amber-500/40 shadow-[inset_0_1px_0.5px_rgba(255,255,255,0.15)]">
              Demo Activo
            </span>
          )}
        </div>
        <div className="flex items-center gap-1 text-slate-400">
          <span className="text-[11px] font-medium">{isOpen ? 'Cerrar' : 'Ver todas'}</span>
          {isOpen ? <ChevronDown className="w-4 h-4 text-amber-400" /> : <ChevronUp className="w-4 h-4 text-amber-400" />}
        </div>
      </button>

      {/* Selector de Escenas Expandido estilo Liquid Glass */}
      {isOpen && (
        <div className="mt-2.5 p-3 rounded-3xl bg-slate-900/60 border border-white/[0.08] shadow-[inset_0_1px_1px_rgba(255,255,255,0.15),0_16px_36px_rgba(0,0,0,0.4)] backdrop-blur-2xl grid grid-cols-2 gap-2 animate-fadeIn">
          {/* Botón Tiempo Real */}
          <button
            onClick={() => {
              onSelectMood('realtime');
              setIsOpen(false);
            }}
            className={`col-span-2 flex items-center justify-between p-3 rounded-2xl text-left text-xs transition-all ${
              isRealTime
                ? 'bg-sky-500 text-white font-extrabold shadow-lg shadow-sky-500/30'
                : 'bg-white/[0.04] text-slate-200 hover:bg-white/[0.08] border border-white/[0.08] shadow-[inset_0_1px_0.5px_rgba(255,255,255,0.1)]'
            }`}
          >
            <div className="flex items-center gap-2">
              <span className="text-base">📡</span>
              <div>
                <span className="block font-bold">Tiempo Real en Juárez</span>
                <span className={`text-[10px] block ${isRealTime ? 'text-sky-100' : 'text-slate-400'}`}>
                  Sincronizado con Campestre Senecú
                </span>
              </div>
            </div>
            {isRealTime && <Check className="w-4 h-4" />}
          </button>

          {/* 9 Estados del Clima */}
          {scenes.map(s => {
            const isActive = !isRealTime && currentMood === s.mood;
            return (
              <button
                key={s.mood}
                onClick={() => {
                  onSelectMood(s.mood);
                  setIsOpen(false);
                }}
                className={`flex items-center justify-between p-2.5 rounded-2xl text-left text-xs transition-all ${
                  isActive
                    ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-white font-extrabold shadow-lg shadow-amber-500/30'
                    : 'bg-white/[0.04] text-slate-200 hover:bg-white/[0.08] border border-white/[0.06] shadow-[inset_0_1px_0.5px_rgba(255,255,255,0.08)]'
                }`}
              >
                <div className="truncate pr-1">
                  <span className="block font-bold truncate">
                    {s.emoji} {s.label}
                  </span>
                  <span className={`text-[10px] block truncate ${isActive ? 'text-amber-100' : 'text-slate-400'}`}>
                    {s.desc}
                  </span>
                </div>
                {isActive && <Check className="w-3.5 h-3.5 flex-shrink-0" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};
