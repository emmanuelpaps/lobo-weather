'use client';

import React, { useState, useEffect, useRef } from 'react';
import { LoboMood } from '@/lib/lobo-weather/types';
import { MOOD_DETAILS } from '@/lib/lobo-weather/weatherConditions';
import { MOOD_PHRASES, TAP_EASTER_EGGS } from '@/lib/lobo-weather/loboPhrases';
import { AtmosphericEffects } from './AtmosphericEffects';
import { Heart, Sparkles, RefreshCw, Camera, ChevronLeft, ChevronRight } from 'lucide-react';

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

  // Estados para Swipe Táctil Nativo
  const [dragOffset, setDragOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const touchStartPos = useRef<{ x: number; y: number; time: number } | null>(null);
  const isHorizontalSwipe = useRef<boolean | null>(null);
  const cardContainerRef = useRef<HTMLDivElement>(null);
  const lastTouchTime = useRef<number>(0);

  const moodInfo = MOOD_DETAILS[mood];
  const images = moodInfo.images || [moodInfo.imageSrc];
  const activeImage = images[currentImageIdx % images.length];

  const phrases = MOOD_PHRASES[mood] || MOOD_PHRASES.sunny;
  const activePhrase = phrases[currentPhraseIdx % phrases.length];

  // Restablecer al cambiar el mood
  useEffect(() => {
    setCustomEasterEgg(null);
    setCurrentPhraseIdx(0);
    setCurrentImageIdx(0);
    setDragOffset(0);
  }, [mood]);

  const triggerHaptic = (ms: number = 30) => {
    if (typeof window !== 'undefined' && 'vibrate' in navigator) {
      try { navigator.vibrate(ms); } catch {}
    }
  };

  const goToNextImage = () => {
    triggerHaptic(25);
    setIsBouncing(true);
    setTimeout(() => setIsBouncing(false), 350);
    setCurrentImageIdx(prev => (prev + 1) % images.length);
  };

  const goToPrevImage = () => {
    triggerHaptic(25);
    setIsBouncing(true);
    setTimeout(() => setIsBouncing(false), 350);
    setCurrentImageIdx(prev => (prev - 1 + images.length) % images.length);
  };

  const triggerTapEffect = (clientX: number, clientY: number, containerElement?: HTMLElement) => {
    triggerHaptic(40);
    setIsBouncing(true);
    setTimeout(() => setIsBouncing(false), 550);

    // Frase easter egg aleatoria de amor para Miriam
    const randomEgg = TAP_EASTER_EGGS[Math.floor(Math.random() * TAP_EASTER_EGGS.length)];
    setCustomEasterEgg(randomEgg);

    // Calcular posición del corazón
    const target = containerElement || cardContainerRef.current;
    if (target) {
      const rect = target.getBoundingClientRect();
      const x = clientX - rect.left;
      const y = clientY - rect.top;

      const newHeart: FloatingHeart = {
        id: Date.now() + Math.random(),
        x: Math.max(30, Math.min(rect.width - 30, x)),
        y: Math.max(30, Math.min(rect.height - 30, y)),
      };

      setFloatingHearts(prev => [...prev.slice(-4), newHeart]);

      setTimeout(() => {
        setFloatingHearts(prev => prev.filter(h => h.id !== newHeart.id));
      }, 1400);
    }

    if (onLoboTap) onLoboTap();
  };

  // Manejadores Touch para Swipe Táctil Nativo en iPhone / Safari
  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    lastTouchTime.current = Date.now();
    const touch = e.touches[0];
    touchStartPos.current = {
      x: touch.clientX,
      y: touch.clientY,
      time: Date.now(),
    };
    isHorizontalSwipe.current = null;
    setIsDragging(true);
    setDragOffset(0);
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!touchStartPos.current) return;
    const touch = e.touches[0];
    const dx = touch.clientX - touchStartPos.current.x;
    const dy = touch.clientY - touchStartPos.current.y;

    // Detectar si el usuario quiere scrollear la página verticalmente o deslizar a Lobo horizontalmente
    if (isHorizontalSwipe.current === null) {
      if (Math.abs(dx) > 7 || Math.abs(dy) > 7) {
        if (Math.abs(dy) > Math.abs(dx)) {
          // El usuario está haciendo scroll de la página: no intervenir
          isHorizontalSwipe.current = false;
          setIsDragging(false);
          setDragOffset(0);
          return;
        } else {
          // Gesto horizontal confirmado para cambiar pose
          isHorizontalSwipe.current = true;
        }
      }
    }

    if (isHorizontalSwipe.current) {
      // Damping elástico durante el arrastre con el dedo
      setDragOffset(dx * 0.72);
    }
  };

  const handleTouchEnd = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!touchStartPos.current) return;
    const start = touchStartPos.current;
    const touch = e.changedTouches[0];
    const dx = touch.clientX - start.x;
    const dy = touch.clientY - start.y;
    const elapsed = Date.now() - start.time;

    if (isHorizontalSwipe.current) {
      const isFastFlick = elapsed < 300 && Math.abs(dx) > 30;
      const isLongDrag = Math.abs(dx) > 55;

      if (isFastFlick || isLongDrag) {
        if (dx < 0) {
          goToNextImage();
        } else {
          goToPrevImage();
        }
      }
    } else if (Math.abs(dx) < 12 && Math.abs(dy) < 12) {
      // Tap estacionario rápido: corazón y easter egg
      triggerTapEffect(touch.clientX, touch.clientY, e.currentTarget);
    }

    touchStartPos.current = null;
    isHorizontalSwipe.current = null;
    setIsDragging(false);
    setDragOffset(0);
  };

  // Clic en mouse (Desktop)
  const handleMouseClick = (e: React.MouseEvent<HTMLDivElement>) => {
    // Si acaba de ocurrir un touch reciente, evitar duplicar el evento en móviles
    if (Date.now() - lastTouchTime.current < 600) return;
    triggerTapEffect(e.clientX, e.clientY, e.currentTarget);
  };

  const nextPhrase = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCustomEasterEgg(null);
    setCurrentPhraseIdx(prev => prev + 1);
  };

  return (
    <div className="w-full flex flex-col select-none">
      {/* 1. Tarjeta de Lobo Full Bleed con Fade Suave Inferior y Gesto Swipe */}
      <div 
        ref={cardContainerRef}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onClick={handleMouseClick}
        style={{ touchAction: 'pan-y' }}
        className="relative w-full aspect-[4/3.2] sm:aspect-[4/3] rounded-[2.25rem] overflow-hidden cursor-grab active:cursor-grabbing shadow-[inset_0_1px_1.5px_rgba(255,255,255,0.22),0_20px_45px_rgba(0,0,0,0.55)] border border-white/[0.14] bg-slate-950/80 backdrop-blur-2xl group"
      >
        {/* Contenedor transformable para física elástica de arrastre horizontal */}
        <div
          className="w-full h-full relative"
          style={{
            transform: `translateX(${dragOffset}px)`,
            transition: isDragging ? 'none' : 'transform 0.35s cubic-bezier(0.2, 0.8, 0.2, 1)',
          }}
        >
          <img
            key={activeImage}
            src={activeImage}
            alt={`Lobo en estado ${moodInfo.title}`}
            draggable={false}
            className={`w-full h-full object-cover transition-all duration-500 animate-fadeIn ${
              isBouncing ? 'scale-105 -rotate-1' : 'group-hover:scale-[1.015]'
            }`}
          />
        </div>

        {/* Capas y efectos climáticos en CSS vivo (lluvia, nieve, viento, destellos) */}
        <AtmosphericEffects mood={mood} />

        {/* Viñeta sutil de contraste superior e inferior */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/45 via-transparent to-transparent pointer-events-none" />

        {/* 🌟 Full Bleed Fade: Gradiente suave inferior que funde a Lobo con el fondo y la tarjeta de diálogo */}
        <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-slate-950 via-slate-950/70 to-transparent pointer-events-none z-10" />

        {/* Badge Superior Izquierdo: Clima Actual / Escena Activa */}
        <div className="absolute top-3.5 left-3.5 z-20 flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-950/70 backdrop-blur-xl border border-white/20 text-white text-xs font-semibold shadow-[inset_0_1px_0.5px_rgba(255,255,255,0.2),0_4px_12px_rgba(0,0,0,0.3)]">
          <span className="w-2.5 h-2.5 rounded-full animate-ping" style={{ backgroundColor: moodInfo.bgColor }} />
          <span>{moodInfo.title}</span>
        </div>

        {/* Badge Superior Derecho: Botón de Poses con indicador táctil */}
        <div className="absolute top-3.5 right-3.5 z-20 flex items-center gap-1.5">
          <button
            onClick={(e) => {
              e.stopPropagation();
              goToNextImage();
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-950/70 hover:bg-slate-900/85 active:scale-95 backdrop-blur-xl border border-amber-400/40 text-amber-300 text-xs font-bold shadow-[inset_0_1px_0.5px_rgba(255,255,255,0.15)] transition-all"
            title="Toca o desliza para ver otra pose"
          >
            <Camera className="w-3.5 h-3.5" />
            <span>Pose {(currentImageIdx % images.length) + 1}/{images.length}</span>
          </button>
        </div>

        {/* Botones de Chevrons laterales sutiles para navegación rápida */}
        {images.length > 1 && (
          <>
            <button
              onClick={(e) => {
                e.stopPropagation();
                goToPrevImage();
              }}
              aria-label="Pose anterior"
              className="absolute left-2.5 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-slate-950/45 hover:bg-slate-950/80 active:scale-90 backdrop-blur-md border border-white/15 flex items-center justify-center text-white/70 hover:text-white transition-all shadow-lg"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                goToNextImage();
              }}
              aria-label="Siguiente pose"
              className="absolute right-2.5 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-slate-950/45 hover:bg-slate-950/80 active:scale-90 backdrop-blur-md border border-white/15 flex items-center justify-center text-white/70 hover:text-white transition-all shadow-lg"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </>
        )}

        {/* Indicadores de Poses interactivos y Pista de Deslizar (Swipe) */}
        <div className="absolute bottom-6 inset-x-0 z-20 flex flex-col items-center gap-1 pointer-events-auto">
          <div className="flex items-center gap-1.5 bg-slate-950/50 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/10 shadow-sm">
            {images.map((_, idx) => {
              const isActive = idx === (currentImageIdx % images.length);
              return (
                <button
                  key={idx}
                  onClick={(e) => {
                    e.stopPropagation();
                    setCurrentImageIdx(idx);
                    setIsBouncing(true);
                    setTimeout(() => setIsBouncing(false), 350);
                  }}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    isActive
                      ? 'w-6 bg-amber-400 shadow-[0_0_10px_rgba(251,191,36,0.9)]'
                      : 'w-1.5 bg-white/40 hover:bg-white/70'
                  }`}
                  aria-label={`Ver pose ${idx + 1}`}
                />
              );
            })}
          </div>
          <span className="text-[10px] text-white/60 font-medium tracking-wide flex items-center gap-1 drop-shadow-md">
            <span>Desliza ‹ › o toca</span>
            <span className="text-amber-300">🐺🐾</span>
          </span>
        </div>

        {/* Emisión de Corazones Flotantes al Tocar */}
        {floatingHearts.map(heart => (
          <div
            key={heart.id}
            className="absolute pointer-events-none animate-float-heart z-30"
            style={{ left: `${heart.x}px`, top: `${heart.y}px` }}
          >
            <Heart className="w-10 h-10 text-rose-500 fill-rose-500 drop-shadow-[0_0_14px_rgba(244,63,94,0.95)]" />
          </div>
        ))}
      </div>

      {/* 2. Globo de Diálogo de Lobo estilo Liquid Glass integrado con el héroe */}
      <div className="-mt-4 relative z-20 mx-1">
        <div className="relative rounded-3xl bg-slate-900/65 border border-white/[0.12] p-4 shadow-[inset_0_1px_1px_rgba(255,255,255,0.18),0_14px_36px_rgba(0,0,0,0.45)] backdrop-blur-2xl">
          <div className="flex items-start gap-3">
            {/* Avatar circular de Lobo con borde dorado */}
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
