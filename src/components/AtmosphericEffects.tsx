'use client';

import React from 'react';
import { LoboMood } from '@/lib/lobo-weather/types';

interface AtmosphericEffectsProps {
  mood: LoboMood;
}

export const AtmosphericEffects: React.FC<AtmosphericEffectsProps> = ({ mood }) => {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden z-10">
      {/* 1. Lluvia */}
      {mood === 'rain' && (
        <div className="absolute inset-0">
          {[...Array(24)].map((_, i) => (
            <span
              key={i}
              className="absolute block w-[2px] h-7 bg-sky-200/60 rounded-full animate-rain"
              style={{
                left: `${(i * 4.2) + (i % 3) * 1.5}%`,
                top: `-${Math.random() * 20}%`,
                animationDelay: `${(i * 0.15) % 1.5}s`,
                animationDuration: `${0.7 + (i % 4) * 0.15}s`,
                transform: 'rotate(15deg)',
              }}
            />
          ))}
        </div>
      )}

      {/* 2. Tormenta Eléctrica con Destellos y Gotas Rápidas */}
      {mood === 'thunderstorm' && (
        <>
          <div className="absolute inset-0 bg-indigo-200/20 animate-lightning mix-blend-screen" />
          <div className="absolute inset-0">
            {[...Array(30)].map((_, i) => (
              <span
                key={i}
                className="absolute block w-[2px] h-9 bg-blue-100/70 rounded-full animate-rain"
                style={{
                  left: `${(i * 3.3)}%`,
                  top: `-${Math.random() * 25}%`,
                  animationDelay: `${(i * 0.1) % 1.2}s`,
                  animationDuration: `${0.5 + (i % 3) * 0.1}s`,
                  transform: 'rotate(20deg)',
                }}
              />
            ))}
          </div>
        </>
      )}

      {/* 3. Nieve / Copos de Invierno */}
      {mood === 'winter' && (
        <div className="absolute inset-0">
          {[...Array(20)].map((_, i) => (
            <span
              key={i}
              className="absolute block rounded-full bg-white/80 shadow-[0_0_8px_white] animate-snow"
              style={{
                width: `${4 + (i % 4) * 2}px`,
                height: `${4 + (i % 4) * 2}px`,
                left: `${(i * 5) + (i % 2) * 2}%`,
                top: `-${10 + (i % 5) * 5}%`,
                animationDelay: `${(i * 0.35) % 4}s`,
                animationDuration: `${3 + (i % 4) * 0.8}s`,
                opacity: 0.8,
              }}
            />
          ))}
        </div>
      )}

      {/* 4. Viento / Tolvanera de Juárez */}
      {mood === 'windy' && (
        <div className="absolute inset-0">
          {[...Array(12)].map((_, i) => (
            <span
              key={i}
              className="absolute block h-[2px] bg-gradient-to-r from-transparent via-amber-200/50 to-transparent rounded-full animate-wind"
              style={{
                width: `${60 + (i % 5) * 40}px`,
                top: `${15 + (i * 7)}%`,
                left: '-20%',
                animationDelay: `${(i * 0.4) % 2.5}s`,
                animationDuration: `${1.4 + (i % 3) * 0.4}s`,
              }}
            />
          ))}
        </div>
      )}

      {/* 5. Noche Estrellada (destellos de estrellas) */}
      {mood === 'night' && (
        <div className="absolute inset-0">
          {[...Array(16)].map((_, i) => (
            <span
              key={i}
              className="absolute block w-1.5 h-1.5 bg-yellow-100 rounded-full animate-twinkle"
              style={{
                top: `${8 + (i * 5.5)}%`,
                left: `${(i * 6.2) + (i % 4) * 3}%`,
                animationDelay: `${(i * 0.5) % 3}s`,
                animationDuration: `${1.5 + (i % 3) * 0.8}s`,
                boxShadow: '0 0 6px rgba(254, 240, 138, 0.9)',
              }}
            />
          ))}
        </div>
      )}

      {/* 6. Calor Extremo (ondas de refracción) */}
      {mood === 'heat' && (
        <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-amber-500/15 via-orange-400/10 to-transparent animate-heat-shimmer" />
      )}

      {/* 7. Día Nublado (nubes suaves flotantes en Juárez) */}
      {mood === 'cloudy' && (
        <div className="absolute inset-0">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full bg-white/20 blur-md pointer-events-none animate-wind"
              style={{
                width: `${100 + (i % 3) * 50}px`,
                height: `${28 + (i % 2) * 12}px`,
                top: `${10 + i * 14}%`,
                left: '-25%',
                animationDelay: `${i * 1.6}s`,
                animationDuration: `${14 + (i % 3) * 3}s`,
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
};
