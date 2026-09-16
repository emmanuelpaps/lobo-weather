export type LoboMood = 
  | 'sunny'
  | 'cloudy'
  | 'thunderstorm'
  | 'heat'
  | 'winter'
  | 'windy'
  | 'rain'
  | 'sunset'
  | 'night';

export type TempUnit = 'F' | 'C';

export interface WeatherConditionInfo {
  mood: LoboMood;
  title: string;
  description: string;
  imageSrc: string;
  images: string[];
  bgColor: string;
  accentColor: string;
  bannerGradient: string;
}

export interface CurrentWeather {
  temperatureF: number;
  temperatureC: number;
  feelsLikeF: number;
  feelsLikeC: number;
  humidity: number;
  windSpeedMph: number;
  windSpeedKmh: number;
  uvIndex: number;
  weatherCode: number;
  conditionText: string;
  isDay: boolean;
  precipitationProbability: number;
  sunriseTime: string;
  sunsetTime: string;
  loboMood: LoboMood;
}

export interface HourlyForecastItem {
  timeLabel: string;
  timestamp: string;
  tempF: number;
  tempC: number;
  feelsLikeF: number;
  feelsLikeC: number;
  windSpeedMph: number;
  windSpeedKmh: number;
  weatherCode: number;
  precipitationProb: number;
  isDay: boolean;
}

export type DayPartKey = 'morning' | 'afternoon' | 'sunset' | 'night';

export interface DayPartItem {
  key: DayPartKey;
  name: string;
  timeRange: string;
  tempF: number;
  tempC: number;
  weatherCode: number;
  isCurrent: boolean;
  advice: string;
  loboTip: string;
}

export interface DustWindAlert {
  hasAlert: boolean;
  maxWindMph: number;
  maxWindKmh: number;
  peakTimeWindow: string;
  severity: 'calm' | 'moderate' | 'warning' | 'severe';
  title: string;
  message: string;
  loboAction: string;
}

export interface DailyForecastItem {
  dayName: string;
  dateLabel: string;
  maxTempF: number;
  minTempF: number;
  maxTempC: number;
  minTempC: number;
  weatherCode: number;
  precipitationProb: number;
  conditionText: string;
}

export interface WeatherData {
  city: string;
  neighborhood: string;
  current: CurrentWeather;
  hourly: HourlyForecastItem[];
  daily: DailyForecastItem[];
  lastUpdated: string;
}
