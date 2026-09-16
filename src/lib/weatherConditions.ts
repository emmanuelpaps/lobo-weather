import { LoboMood, WeatherConditionInfo } from './types';

export const MOOD_DETAILS: Record<LoboMood, WeatherConditionInfo> = {
  sunny: {
    mood: 'sunny',
    title: 'Soleado y Radiante',
    description: 'Cielo azul despejado en Ciudad Juárez',
    imageSrc: '/lobo/sunny.jpg',
    images: ['/lobo/sunny.jpg', '/lobo/sunny_2.jpg', '/lobo/sunny_3.jpg'],
    bgColor: '#38bdf8',
    accentColor: '#0284c7',
    bannerGradient: 'from-sky-400 via-sky-300 to-amber-200',
  },
  cloudy: {
    mood: 'cloudy',
    title: 'Día Nublado y Fresco',
    description: 'Cielo nublado sobre Juárez; Lobo disfrutando el paseo sin sol',
    imageSrc: '/lobo/cloudy.jpg',
    images: ['/lobo/cloudy.jpg', '/lobo/cloudy_2.jpg', '/lobo/cloudy_3.jpg'],
    bgColor: '#64748b',
    accentColor: '#475569',
    bannerGradient: 'from-slate-400 via-sky-200 to-slate-300',
  },
  heat: {
    mood: 'heat',
    title: '¡Calor Extremo Juarense!',
    description: 'El desierto está que arde; Lobo en modo alfombra',
    imageSrc: '/lobo/heat.jpg',
    images: ['/lobo/heat.jpg', '/lobo/heat_2.jpg', '/lobo/heat_3.jpg'],
    bgColor: '#f97316',
    accentColor: '#c2410c',
    bannerGradient: 'from-amber-500 via-orange-400 to-rose-400',
  },
  thunderstorm: {
    mood: 'thunderstorm',
    title: 'Tormenta Eléctrica',
    description: 'Truenos y relámpagos; Lobo buscando cobija y abrazos',
    imageSrc: '/lobo/thunderstorm.jpg',
    images: ['/lobo/thunderstorm.jpg', '/lobo/thunderstorm_2.jpg', '/lobo/thunderstorm_3.jpg'],
    bgColor: '#475569',
    accentColor: '#1e293b',
    bannerGradient: 'from-slate-700 via-indigo-900 to-slate-900',
  },
  winter: {
    mood: 'winter',
    title: '¡Frío / Invierno en Juárez!',
    description: 'Clima helado; Lobo en su paraíso ártico',
    imageSrc: '/lobo/winter.jpg',
    images: ['/lobo/winter.jpg', '/lobo/winter_2.jpg', '/lobo/winter_3.jpg'],
    bgColor: '#60a5fa',
    accentColor: '#1d4ed8',
    bannerGradient: 'from-blue-400 via-cyan-300 to-indigo-300',
  },
  windy: {
    mood: 'windy',
    title: 'Tolvanera / Viento Fuerte',
    description: 'Vientos clásicos de Juárez; Lobo con actitud heroica',
    imageSrc: '/lobo/windy.jpg',
    images: ['/lobo/windy.jpg', '/lobo/windy_2.jpg', '/lobo/windy_3.jpg'],
    bgColor: '#d97706',
    accentColor: '#92400e',
    bannerGradient: 'from-amber-600 via-yellow-600 to-stone-600',
  },
  rain: {
    mood: 'rain',
    title: 'Lluvia Agradable',
    description: 'Gotas frescas sobre Juárez; Lobo con impermeable',
    imageSrc: '/lobo/rain.jpg',
    images: ['/lobo/rain.jpg', '/lobo/rain_2.jpg', '/lobo/rain_3.jpg'],
    bgColor: '#64748b',
    accentColor: '#334155',
    bannerGradient: 'from-slate-500 via-sky-600 to-slate-700',
  },
  sunset: {
    mood: 'sunset',
    title: 'Atardecer Juarense',
    description: 'Cielo teñido de rosas y dorados sobre el horizonte',
    imageSrc: '/lobo/sunset.jpg',
    images: ['/lobo/sunset.jpg', '/lobo/sunset_2.jpg', '/lobo/sunset_3.jpg'],
    bgColor: '#f43f5e',
    accentColor: '#be123c',
    bannerGradient: 'from-rose-500 via-purple-600 to-amber-500',
  },
  night: {
    mood: 'night',
    title: 'Noche Serena',
    description: 'Cielo estrellado; Lobo durmiendo plácidamente',
    imageSrc: '/lobo/night.jpg',
    images: ['/lobo/night.jpg', '/lobo/night_2.jpg', '/lobo/night_3.jpg'],
    bgColor: '#0f172a',
    accentColor: '#38bdf8',
    bannerGradient: 'from-slate-900 via-indigo-950 to-blue-950',
  },
};

export function getWmoConditionText(code: number): string {
  if (code === 0) return 'Cielo despejado';
  if (code === 1) return 'Mayormente despejado';
  if (code === 2) return 'Parcialmente nublado';
  if (code === 3) return 'Nublado';
  if (code >= 45 && code <= 48) return 'Niebla / Neblina';
  if (code >= 51 && code <= 55) return 'Llovizna leve';
  if (code >= 56 && code <= 57) return 'Llovizna gélida';
  if (code >= 61 && code <= 65) return 'Lluvia';
  if (code >= 66 && code <= 67) return 'Aguanieve / Lluvia helada';
  if (code >= 71 && code <= 77) return 'Nieve ligera';
  if (code >= 80 && code <= 82) return 'Chubascos';
  if (code >= 85 && code <= 86) return 'Chubascos de nieve';
  if (code >= 95 && code <= 99) return 'Tormenta eléctrica';
  return 'Parcialmente soleado';
}

export function calculateLoboMood(params: {
  weatherCode: number;
  tempF: number;
  windSpeedMph: number;
  isDay: boolean;
  currentHour?: number;
  cloudCover?: number;
}): LoboMood {
  const { weatherCode, tempF, windSpeedMph, isDay, currentHour, cloudCover } = params;

  if (weatherCode >= 95 && weatherCode <= 99) {
    return 'thunderstorm';
  }
  if ((weatherCode >= 71 && weatherCode <= 77) || (weatherCode >= 85 && weatherCode <= 86) || tempF <= 50) {
    return 'winter';
  }
  if ((weatherCode >= 51 && weatherCode <= 67) || (weatherCode >= 80 && weatherCode <= 82)) {
    return 'rain';
  }
  if (windSpeedMph >= 18) {
    return 'windy';
  }
  if (currentHour !== undefined && (currentHour >= 18 && currentHour <= 20)) {
    return 'sunset';
  }
  if (!isDay) {
    return 'night';
  }
  if (tempF >= 92) {
    return 'heat';
  }
  // Detección de cielo nublado / parcialmente nublado en Juárez
  if (
    weatherCode === 3 || // Nublado (Overcast)
    weatherCode === 2 || // Parcialmente nublado
    weatherCode === 45 || // Niebla
    weatherCode === 48 ||
    (cloudCover !== undefined && cloudCover >= 40)
  ) {
    return 'cloudy';
  }
  return 'sunny';
}
