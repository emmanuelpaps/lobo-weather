'use client';

import React, { useState } from 'react';
import { Heart, Sparkles, RefreshCw, Send, CheckCircle2, MessageCircleHeart } from 'lucide-react';
import { TAP_EASTER_EGGS } from '@/lib/lobo-weather/loboPhrases';

interface FloatingHeart {
  id: number;
  x: number;
  y: number;
}

const CARINITO_OPTIONS = [
  { id: 'te_amo', label: 'Te amo con todo mi corazón 💖', text: '¡Te amo con todo mi corazón, amorcillo! 💖' },
  { id: 'abrazo_lobo', label: 'Abrazo de Lobo 🐺🐾', text: 'Lobo y yo te mandamos un abrazo gigante lleno de pelos y amor 🐺🐾' },
  { id: 'pensando_en_ti', label: 'Pensando en ti ☕✨', text: 'Pensando en ti en este momento y mandándote besitos ☕✨' },
];

export const LoboLoveNote: React.FC = () => {
  const [noteIdx, setNoteIdx] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [selectedCarinito, setSelectedCarinito] = useState(CARINITO_OPTIONS[0]);
  const [isSending, setIsSending] = useState(false);
  const [sentSuccess, setSentSuccess] = useState(false);
  const [heartsBurst, setHeartsBurst] = useState<FloatingHeart[]>([]);

  const handleNextNote = () => {
    setIsAnimating(true);
    setTimeout(() => {
      setNoteIdx(prev => (prev + 1) % TAP_EASTER_EGGS.length);
      setIsAnimating(false);
    }, 250);
  };

  const triggerHaptic = (pattern: number | number[]) => {
    if (typeof window !== 'undefined' && 'vibrate' in navigator) {
      try {
        navigator.vibrate(pattern);
      } catch {
        // Ignorar si el navegador bloquea la vibración
      }
    }
  };

  const spawnHeartsBurst = () => {
    const newHearts: FloatingHeart[] = Array.from({ length: 6 }).map((_, i) => ({
      id: Date.now() + i + Math.random(),
      x: 30 + Math.random() * 260,
      y: 80 + Math.random() * 120,
    }));
    setHeartsBurst(prev => [...prev, ...newHearts]);
    setTimeout(() => {
      setHeartsBurst([]);
    }, 1500);
  };

  const handleSendCarinito = async () => {
    if (isSending || sentSuccess) return;
    setIsSending(true);
    triggerHaptic([40, 80, 40]);
    spawnHeartsBurst();

    try {
      await fetch('/api/hug', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          reaction: selectedCarinito.text,
        }),
      });

      setSentSuccess(true);
      triggerHaptic([30, 50, 100]);

      // Cooldown de 12 segundos para que no spammee pero pueda volver a mandar
      setTimeout(() => {
        setSentSuccess(false);
      }, 12000);
    } catch (err) {
      console.error('Error enviando cariñito:', err);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="w-full rounded-3xl bg-gradient-to-br from-rose-950/50 via-slate-900/60 to-slate-950/70 border border-rose-500/35 p-4 shadow-[inset_0_1px_1.5px_rgba(255,255,255,0.2),0_18px_40px_rgba(244,63,94,0.18)] backdrop-blur-2xl select-none relative overflow-hidden">
      {/* Resplandor decorativo de fondo */}
      <div className="absolute -top-12 -right-12 w-40 h-40 bg-rose-500/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />

      {/* Corazones flotantes al enviar cariñito */}
      {heartsBurst.map(heart => (
        <div
          key={heart.id}
          className="absolute pointer-events-none animate-float-heart z-40"
          style={{ left: `${heart.x}px`, top: `${heart.y}px` }}
        >
          <Heart className="w-8 h-8 text-rose-500 fill-rose-500 drop-shadow-[0_0_12px_rgba(244,63,94,0.9)]" />
        </div>
      ))}

      {/* 1. Encabezado del Buzón */}
      <div className="flex items-center justify-between mb-3 relative z-10">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-xl bg-rose-500/20 text-rose-400 border border-rose-500/30 shadow-sm">
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
          <span>Otra nota</span>
        </button>
      </div>

      {/* 2. Contenido de la Cartita de Amor estilo Liquid Glass */}
      <div className="flex items-start gap-3.5 relative z-10 bg-white/[0.04] rounded-2xl p-3 border border-rose-400/25 shadow-[inset_0_1px_0.5px_rgba(255,255,255,0.12)] backdrop-blur-md">
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

      {/* 3. Sección Intercomunicador: "Mandar cariñito a Amorcillo" */}
      <div className="mt-3.5 pt-3 border-t border-rose-500/25 relative z-10">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[11px] font-extrabold text-rose-300 flex items-center gap-1.5">
            <MessageCircleHeart className="w-3.5 h-3.5 text-rose-400" />
            Mandar cariñito a Amorcillo
          </span>
          <span className="text-[10px] text-slate-400 font-medium">
            Llega a su teléfono al instante 📲
          </span>
        </div>

        {/* 3 Opciones de Mensaje Rápido */}
        <div className="grid grid-cols-3 gap-1.5 mb-2.5">
          {CARINITO_OPTIONS.map(opt => {
            const isSelected = selectedCarinito.id === opt.id;
            return (
              <button
                key={opt.id}
                onClick={() => {
                  setSelectedCarinito(opt);
                  triggerHaptic(20);
                }}
                className={`py-1.5 px-2 rounded-xl text-[10px] font-bold transition-all text-center border ${
                  isSelected
                    ? 'bg-rose-500/30 text-rose-200 border-rose-400 shadow-[inset_0_1px_0.5px_rgba(255,255,255,0.2),0_2px_8px_rgba(244,63,94,0.3)] scale-[1.02]'
                    : 'bg-white/[0.04] hover:bg-white/[0.08] text-slate-300 border-white/10'
                }`}
              >
                {opt.label}
              </button>
            );
          })}
        </div>

        {/* Botón Principal de Enviar Cariñito */}
        <button
          onClick={handleSendCarinito}
          disabled={isSending || sentSuccess}
          className={`w-full py-2.5 px-4 rounded-2xl font-black text-xs flex items-center justify-center gap-2 transition-all shadow-md active:scale-95 border ${
            sentSuccess
              ? 'bg-emerald-500/25 text-emerald-200 border-emerald-400/50 shadow-[0_0_16px_rgba(16,185,129,0.4)]'
              : 'bg-gradient-to-r from-rose-600 via-pink-600 to-rose-600 hover:from-rose-500 hover:to-pink-500 text-white border-rose-400/40 shadow-[inset_0_1px_1px_rgba(255,255,255,0.3),0_6px_20px_rgba(244,63,94,0.4)]'
          }`}
        >
          {sentSuccess ? (
            <>
              <CheckCircle2 className="w-4 h-4 text-emerald-400 animate-bounce" />
              <span>¡Cariñito enviado a su teléfono! 🥰 Le sacaste una sonrisa</span>
            </>
          ) : isSending ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin text-rose-200" />
              <span>Enviando con mucho amor... ✨</span>
            </>
          ) : (
            <>
              <Send className="w-4 h-4 text-rose-200" />
              <span>Mandar este cariñito a Amorcillo ❤️</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
