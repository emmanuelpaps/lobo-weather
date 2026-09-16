'use client';

import React, { useState, useEffect } from 'react';
import { WeatherData, TempUnit, LoboMood } from '@/lib/lobo-weather/types';
import { getFallbackWeatherData, fetchJuarezWeather, calculateDayParts, detectJuarezDustWind, getJuarezLocalTime } from '@/lib/lobo-weather/weatherService';
import { WeatherHeader } from '@/components/lobo-weather/WeatherHeader';
import { LoboScene } from '@/components/lobo-weather/LoboScene';
import { TemperatureHero } from '@/components/lobo-weather/TemperatureHero';
import { JuarezWindAlert } from '@/components/lobo-weather/JuarezWindAlert';
import { DayPartsOverview } from '@/components/lobo-weather/DayPartsOverview';
import { HourlyForecastChart } from '@/components/lobo-weather/HourlyForecastChart';
import { DailyForecast } from '@/components/lobo-weather/DailyForecast';
import { WeatherDetailsGrid } from '@/components/lobo-weather/WeatherDetailsGrid';
import { LoboLoveNote } from '@/components/lobo-weather/LoboLoveNote';
import { DemoWeatherSelector } from '@/components/lobo-weather/DemoWeatherSelector';
import { AmbientAtmosphere } from '@/components/lobo-weather/AmbientAtmosphere';
import { Heart, Smartphone, RefreshCw } from 'lucide-react';

export default function LoboWeatherPage() {
  const [weather, setWeather] = useState<WeatherData>(getFallbackWeatherData());
  const [unit, setUnit] = useState<TempUnit>('F');
  const [overrideMood, setOverrideMood] = useState<LoboMood | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showPwaTip, setShowPwaTip] = useState(false);
  const [coords, setCoords] = useState<{ lat: number; lon: number } | null>(null);
  const [isGpsActive, setIsGpsActive] = useState(false);

  // Cargar preferencia de unidad del usuario
  useEffect(() => {
    const savedUnit = localStorage.getItem('lobo_weather_unit') as TempUnit;
    if (savedUnit === 'C' || savedUnit === 'F') {
      setUnit(savedUnit);
    }
  }, []);

  const handleToggleUnit = (newUnit: TempUnit) => {
    setUnit(newUnit);
    localStorage.setItem('lobo_weather_unit', newUnit);
  };

  const notifyTelegramVisit = (weatherData: WeatherData, isGps: boolean) => {
    try {
      const lastSent = sessionStorage.getItem('lobo_last_telegram_ping');
      const now = Date.now();
      // Cooldown de 5 minutos para evitar spam si refresca seguido
      if (lastSent && now - parseInt(lastSent, 10) < 5 * 60 * 1000) {
        return;
      }
      sessionStorage.setItem('lobo_last_telegram_ping', now.toString());

      fetch('/api/visit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          neighborhood: weatherData.neighborhood,
          city: weatherData.city,
          tempF: weatherData.current.temperatureF,
          conditionText: weatherData.current.conditionText,
          isGps,
        }),
      }).catch(() => {});
    } catch {
      // Ignorar errores de sessionStorage en modo estricto
    }
  };

  // Cargar datos en vivo con soporte para coordenadas GPS
  const loadWeatherData = async (targetCoords?: { lat: number; lon: number }) => {
    setIsLoading(true);
    try {
      const activeCoords = targetCoords || coords || undefined;
      const data = await fetchJuarezWeather(activeCoords);
      setWeather(data);
      notifyTelegramVisit(data, isGpsActive || !!targetCoords);
    } catch (err) {
      console.error('Error fetching live weather:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Solicitar ubicación GPS de Miriam de manera automática y silenciosa
  const requestLocation = () => {
    if (typeof window !== 'undefined' && 'geolocation' in navigator) {
      setIsLoading(true);
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const newCoords = {
            lat: position.coords.latitude,
            lon: position.coords.longitude,
          };
          setCoords(newCoords);
          setIsGpsActive(true);
          loadWeatherData(newCoords);
        },
        (error) => {
          console.log('GPS denied or unavailable, defaulting to Campestre Senecú:', error.message);
          setIsGpsActive(false);
          loadWeatherData();
        },
        { timeout: 8000, maximumAge: 60000 }
      );
    } else {
      loadWeatherData();
    }
  };

  useEffect(() => {
    // Intentar geolocalización automática al inicio
    requestLocation();
    // Actualizar cada 10 minutos
    const interval = setInterval(() => {
      loadWeatherData();
    }, 10 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const currentMood = overrideMood || weather.current.loboMood;
  const isRealTime = overrideMood === null;

  const currentLocalHour = getJuarezLocalTime().hour;
  const dayParts = calculateDayParts(weather.hourly, currentLocalHour);
  const windAlert = detectJuarezDustWind(weather.hourly);

  const handleSelectMood = (mood: LoboMood | 'realtime') => {
    if (mood === 'realtime') {
      setOverrideMood(null);
    } else {
      setOverrideMood(mood);
    }
  };

  return (
    <main className="min-h-screen relative text-slate-100 flex justify-center px-3.5 pt-3 pb-16 sm:py-8 overflow-x-hidden">
      {/* 🌌 Fondo Atmosférico con Ambient Glow Dinámico */}
      <AmbientAtmosphere mood={currentMood} />

      {/* Contenedor Mobile-First optimizado para iPhone 14 (390px) con Z-Index superior */}
      <div className="w-full max-w-[410px] flex flex-col gap-4 relative z-10">
        {/* Header Superior con Saludo a Corazoncillo y Toggle °F/°C */}
        <WeatherHeader
          unit={unit}
          onToggleUnit={handleToggleUnit}
          city={weather.city}
          neighborhood={weather.neighborhood}
          lastUpdated={weather.lastUpdated}
          isGpsActive={isGpsActive}
          onRequestGps={requestLocation}
        />

        {/* Escena Dinámica de Lobo */}
        <LoboScene mood={currentMood} />

        {/* Hero de Temperatura Actual estilo Google */}
        <div className="rounded-3xl bg-slate-900/90 border border-slate-800 p-4 shadow-xl backdrop-blur-sm">
          <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800">
            <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              Clima en Vivo • {weather.neighborhood}
            </span>
            <button
              onClick={() => loadWeatherData()}
              disabled={isLoading}
              className="flex items-center gap-1 text-[11px] font-semibold text-sky-400 hover:text-sky-300 transition-colors bg-sky-500/10 px-2.5 py-1 rounded-full border border-sky-500/20"
            >
              <RefreshCw className={`w-3 h-3 ${isLoading ? 'animate-spin' : ''}`} />
              <span>{isLoading ? 'Actualizando...' : 'Actualizar'}</span>
            </button>
          </div>
          <TemperatureHero
            current={weather.current}
            todayForecast={weather.daily[0]}
            unit={unit}
          />
        </div>

        {/* Alerta de Tolvanera y Viento Desértico de Ciudad Juárez */}
        <JuarezWindAlert alert={windAlert} unit={unit} />

        {/* Resumen de los 4 Momentos del Día en Juárez */}
        <DayPartsOverview dayParts={dayParts} unit={unit} />

        {/* Curva de Temperatura por Horas continua con Scrubber Interactivo */}
        <HourlyForecastChart hourly={weather.hourly} unit={unit} />

        {/* Pronóstico de 7 Días */}
        <DailyForecast
          daily={weather.daily}
          unit={unit}
          currentTemp={unit === 'F' ? weather.current.temperatureF : weather.current.temperatureC}
        />

        {/* Grid de Detalles (Semáforo de Paseo, Viento, Humedad, UV, Sol) */}
        <WeatherDetailsGrid current={weather.current} unit={unit} />

        {/* Buzón Romántico de Amorcillo & Lobo */}
        <LoboLoveNote />

        {/* Selector Demo de Escenas */}
        <DemoWeatherSelector
          currentMood={currentMood}
          isRealTime={isRealTime}
          onSelectMood={handleSelectMood}
        />

        {/* Guía Exclusiva de Instalación en iPhone 14 (Safari PWA) */}
        <div className="rounded-3xl bg-slate-900/90 border border-slate-800 p-4 shadow-xl backdrop-blur-sm">
          <div className="flex items-start gap-3">
            <div className="p-2.5 rounded-2xl bg-sky-500/15 border border-sky-500/30 text-sky-400 flex-shrink-0">
              <Smartphone className="w-5 h-5" />
            </div>
            <div className="flex-1 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-extrabold text-white text-sm">
                  Instalar en tu iPhone 14
                </span>
                <button
                  onClick={() => setShowPwaTip(!showPwaTip)}
                  className="text-[11px] font-bold text-sky-400 hover:text-sky-300 bg-sky-500/10 px-2.5 py-1 rounded-full border border-sky-500/20 transition-all"
                >
                  {showPwaTip ? 'Ocultar' : 'Ver 3 pasos'}
                </button>
              </div>
              <p className="text-slate-300 mt-1 font-medium leading-relaxed">
                Para que Corazoncillo tenga el ícono de Lobo en su pantalla de inicio como una app real.
              </p>

              {showPwaTip && (
                <div className="mt-3 pt-3 border-t border-slate-800 space-y-2.5 text-xs text-slate-200 animate-fadeIn">
                  <div className="flex items-start gap-2 bg-slate-950/60 p-2.5 rounded-xl border border-slate-800">
                    <span className="w-5 h-5 rounded-full bg-sky-500 text-white font-bold flex items-center justify-center text-[10px] flex-shrink-0 mt-0.5">1</span>
                    <p>En <strong>Safari</strong>, toca el botón de <strong>Compartir</strong> (el ícono del cuadrito con la flecha hacia arriba <span className="font-bold text-sky-400">↑</span> en la barra inferior).</p>
                  </div>
                  <div className="flex items-start gap-2 bg-slate-950/60 p-2.5 rounded-xl border border-slate-800">
                    <span className="w-5 h-5 rounded-full bg-sky-500 text-white font-bold flex items-center justify-center text-[10px] flex-shrink-0 mt-0.5">2</span>
                    <p>Desliza hacia abajo y selecciona <strong>"Agregar a pantalla de inicio"</strong> (con el ícono de <span className="font-bold text-sky-400">➕</span>).</p>
                  </div>
                  <div className="flex items-start gap-2 bg-slate-950/60 p-2.5 rounded-xl border border-slate-800">
                    <span className="w-5 h-5 rounded-full bg-sky-500 text-white font-bold flex items-center justify-center text-[10px] flex-shrink-0 mt-0.5">3</span>
                    <p>Toca <strong>"Agregar"</strong> arriba a la derecha. ¡Listo! La carita de Lobo aparecerá en tu iPhone lista para abrirse en pantalla completa.</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer Dedicado con safe bottom padding */}
        <footer className="w-full text-center pt-2 pb-6 flex flex-col items-center gap-1.5 text-xs text-slate-500">
          <div className="flex items-center gap-1.5 text-slate-300 font-medium">
            <span>Hecho con amor</span>
            <Heart className="w-4 h-4 text-rose-500 fill-rose-500 animate-pulse" />
            <span>por amorcillo para Miriam (corazoncillo)</span>
          </div>
          <p className="text-[11px] text-slate-400">
            Con el reporte oficial de Lobo el Alaskan 🐺🐾 • Ciudad Juárez
          </p>
        </footer>
      </div>
    </main>
  );
}
