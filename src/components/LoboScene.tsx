'use client';

import React, { useState, useEffect } from 'react';
import { LoboMood } from '@/lib/lobo-weather/types';
import { MOOD_DETAILS } from '@/lib/lobo-weather/weatherConditions';
import { MOOD_PHRASES, TAP_EASTER_EGGS } from '@/lib/lobo-weather/loboPhrases';
import { AtmosphericEffects } from './AtmosphericEffects';
import { Heart, Sparkles, RefreshCw, Camera } from 'lucide-react';

interface LoboSceneProps {
  mood: LoboMood;
  onLoboTap?: () => void;
}

interface FloatingHeart {
  id: number;
  x: number;
  y: number;
}

export const LoboScene: React.FC<LoboSceneProps> = ({ mood, onLoboTap }) => {
  const [currentPhraseIdx, setCurrentPhraseIdx] = useState(0);
  const [currentImageIdx, setCurrentImageIdx] = useState(0);
  const [customEasterEgg, setCustomEasterEgg] = useState<string | null>(null);
  const [floatingHearts, setFloatingHearts] = useState<FloatingHeart[]>([]);
  const [isBouncing, setIsBouncing] = useState(false);

  const moodInfo = MOOD_DETAILS[mood];
  const images = moodInfo.images || [moodInfo.imageSrc];
  const activeImage = images[currentImageIdx % images.length];

  const phrases = MOOD_PHRASES[mood] || MOOD_PHRASES.sunny;
  const activePhrase = phrases[currentPhraseIdx % phrases.length];

  // Restablecer easter egg e imagen cuando cambia el mood
  useEffect(() => {
    setCustomEasterEgg(null);
    setCurrentPhraseIdx(0);
    setCurrentImageIdx(0);
  }, [mood]);

  const handleLoboTap = (e: React.MouseEvent<HTMLDivElement>) => {
    // Animación de rebote
    setIsBouncing(true);
    setTimeout(() => setIsBouncing(false), 600);

    // Seleccionar frase easter egg aleatoria entre las 24 disponibles
    const randomEgg = TAP_EASTER_EGGS[Math.floor(Math.random() * TAP_EASTER_EGGS.length)];
    setCustomEasterEgg(randomEgg);

    // Crear corazones flotantes en el punto tocado
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const newHeart: FloatingHeart = {
      id: Date.now() + Math.random(),
      x: Math.max(30, Math.min(rect.width - 30, x)),
      y: Math.max(30, Math.min(rect.height - 30, y)),
    };

    setFloatingHearts(prev => [...prev.slice(-4), newHeart]);

    setTimeout(() => {
      setFloatingHearts(prev => prev.filter(h => h.id !== newHeart.id));
    }, 1400);

    if (onLoboTap) onLoboTap();
  };

  const nextPhrase = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCustomEasterEgg(null);
    setCurrentPhraseIdx(prev => prev + 1);
  };

  const nextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsBouncing(true);
    setTimeout(() => setIsBouncing(false), 400);
    setCurrentImageIdx(prev => (prev + 1) % images.length);
  };

  return (
    <div className="w-full flex flex-col gap-2.5 select-none">
      {/* 1. Marco de la Ilustración de Lobo estilo Liquid Glass */}
      <div 
        onClick={handleLoboTap}
        className="relative w-full aspect-[4/3] rounded-3xl overflow-hidden cursor-pointer shadow-[inset_0_1px_1px_rgba(255,255,255,0.2),0_16px_36px_rgba(0,0,0,0.4)] border border-white/[0.12] bg-slate-900/60 backdrop-blur-2xl group"
      >
        {/* Imagen principal de Lobo con transición */}
        <img
          key={activeImage}
          src={activeImage}
          alt={`Lobo en estado ${moodInfo.title}`}
          className={`w-full h-full object-cover transition-all duration-500 animate-fadeIn ${
            isBouncing ? 'scale-105 -rotate-1' : 'group-hover:scale-[1.02]'
          }`}
        />

        {/* Capas y efectos climáticos en CSS vivo */}
        <AtmosphericEffects mood={mood} />

        {/* Sutil viñeta para integrar con el borde */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/30 pointer-events-none" />

        {/* Badge superior izquierdo: Estado / Escena */}
        <div className="absolute top-3.5 left-3.5 z-20 flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-950/60 backdrop-blur-xl border border-white/20 text-white text-xs font-semibold shadow-[inset_0_1px_0.5px_rgba(255,255,255,0.2),0_4px_12px_rgba(0,0,0,0.3)]">
          <span className="w-2.5 h-2.5 rounded-full animate-ping" style={{ backgroundColor: moodInfo.bgColor }} />
          <span>{moodInfo.title}</span>
        </div>

        {/* Badge superior derecho: Botón para cambiar foto/pose de Lobo (1 de 3) */}
        <div className="absolute top-3.5 right-3.5 z-20 flex items-center gap-1.5">
          <button
            onClick={nextImage}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-950/65 hover:bg-slate-900/80 backdrop-blur-xl border border-amber-400/40 text-amber-300 text-xs font-bold shadow-[inset_0_1px_0.5px_rgba(255,255,255,0.15)] transition-all active:scale-95"
            title="Ver otra pose de Lobo"
          >
            <Camera className="w-3.5 h-3.5" />
            <span>Pose {(currentImageIdx % images.length) + 1}/3</span>
          </button>

          <div className="hidden sm:flex items-center gap-1 px-2.5 py-1.5 rounded-full bg-slate-950/60 backdrop-blur-xl border border-white/20 text-white text-xs font-medium shadow-[inset_0_1px_0.5px_rgba(255,255,255,0.2)]">
            <Sparkles className="w-3 h-3 text-amber-300 animate-spin" style={{ animationDuration: '4s' }} />
            <span>Tócame 🐾</span>
          </div>
        </div>

        {/* Indicadores de puntos de foto (dots) en la parte inferior de la imagen */}
        <div className="absolute bottom-3 inset-x-0 z-20 flex justify-center gap-1.5 pointer-events-none">
          {images.map((_, idx) => (
            <span
              key={idx}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                idx === currentImageIdx % images.length
                  ? 'w-6 bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.8)]'
                  : 'w-1.5 bg-white/40'
              }`}
            />
          ))}
        </div>

        {/* Emisión de Corazones Flotantes al Tocar */}
        {floatingHearts.map(heart => (
          <div
            key={heart.id}
            className="absolute pointer-events-none animate-float-heart z-30"
            style={{ left: `${heart.x}px`, top: `${heart.y}px` }}
          >
            <Heart className="w-9 h-9 text-rose-500 fill-rose-500 drop-shadow-[0_0_12px_rgba(244,63,94,0.9)]" />
          </div>
        ))}
      </div>

      {/* 2. Globo de Diálogo de Lobo estilo Liquid Glass */}
      <div className="relative w-full">
        {/* Puntero triangular del globo hacia la imagen de Lobo */}
        <div className="absolute -top-2 left-8 w-4 h-4 bg-slate-900/80 backdrop-blur-2xl border-t border-l border-white/[0.12] rotate-45 z-10" />

        <div className="relative rounded-3xl bg-slate-900/55 border border-white/[0.08] p-4 shadow-[inset_0_1px_1px_rgba(255,255,255,0.15),0_12px_36px_rgba(0,0,0,0.4)] backdrop-blur-2xl">
          <div className="flex items-start gap-3">
            {/* Avatar circular de Lobo */}
            <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0 border-2 border-amber-400 shadow-md">
              <img src="/lobo/icon.jpg" alt="Lobo" className="w-full h-full object-cover" />
            </div>

            {/* Contenido del Diálogo */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-bold text-amber-400 flex items-center gap-1.5">
                  Lobo dice:
                  {customEasterEgg ? (
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-400 border border-rose-500/30">
                      ¡Secreto para Corazoncillo! ❤️
                    </span>
                  ) : (
                    <span className="text-[10px] text-slate-400 font-normal">
                      {activePhrase.tag} ({((currentPhraseIdx % phrases.length) + 1)}/{phrases.length})
                    </span>
                  )}
                </span>
                <button
                  onClick={nextPhrase}
                  className="flex items-center gap-1 text-[11px] font-bold text-sky-400 hover:text-sky-300 bg-sky-500/10 hover:bg-sky-500/20 px-2.5 py-0.5 rounded-full border border-sky-500/20 transition-colors"
                  title="Ver otra frase"
                >
                  <RefreshCw className="w-3 h-3" />
                  <span>Otra nota</span>
                </button>
              </div>

              <p className="text-sm font-semibold text-slate-100 leading-snug">
                "{customEasterEgg || activePhrase.quote}"
              </p>

              {activePhrase.subtext && !customEasterEgg && (
                <p className="text-xs text-slate-400 mt-1 italic">
                  {activePhrase.subtext}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
