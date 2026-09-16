'use client';

import React from 'react';
import { LoboMood } from '@/lib/lobo-weather/types';

interface AmbientAtmosphereProps {
  mood: LoboMood;
}

interface MoodAmbientConfig {
  bgBase: string;
  orb1Color: string;
  orb1Position: string;
  orb2Color: string;
  orb2Position: string;
  horizonGlow: string;
  accentGlow: string;
}

const AMBIENT_THEMES: Record<LoboMood, MoodAmbientConfig> = {
  sunny: {
    bgBase: 'bg-gradient-to-b from-sky-950/70 via-slate-950 to-[#020617]',
    orb1Color: 'bg-amber-400/25',
    orb1Position: '-top-20 -right-20 w-[380px] h-[380px]',
    orb2Color: 'bg-sky-400/20',
    orb2Position: 'top-40 -left-20 w-[320px] h-[320px]',
    horizonGlow: 'from-amber-500/10 via-sky-500/10 to-transparent',
    accentGlow: 'bg-amber-300/15',
  },
  cloudy: {
    bgBase: 'bg-gradient-to-b from-slate-900/90 via-slate-950 to-[#020617]',
    orb1Color: 'bg-slate-300/20',
    orb1Position: '-top-24 left-1/2 -translate-x-1/2 w-[460px] h-[340px]',
    orb2Color: 'bg-sky-400/15',
    orb2Position: 'top-48 -left-10 w-[300px] h-[300px]',
    horizonGlow: 'from-slate-400/15 via-sky-400/10 to-transparent',
    accentGlow: 'bg-slate-200/10',
  },
  heat: {
    bgBase: 'bg-gradient-to-b from-amber-950/80 via-slate-950 to-[#020617]',
    orb1Color: 'bg-orange-500/25',
    orb1Position: '-top-24 right-0 w-[420px] h-[420px]',
    orb2Color: 'bg-rose-500/20',
    orb2Position: 'top-52 -left-20 w-[340px] h-[340px]',
    horizonGlow: 'from-orange-500/15 via-rose-500/10 to-transparent',
    accentGlow: 'bg-orange-400/20',
  },
  thunderstorm: {
    bgBase: 'bg-gradient-to-b from-indigo-950/90 via-slate-950 to-[#020617]',
    orb1Color: 'bg-indigo-500/30',
    orb1Position: '-top-20 -left-10 w-[420px] h-[400px]',
    orb2Color: 'bg-purple-600/25',
    orb2Position: 'top-44 -right-16 w-[360px] h-[360px]',
    horizonGlow: 'from-indigo-600/20 via-purple-600/15 to-transparent',
    accentGlow: 'bg-violet-400/20',
  },
  winter: {
    bgBase: 'bg-gradient-to-b from-cyan-950/70 via-slate-950 to-[#020617]',
    orb1Color: 'bg-cyan-400/25',
    orb1Position: '-top-20 -left-10 w-[380px] h-[380px]',
    orb2Color: 'bg-blue-400/20',
    orb2Position: 'top-36 -right-16 w-[340px] h-[340px]',
    horizonGlow: 'from-cyan-400/15 via-blue-500/10 to-transparent',
    accentGlow: 'bg-cyan-300/15',
  },
  windy: {
    bgBase: 'bg-gradient-to-b from-amber-950/60 via-stone-950 to-[#020617]',
    orb1Color: 'bg-amber-600/25',
    orb1Position: '-top-16 -right-10 w-[400px] h-[360px]',
    orb2Color: 'bg-yellow-600/20',
    orb2Position: 'top-48 -left-24 w-[360px] h-[360px]',
    horizonGlow: 'from-amber-600/15 via-stone-500/10 to-transparent',
    accentGlow: 'bg-amber-400/15',
  },
  rain: {
    bgBase: 'bg-gradient-to-b from-slate-900/90 via-slate-950 to-[#020617]',
    orb1Color: 'bg-sky-500/25',
    orb1Position: '-top-20 left-10 w-[400px] h-[400px]',
    orb2Color: 'bg-blue-600/20',
    orb2Position: 'top-52 -right-16 w-[340px] h-[340px]',
    horizonGlow: 'from-sky-500/15 via-slate-500/10 to-transparent',
    accentGlow: 'bg-sky-400/15',
  },
  sunset: {
    bgBase: 'bg-gradient-to-b from-rose-950/70 via-purple-950/40 to-[#020617]',
    orb1Color: 'bg-rose-500/25',
    orb1Position: '-top-20 -right-10 w-[420px] h-[420px]',
    orb2Color: 'bg-purple-500/25',
    orb2Position: 'top-40 -left-16 w-[360px] h-[360px]',
    horizonGlow: 'from-rose-500/20 via-amber-500/15 to-transparent',
    accentGlow: 'bg-pink-400/20',
  },
  night: {
    bgBase: 'bg-gradient-to-b from-slate-950 via-[#030712] to-[#010309]',
    orb1Color: 'bg-blue-600/15',
    orb1Position: '-top-24 -left-10 w-[420px] h-[420px]',
    orb2Color: 'bg-indigo-600/15',
    orb2Position: 'top-48 -right-16 w-[360px] h-[360px]',
    horizonGlow: 'from-indigo-600/10 via-blue-900/10 to-transparent',
    accentGlow: 'bg-indigo-400/10',
  },
};

export const AmbientAtmosphere: React.FC<AmbientAtmosphereProps> = ({ mood }) => {
  const theme = AMBIENT_THEMES[mood] || AMBIENT_THEMES.sunny;

  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden z-0 transition-colors duration-1000 ease-out">
      {/* 1. Capa de Fondo Dinámica con Degradado Suave */}
      <div className={`absolute inset-0 ${theme.bgBase} transition-all duration-1000 ease-out`} />

      {/* 2. Orbe de Luz Primaria Difusa (Top Lighting) */}
      <div
        className={`absolute rounded-full blur-[110px] mix-blend-screen opacity-90 transition-all duration-1000 ease-out animate-pulse-slow ${theme.orb1Color} ${theme.orb1Position}`}
      />

      {/* 3. Orbe de Luz Secundaria (Atmospheric Fill) */}
      <div
        className={`absolute rounded-full blur-[120px] mix-blend-screen opacity-80 transition-all duration-1000 ease-out animate-pulse-glow ${theme.orb2Color} ${theme.orb2Position}`}
      />

      {/* 4. Gradiente de Resplandor Horizontal Superior (Estilo Apple Weather) */}
      <div
        className={`absolute top-0 inset-x-0 h-96 bg-gradient-to-b ${theme.horizonGlow} pointer-events-none transition-all duration-1000 ease-out`}
      />

      {/* 5. Acento Luminoso Sutil en el Cenit */}
      <div
        className={`absolute -top-32 left-1/2 -translate-x-1/2 w-[600px] h-[200px] rounded-full blur-[90px] ${theme.accentGlow} pointer-events-none transition-all duration-1000`}
      />

      {/* 6. Viñeta Sutil en los bordes para Máxima Legibilidad en Pantallas OLED */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(2,6,23,0.35)_100%)] pointer-events-none" />
    </div>
  );
};
