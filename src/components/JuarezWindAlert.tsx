'use client';

import React from 'react';
import { DustWindAlert, TempUnit } from '@/lib/lobo-weather/types';
import { Wind, AlertTriangle, ShieldCheck, Glasses, Home } from 'lucide-react';

interface JuarezWindAlertProps {
  alert: DustWindAlert;
  unit: TempUnit;
}

export const JuarezWindAlert: React.FC<JuarezWindAlertProps> = ({ alert, unit }) => {
  const windDisplay = unit === 'F' ? `${alert.maxWindMph} mph` : `${alert.maxWindKmh} km/h`;

  if (alert.hasAlert) {
    const isSevere = alert.severity === 'severe';
    const isWarning = alert.severity === 'warning';

    const borderClass = isSevere
      ? 'border-rose-500/50 shadow-rose-950/40 bg-gradient-to-r from-rose-950/50 via-slate-900/60 to-amber-950/40'
      : isWarning
      ? 'border-amber-500/50 shadow-amber-950/40 bg-gradient-to-r from-amber-950/50 via-slate-900/60 to-amber-950/40'
      : 'border-teal-500/40 shadow-teal-950/30 bg-gradient-to-r from-teal-950/50 via-slate-900/60 to-slate-900/60';

    return (
      <div className={`w-full rounded-3xl p-4 border shadow-[inset_0_1px_1px_rgba(255,255,255,0.15),0_12px_36px_rgba(0,0,0,0.35)] backdrop-blur-2xl relative overflow-hidden transition-all ${borderClass}`}>
        {/* Encabezado de Alerta */}
        <div className="flex items-start gap-3">
          <div className={`p-2.5 rounded-2xl flex-shrink-0 shadow-md ${
            isSevere
              ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40'
              : 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
          }`}>
            <Wind className="w-5 h-5 animate-pulse" />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-1 mb-1">
              <span className="text-[10px] font-black uppercase tracking-wider text-amber-300 flex items-center gap-1">
                <AlertTriangle className="w-3 h-3" />
                Viento Desértico • Campestre Senecú
              </span>
              <span className="text-[11px] font-black px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/30 shadow-[inset_0_1px_0.5px_rgba(255,255,255,0.15)]">
                Pico: {windDisplay}
              </span>
            </div>

            <h4 className="text-sm font-extrabold text-white leading-tight">
              {alert.title}
            </h4>

            <p className="text-xs text-slate-200 mt-1 leading-relaxed font-medium">
              {alert.message}
            </p>

            {/* Checklist Rápido para Miriam */}
            <div className="mt-2.5 pt-2 border-t border-white/[0.08] grid grid-cols-2 gap-2 text-[10px] text-slate-300 font-semibold">
              <div className="flex items-center gap-1.5 bg-white/[0.04] px-2 py-1 rounded-xl border border-white/[0.06] shadow-[inset_0_1px_0.5px_rgba(255,255,255,0.1)]">
                <Glasses className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
                <span className="truncate">Lentes de sol al salir</span>
              </div>
              <div className="flex items-center gap-1.5 bg-white/[0.04] px-2 py-1 rounded-xl border border-white/[0.06] shadow-[inset_0_1px_0.5px_rgba(255,255,255,0.1)]">
                <Home className="w-3.5 h-3.5 text-sky-400 flex-shrink-0" />
                <span className="truncate">Cerrar ventanas en casa</span>
              </div>
            </div>

            {/* Avatar de Lobo con capa/goggles */}
            <div className="mt-2.5 flex items-center gap-2 bg-white/[0.04] p-2 rounded-2xl border border-white/[0.07] shadow-[inset_0_1px_0.5px_rgba(255,255,255,0.1)]">
              <div className="w-7 h-7 rounded-full overflow-hidden flex-shrink-0 border border-amber-400 shadow-sm">
                <img src="/lobo/windy_2.jpg" alt="Lobo Heroico" className="w-full h-full object-cover" />
              </div>
              <p className="text-[10px] font-bold text-amber-300 italic truncate">
                {alert.loboAction}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Estado calmo estilo Liquid Glass
  return (
    <div className="w-full rounded-3xl bg-slate-900/55 p-3.5 border border-white/[0.08] shadow-[inset_0_1px_1px_rgba(255,255,255,0.12),0_8px_24px_rgba(0,0,0,0.3)] backdrop-blur-2xl flex items-center justify-between">
      <div className="flex items-center gap-2.5">
        <div className="p-2 rounded-xl bg-teal-500/10 text-teal-400 border border-teal-500/20">
          <ShieldCheck className="w-4 h-4" />
        </div>
        <div>
          <span className="text-xs font-bold text-white block">
            {alert.title}
          </span>
          <span className="text-[11px] text-slate-400 font-medium">
            {alert.message}
          </span>
        </div>
      </div>
      <span className="text-xs font-extrabold text-teal-300 bg-teal-500/15 px-2.5 py-1 rounded-full border border-teal-500/30">
        {windDisplay}
      </span>
    </div>
  );
};
