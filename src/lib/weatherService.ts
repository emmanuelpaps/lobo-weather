import { WeatherData, CurrentWeather, HourlyForecastItem, DailyForecastItem, LoboMood, DayPartItem, DustWindAlert } from './types';
import { calculateLoboMood, getWmoConditionText } from './weatherConditions';

// Coordenadas precisas para Campestre Senecú / Ciudad Juárez
const JUAREZ_LAT = 31.713;
const JUAREZ_LON = -106.398;
const TIMEZONE = 'America/Denver';

/**
 * Obtiene la hora actual formateada en la zona horaria de Ciudad Juárez
 */
export function getJuarezLocalTime(): {
  hour: number;
  minute: number;
  timeString: string;
  isDay: boolean;
  dayOfWeek: number;
} {
  const formatter = new Intl.DateTimeFormat('en-US', {
    timeZone: TIMEZONE,
    hour: 'numeric',
    minute: 'numeric',
    hour12: false,
    weekday: 'short',
  });

  const parts = formatter.formatToParts(new Date());
  let hour = 12;
  let minute = 0;
  for (const part of parts) {
    if (part.type === 'hour') hour = parseInt(part.value, 10);
    if (part.type === 'minute') minute = parseInt(part.value, 10);
  }

  const isDay = hour >= 6 && hour < 20;
  const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
  const ampm = hour >= 12 ? 'PM' : 'AM';
  const minStr = minute < 10 ? `0${minute}` : `${minute}`;

  return {
    hour,
    minute,
    timeString: `${displayHour}:${minStr} ${ampm}`,
    isDay,
    dayOfWeek: new Date().getDay(),
  };
}

/**
 * Datos de respaldo fieles al clima de Ciudad Juárez (por si falla la red o está offline)
 */
export function getFallbackWeatherData(): WeatherData {
  const jTime = getJuarezLocalTime();
  const currentHour = jTime.hour;
  const isDay = jTime.isDay;
  
  // Valores típicos de Juárez
  const currentTempF = isDay ? 91 : 74;
  const currentTempC = Math.round(((currentTempF - 32) * 5) / 9);

  const fallbackCurrent: CurrentWeather = {
    temperatureF: currentTempF,
    temperatureC: currentTempC,
    feelsLikeF: isDay ? 93 : 75,
    feelsLikeC: isDay ? 34 : 24,
    humidity: 34,
    windSpeedMph: 9,
    windSpeedKmh: 14,
    uvIndex: isDay ? 7 : 0,
    weatherCode: 1, // Despejado
    conditionText: isDay ? 'Parcialmente soleado' : 'Cielo despejado',
    isDay,
    precipitationProbability: 2,
    sunriseTime: '06:48 AM',
    sunsetTime: '07:15 PM',
    loboMood: calculateLoboMood({
      weatherCode: 1,
      tempF: currentTempF,
      windSpeedMph: 9,
      isDay,
      currentHour,
    }),
  };

  // Generar 24 horas a partir de la hora ACTUAL de Juárez
  const hourly: HourlyForecastItem[] = [];
  for (let i = 0; i < 24; i++) {
    const forecastHour = (currentHour + i) % 24;
    const hourIsDay = forecastHour >= 6 && forecastHour < 20;
    
    let tempF = 72;
    if (forecastHour >= 14 && forecastHour <= 17) tempF = 92;
    else if (forecastHour >= 11 && forecastHour < 14) tempF = 88;
    else if (forecastHour >= 18 && forecastHour <= 20) tempF = 82;
    else if (forecastHour >= 21 || forecastHour <= 2) tempF = 74;
    else tempF = 68;

    const displayHour = forecastHour === 0 ? 12 : forecastHour > 12 ? forecastHour - 12 : forecastHour;
    const ampm = forecastHour >= 12 ? 'PM' : 'AM';
    const label = i === 0 ? 'Ahora' : `${displayHour} ${ampm}`;
    const hourWindMph = 7 + (forecastHour % 4) * 2;
    const hourFeelsF = tempF + (hourIsDay ? 2 : -1);

    hourly.push({
      timeLabel: label,
      timestamp: new Date().toISOString(),
      tempF: i === 0 ? currentTempF : tempF,
      tempC: Math.round(((tempF - 32) * 5) / 9),
      feelsLikeF: i === 0 ? fallbackCurrent.feelsLikeF : hourFeelsF,
      feelsLikeC: Math.round(((hourFeelsF - 32) * 5) / 9),
      windSpeedMph: i === 0 ? fallbackCurrent.windSpeedMph : hourWindMph,
      windSpeedKmh: Math.round(hourWindMph * 1.60934),
      weatherCode: 1,
      precipitationProb: i % 4 === 0 ? 10 : 0,
      isDay: hourIsDay,
    });
  }

  // Generar 7 días
  const dayNames = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
  const months = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];
  const daily: DailyForecastItem[] = [];
  const now = new Date();

  for (let d = 0; d < 7; d++) {
    const futureDate = new Date(now.getTime() + d * 86400000);
    const dayName = d === 0 ? 'Hoy' : dayNames[futureDate.getDay()];
    const dateLabel = `${futureDate.getDate()} ${months[futureDate.getMonth()]}`;

    daily.push({
      dayName,
      dateLabel,
      maxTempF: Math.max(92 - (d % 3), d === 0 ? currentTempF : 80),
      minTempF: 68 - (d % 2),
      maxTempC: Math.round(((92 - (d % 3) - 32) * 5) / 9),
      minTempC: Math.round(((68 - (d % 2) - 32) * 5) / 9),
      weatherCode: d === 2 ? 61 : d === 4 ? 95 : 1,
      precipitationProb: d === 2 ? 40 : d === 4 ? 65 : 5,
      conditionText: d === 2 ? 'Lluvia aislada' : d === 4 ? 'Tormenta eléctrica' : 'Soleado',
    });
  }

  return {
    city: 'Ciudad Juárez',
    neighborhood: 'Campestre Senecú',
    current: fallbackCurrent,
    hourly,
    daily,
    lastUpdated: jTime.timeString,
  };
}

/**
 * Identifica la colonia o zona de Ciudad Juárez por proximidad de coordenadas
 */
export function getJuarezZoneName(lat: number, lon: number): string {
  // Campestre Senecú / Bermúdez
  if (lat >= 31.705 && lat <= 31.730 && lon >= -106.415 && lon <= -106.385) {
    return 'Campestre Senecú';
  }
  // Campos Elíseos
  if (lat >= 31.700 && lat <= 31.730 && lon >= -106.385 && lon <= -106.350) {
    return 'Campos Elíseos';
  }
  // Valle del Sol / Francisco Villarreal
  if (lat >= 31.700 && lat <= 31.745 && lon >= -106.380 && lon <= -106.330) {
    return 'Valle del Sol';
  }
  // Las Misiones / Gómez Morín / Ejército Nacional
  if (lat >= 31.670 && lat <= 31.705 && lon >= -106.415 && lon <= -106.380) {
    return 'Las Misiones';
  }
  // Zona PRONAF / San Lorenzo / Lincoln
  if (lat >= 31.725 && lat <= 31.755 && lon >= -106.455 && lon <= -106.415) {
    return 'Zona Pronaf';
  }
  // Centro Histórico / Malecón
  if (lat >= 31.735 && lat <= 31.765 && lon >= -106.495 && lon <= -106.455) {
    return 'Centro Histórico';
  }
  // Zona Aeropuerto / Torres
  if (lat >= 31.620 && lat <= 31.665 && lon >= -106.445 && lon <= -106.405) {
    return 'Zona Aeropuerto';
  }
  // El Paso Border
  if (lat >= 31.755 && lon <= -106.390) {
    return 'Frontera / El Paso';
  }
  return 'Ciudad Juárez';
}

/**
 * Realiza reverse geocoding para obtener la colonia y ciudad de las coordenadas
 */
export async function reverseGeocodeCoords(lat: number, lon: number): Promise<{ city: string; neighborhood: string }> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2000);
    const res = await fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=es`, {
      signal: controller.signal,
    });
    clearTimeout(timeoutId);
    if (res.ok) {
      const data = await res.json();
      const city = data.city || data.locality || 'Ciudad Juárez';
      const localZone = getJuarezZoneName(lat, lon);
      const neighborhood = localZone !== 'Ciudad Juárez' ? localZone : (data.locality || 'Campestre Senecú');
      return { city, neighborhood };
    }
  } catch (err) {
    // Si falla o tarda, usar el reconocedor local
  }

  return {
    city: 'Ciudad Juárez',
    neighborhood: getJuarezZoneName(lat, lon),
  };
}

/**
 * Consulta la API pública Open-Meteo para Ciudad Juárez o la ubicación GPS exacta del usuario
 */
export async function fetchJuarezWeather(coords?: { lat: number; lon: number }): Promise<WeatherData> {
  const targetLat = coords ? coords.lat : JUAREZ_LAT;
  const targetLon = coords ? coords.lon : JUAREZ_LON;

  try {
    const geoPromise = reverseGeocodeCoords(targetLat, targetLon);
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${targetLat}&longitude=${targetLon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,weather_code,wind_speed_10m,uv_index,cloud_cover&hourly=temperature_2m,apparent_temperature,precipitation_probability,weather_code,wind_speed_10m,is_day&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max,sunrise,sunset&temperature_unit=fahrenheit&wind_speed_unit=mph&precipitation_unit=inch&timezone=auto`;

    const res = await fetch(url, { next: { revalidate: 300 } });
    if (!res.ok) {
      console.warn('Open-Meteo response not ok, using fallback Juárez weather');
      return getFallbackWeatherData();
    }

    const data = await res.json();
    const current = data.current;
    if (!current) return getFallbackWeatherData();

    const geoInfo = await geoPromise;

    const tempF = Math.round(current.temperature_2m);
    const tempC = Math.round(((tempF - 32) * 5) / 9);
    const feelsLikeF = Math.round(current.apparent_temperature ?? tempF);
    const feelsLikeC = Math.round(((feelsLikeF - 32) * 5) / 9);
    const isDay = current.is_day === 1;
    const windMph = Math.round(current.wind_speed_10m);
    const windKmh = Math.round(windMph * 1.60934);
    const weatherCode = current.weather_code ?? 0;
    const cloudCover = Math.round(current.cloud_cover ?? 0);

    const jTime = getJuarezLocalTime();
    const currentHour = jTime.hour;

    // Horarios de las próximas horas sincronizados con la hora real de Juárez
    const hourlyTimes: string[] = data.hourly?.time || [];
    const hourlyTemps: number[] = data.hourly?.temperature_2m || [];
    const hourlyApparent: number[] = data.hourly?.apparent_temperature || [];
    const hourlyWind: number[] = data.hourly?.wind_speed_10m || [];
    const hourlyCodes: number[] = data.hourly?.weather_code || [];
    const hourlyPrecip: number[] = data.hourly?.precipitation_probability || [];
    const hourlyIsDay: number[] = data.hourly?.is_day || [];

    // Extraer la hora local de current.time (ej. "2026-09-15T18:15" -> "2026-09-15T18")
    const currentTargetHour = current.time ? current.time.slice(0, 13) : '';
    let startIndex = hourlyTimes.findIndex(t => t.startsWith(currentTargetHour));

    // Si no hay coincidencia exacta de string, buscar por proximidad temporal en ms
    if (startIndex === -1 && current.time) {
      const currentTimeMs = new Date(current.time).getTime();
      let minDiff = Infinity;
      hourlyTimes.forEach((t, idx) => {
        const diff = Math.abs(new Date(t).getTime() - currentTimeMs);
        if (diff < minDiff) {
          minDiff = diff;
          startIndex = idx;
        }
      });
    }
    if (startIndex === -1) startIndex = 0;

    const hourlyList: HourlyForecastItem[] = [];
    for (let i = 0; i < 24 && startIndex + i < hourlyTimes.length; i++) {
      const idx = startIndex + i;
      const timeStr = hourlyTimes[idx]; // ej. "2026-09-15T18:00"
      
      // Obtener hora local de Juárez directamente del string para evitar cualquier desface del navegador
      const hourNum = parseInt(timeStr.slice(11, 13), 10);
      const displayHour = hourNum === 0 ? 12 : hourNum > 12 ? hourNum - 12 : hourNum;
      const ampm = hourNum >= 12 ? 'PM' : 'AM';
      const label = i === 0 ? 'Ahora' : `${displayHour} ${ampm}`;

      // En el punto 0 ("Ahora"), sincronizar 100% con la temperatura actual en vivo
      const tF = i === 0 ? tempF : Math.round(hourlyTemps[idx] ?? tempF);
      const aF = i === 0 ? feelsLikeF : Math.round(hourlyApparent[idx] ?? tF);
      const wMph = i === 0 ? windMph : Math.round(hourlyWind[idx] ?? windMph);
      const wKmh = Math.round(wMph * 1.60934);

      hourlyList.push({
        timeLabel: label,
        timestamp: timeStr,
        tempF: tF,
        tempC: Math.round(((tF - 32) * 5) / 9),
        feelsLikeF: aF,
        feelsLikeC: Math.round(((aF - 32) * 5) / 9),
        windSpeedMph: wMph,
        windSpeedKmh: wKmh,
        weatherCode: hourlyCodes[idx] ?? weatherCode,
        precipitationProb: hourlyPrecip[idx] ?? 0,
        isDay: hourlyIsDay[idx] === 1,
      });
    }

    // Mapear 7 días con fechas exactas sin desfase de zona horaria
    const dailyTimes: string[] = data.daily?.time || [];
    const dailyCodes: number[] = data.daily?.weather_code || [];
    const dailyMax: number[] = data.daily?.temperature_2m_max || [];
    const dailyMin: number[] = data.daily?.temperature_2m_min || [];
    const dailyPrecip: number[] = data.daily?.precipitation_probability_max || [];
    const dayNames = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
    const months = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];

    const dailyList: DailyForecastItem[] = [];
    for (let d = 0; d < Math.min(7, dailyTimes.length); d++) {
      const parts = dailyTimes[d].split('-').map(Number); // [2026, 9, 15]
      const year = parts[0];
      const month = parts[1];
      const day = parts[2];
      const dDate = new Date(year, month - 1, day, 12, 0, 0);
      const dayName = d === 0 ? 'Hoy' : dayNames[dDate.getDay()];
      const dateLabel = `${day} ${months[month - 1]}`;

      let maxF = Math.round(dailyMax[d] ?? tempF);
      let minF = Math.round(dailyMin[d] ?? (tempF - 15));
      if (d === 0) {
        maxF = Math.max(maxF, tempF);
        minF = Math.min(minF, tempF);
      }

      const code = dailyCodes[d] ?? 0;

      dailyList.push({
        dayName,
        dateLabel,
        maxTempF: maxF,
        minTempF: minF,
        maxTempC: Math.round(((maxF - 32) * 5) / 9),
        minTempC: Math.round(((minF - 32) * 5) / 9),
        weatherCode: code,
        precipitationProb: dailyPrecip[d] ?? 0,
        conditionText: getWmoConditionText(code),
      });
    }

    // Sunrise / sunset formatting
    const rawSunrise = data.daily?.sunrise?.[0];
    const rawSunset = data.daily?.sunset?.[0];
    const formatTime = (iso?: string) => {
      if (!iso) return '--:--';
      // "2026-09-15T06:48"
      const hourPart = parseInt(iso.slice(11, 13), 10);
      const minPart = iso.slice(14, 16);
      const disHour = hourPart === 0 ? 12 : hourPart > 12 ? hourPart - 12 : hourPart;
      const ampm = hourPart >= 12 ? 'PM' : 'AM';
      return `${disHour}:${minPart} ${ampm}`;
    };

    const loboMood = calculateLoboMood({
      weatherCode,
      tempF,
      windSpeedMph: windMph,
      isDay,
      currentHour,
      cloudCover,
    });

    let conditionText = getWmoConditionText(weatherCode);
    if (cloudCover >= 65 && (weatherCode === 0 || weatherCode === 1)) {
      conditionText = 'Mayormente nublado';
    }

    return {
      city: geoInfo.city,
      neighborhood: geoInfo.neighborhood,
      current: {
        temperatureF: tempF,
        temperatureC: tempC,
        feelsLikeF,
        feelsLikeC,
        humidity: Math.round(current.relative_humidity_2m ?? 35),
        windSpeedMph: windMph,
        windSpeedKmh: windKmh,
        uvIndex: Math.round(current.uv_index ?? 0),
        weatherCode,
        conditionText,
        isDay,
        precipitationProbability: Math.round(current.precipitation ?? 0),
        sunriseTime: formatTime(rawSunrise),
        sunsetTime: formatTime(rawSunset),
        loboMood,
      },
      hourly: hourlyList,
      daily: dailyList,
      lastUpdated: jTime.timeString,
    };
  } catch (error) {
    console.error('Error fetching Juarez weather:', error);
    return getFallbackWeatherData();
  }
}

/**
 * Semáforo de seguridad para pasear a Lobo y no quemar sus patitas
 */
export function getPawWalkSafety(tempF: number, isDay: boolean): {
  level: 'safe' | 'caution' | 'danger';
  title: string;
  advice: string;
  badgeBg: string;
  badgeColor: string;
} {
  if (tempF >= 90 && isDay) {
    return {
      level: 'danger',
      title: '¡Peligro! Pavimento Ardiendo 🐾🔥',
      advice: 'El asfalto de Juárez quema patitas. Lobo debe quedarse adentro en el aire fresco.',
      badgeBg: 'bg-rose-500/10 border-rose-500/30',
      badgeColor: 'text-rose-400',
    };
  }
  if (tempF >= 82 && isDay) {
    return {
      level: 'caution',
      title: 'Precaución con el Suelo 🟡',
      advice: 'Prueba el piso 7 segundos con el dorso de tu mano antes de salir.',
      badgeBg: 'bg-amber-500/10 border-amber-500/30',
      badgeColor: 'text-amber-400',
    };
  }
  if (tempF <= 45) {
    return {
      level: 'safe',
      title: '¡Paraíso Ártico de Lobo! ❄️',
      advice: 'Lobo está en su mero mole feliz. ¡A Amorcillo le toca llevar chamarra caliente!',
      badgeBg: 'bg-blue-500/10 border-blue-500/30',
      badgeColor: 'text-blue-400',
    };
  }
  return {
    level: 'safe',
    title: 'Paseo 100% Seguro 🟢',
    advice: 'Temperatura agradable para caminar juntos por Campestre Senecú.',
    badgeBg: 'bg-emerald-500/10 border-emerald-500/30',
    badgeColor: 'text-emerald-400',
  };
}

/**
 * Agrupa las próximas horas en los 4 momentos clave del día juarense
 */
export function calculateDayParts(hourly: HourlyForecastItem[], currentHour: number): DayPartItem[] {
  const getHourNum = (item: HourlyForecastItem) => {
    if (item.timestamp && item.timestamp.length >= 13) {
      return parseInt(item.timestamp.slice(11, 13), 10);
    }
    return 12;
  };

  const getPartData = (hoursRange: number[]) => {
    const matching = hourly.filter(item => hoursRange.includes(getHourNum(item)));
    if (matching.length === 0) {
      return { tempF: 80, tempC: 27, weatherCode: 1 };
    }
    const tempsF = matching.map(m => m.tempF);
    const avgF = Math.round(tempsF.reduce((a, b) => a + b, 0) / tempsF.length);
    const avgC = Math.round(((avgF - 32) * 5) / 9);
    return {
      tempF: avgF,
      tempC: avgC,
      weatherCode: matching[0].weatherCode,
    };
  };

  const morningData = getPartData([6, 7, 8, 9, 10, 11]);
  const afternoonData = getPartData([12, 13, 14, 15, 16, 17]);
  const sunsetData = getPartData([18, 19, 20]);
  const nightData = getPartData([21, 22, 23, 0, 1, 2, 3, 4, 5]);

  return [
    {
      key: 'morning',
      name: 'Mañana',
      timeRange: '06:00 AM – 11:59 AM',
      tempF: morningData.tempF,
      tempC: morningData.tempC,
      weatherCode: morningData.weatherCode,
      isCurrent: currentHour >= 6 && currentHour < 12,
      advice: 'Cafecito caliente para Amorcillo y aire fresco matutino para Lobo.',
      loboTip: '¡Hora de estirar patitas en el patio antes de que caliente el sol!',
    },
    {
      key: 'afternoon',
      name: 'Tarde',
      timeRange: '12:00 PM – 05:59 PM',
      tempF: afternoonData.tempF,
      tempC: afternoonData.tempC,
      weatherCode: afternoonData.weatherCode,
      isCurrent: currentHour >= 12 && currentHour < 18,
      advice: 'Pico de calor en Juárez; minisplit encendido y agua fresca para Lobo.',
      loboTip: 'Lobo en modo alfombra sobre el piso fresco.',
    },
    {
      key: 'sunset',
      name: 'Atardecer',
      timeRange: '06:00 PM – 08:59 PM',
      tempF: sunsetData.tempF,
      tempC: sunsetData.tempC,
      weatherCode: sunsetData.weatherCode,
      isCurrent: currentHour >= 18 && currentHour < 21,
      advice: 'Cielo dorado y rosado juarense; el calor cede y el clima se vuelve delicioso.',
      loboTip: 'Lobo asomado a la barda disfrutando la brisa de la tarde.',
    },
    {
      key: 'night',
      name: 'Noche',
      timeRange: '09:00 PM – 05:59 AM',
      tempF: nightData.tempF,
      tempC: nightData.tempC,
      weatherCode: nightData.weatherCode,
      isCurrent: currentHour >= 21 || currentHour < 6,
      advice: 'Noche serena y fresca; cobijita rica para que Corazoncillo descanse.',
      loboTip: 'Lobo hecho rosquilla durmiendo plácidamente.',
    },
  ];
}

/**
 * Detecta si hay tolvaneras o rachas de viento desértico en las próximas 24 horas
 */
export function detectJuarezDustWind(hourly: HourlyForecastItem[]): DustWindAlert {
  const items = hourly.slice(0, 24);
  let maxMph = 0;
  let maxKmh = 0;
  const windyHours: string[] = [];

  for (const item of items) {
    if (item.windSpeedMph > maxMph) {
      maxMph = item.windSpeedMph;
      maxKmh = item.windSpeedKmh;
    }
    if (item.windSpeedMph >= 14) {
      windyHours.push(item.timeLabel);
    }
  }

  if (maxMph >= 15) {
    const firstWindy = windyHours[0] || 'la tarde';
    const lastWindy = windyHours[windyHours.length - 1] || 'la noche';
    const peakWindow = windyHours.length > 1 ? `de ${firstWindy} a ${lastWindy}` : `alrededor de ${firstWindy}`;

    let severity: 'moderate' | 'warning' | 'severe' = 'moderate';
    if (maxMph >= 24) severity = 'severe';
    else if (maxMph >= 18) severity = 'warning';

    const title = maxMph >= 20 ? '¡Alerta de Tolvanera Juarense! 💨' : 'Viento Desértico en Camino 💨';

    return {
      hasAlert: true,
      maxWindMph: maxMph,
      maxWindKmh: maxKmh,
      peakTimeWindow: peakWindow,
      severity,
      title,
      message: `Rachas de hasta ${maxMph} mph previstas (${peakWindow}). Corazoncillo, protege tus ojos con lentes al salir y asegura las ventanas para que no entre tierrita a casa.`,
      loboAction: 'Lobo listo con sus goggles y capa de superhéroe juarense 🥽🐾',
    };
  }

  return {
    hasAlert: false,
    maxWindMph: maxMph,
    maxWindKmh: maxKmh,
    peakTimeWindow: 'todo el día',
    severity: 'calm',
    title: 'Viento Calmo en Juárez 🍃',
    message: `Brisa suave de ${maxMph} mph. Cielo limpio en Campestre Senecú sin tolvaneras.`,
    loboAction: 'Lobo disfrutando la brisa tranquila con su pelaje ondeando suave.',
  };
}

