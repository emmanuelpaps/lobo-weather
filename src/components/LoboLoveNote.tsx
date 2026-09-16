'use client';

import React, { useState } from 'react';
import { Heart, Sparkles, RefreshCw, Send } from 'lucide-react';
import { TAP_EASTER_EGGS } from '@/lib/lobo-weather/loboPhrases';

export const LoboLoveNote: React.FC = () => {
  const [noteIdx, setNoteIdx] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const handleNextNote = () => {
    setIsAnimating(true);
    setTimeout(() => {
      setNoteIdx(prev => (prev + 1) % TAP_EASTER_EGGS.length);
      setIsAnimating(false);
    }, 250);
  };

  return (
    <div className="w-full rounded-3xl bg-gradient-to-br from-rose-950/50 via-slate-900/60 to-slate-950/70 border border-rose-500/35 p-4 shadow-[inset_0_1px_1px_rgba(255,255,255,0.18),0_16px_36px_rgba(244,63,94,0.18)] backdrop-blur-2xl select-none relative overflow-hidden">
      {/* Resplandor decorativo de fondo */}
      <div className="absolute -top-10 -right-10 w-32 h-32 bg-rose-500/15 rounded-full blur-2xl pointer-events-none" />

      {/* Encabezado del Buzón */}
      <div className="flex items-center justify-between mb-3 relative z-10">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-xl bg-rose-500/20 text-rose-400 border border-rose-500/30">
            <Heart className="w-4 h-4 fill-rose-500 text-rose-500 animate-pulse" />
          </div>
          <div>
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-rose-300 flex items-center gap-1.5">
              Buzón de Amorcillo & Lobo
            </h3>
            <span className="text-[10px] text-rose-400/80 font-medium">
              Nota {noteIdx + 1} de {TAP_EASTER_EGGS.length} para Corazoncillo
            </span>
          </div>
        </div>

        <button
          onClick={handleNextNote}
          className="flex items-center gap-1.5 text-xs font-bold text-rose-200 bg-rose-500/25 hover:bg-rose-500/35 active:scale-95 px-3 py-1.5 rounded-full border border-rose-400/40 transition-all shadow-[inset_0_1px_0.5px_rgba(255,255,255,0.15)]"
        >
          <RefreshCw className={`w-3.5 h-3.5 text-rose-300 ${isAnimating ? 'animate-spin' : ''}`} />
          <span>Otra cartita</span>
        </button>
      </div>

      {/* Contenido de la Cartita (Alto Contraste en Blanco Brillante) estilo Liquid Glass */}
      <div className="flex items-start gap-3.5 mt-1 relative z-10 bg-white/[0.04] rounded-2xl p-3 border border-rose-400/25 shadow-[inset_0_1px_0.5px_rgba(255,255,255,0.12)] backdrop-blur-md">
        <div className="w-11 h-11 rounded-full overflow-hidden flex-shrink-0 border-2 border-rose-400 shadow-md ring-2 ring-rose-500/30">
          <img src="/lobo/icon.jpg" alt="Lobo" className="w-full h-full object-cover" />
        </div>
        <div className="flex-1 min-w-0">
          <p
            className={`text-sm sm:text-base font-bold text-white leading-snug drop-shadow transition-all duration-300 ${
              isAnimating ? 'opacity-0 translate-y-1' : 'opacity-100 translate-y-0'
            }`}
          >
            "{TAP_EASTER_EGGS[noteIdx]}"
          </p>

          <div className="flex items-center justify-between mt-2 pt-2 border-t border-rose-500/20">
            <span className="inline-flex items-center gap-1 text-[11px] text-rose-300 font-semibold">
              <Sparkles className="w-3 h-3 text-amber-300" /> Para Miriam (Corazoncillo)
            </span>
            <span className="text-[10px] text-slate-400 italic">
              Con amor de amorcillo 🐾
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
