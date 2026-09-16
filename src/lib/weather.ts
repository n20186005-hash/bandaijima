import { attraction, weatherConfig } from '../config/site';

/**
 * 天気モジュールのデータ取得。
 * ビルド時（サーバー処理）で取得してメモリへキャッシュし、
 * 画面側でも同じ変換処理を再利用して差分を反映する。
 */

export const weatherEndpoint = 'https://api.open-meteo.com/v1/forecast';
export const marineEndpoint = 'https://marine-api.open-meteo.com/v1/marine';

export interface WeatherCurrent {
  temp: number;
  feels: number;
  humidity: number;
  precip: number;
  code: number;
  wind: number;
  windDir: number;
  /** 最大瞬間風速（m/s） */
  gust: number;
  /** 紫外線指数 */
  uv: number;
  /** 視程（m）。取得できない場合は NaN */
  visibility: number;
  time: string;
}

export interface WeatherDay {
  date: string;
  weekday: string;
  code: number;
  tmax: number;
  tmin: number;
  /** 体感の最高気温 */
  feelsMax: number;
  precip: number;
  pop: number;
  /** 降水が予想される時間数 */
  precipHours: number;
  /** 降雪量（cm） */
  snowfall: number;
  wind: number;
  /** 最大瞬間風速（m/s） */
  gust: number;
  uvMax: number;
  sunrise: string;
  sunset: string;
}

export interface WeatherHour {
  time: string;
  date: string;
  temp: number;
  pop: number;
  code: number;
  uv: number;
}

/** 港湾・海岸向けの海側データ（欠測の項目は null） */
export interface SeaData {
  waveMax: number | null;
  wavePeriod: number | null;
  sst: number | null;
}

export interface WeatherData {
  current: WeatherCurrent;
  days: WeatherDay[];
  hours: WeatherHour[];
  sea: SeaData | null;
  fetchedAt: string;
  timezone: string;
}

export interface WeatherResult {
  data: WeatherData | null;
  /** 取得できず、保持していた値を表示している状態 */
  stale: boolean;
}

interface CacheEntry {
  at: number;
  data: WeatherData;
}

let cache: CacheEntry | null = null;

const WEEKDAYS = ['日', '月', '火', '水', '木', '金', '土'];

/** 取得できない値を null に正規化する */
function num(value: unknown): number | null {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

export function weatherRequestUrl(): string {
  const params = new URLSearchParams({
    latitude: String(attraction.coordinates.latitude),
    longitude: String(attraction.coordinates.longitude),
    current:
      'temperature_2m,apparent_temperature,relative_humidity_2m,precipitation,weather_code,wind_speed_10m,wind_direction_10m,wind_gusts_10m,uv_index,visibility',
    hourly: 'temperature_2m,precipitation_probability,weather_code,uv_index,visibility',
    daily:
      'weather_code,temperature_2m_max,temperature_2m_min,apparent_temperature_max,precipitation_sum,precipitation_probability_max,precipitation_hours,snowfall_sum,wind_speed_10m_max,wind_gusts_10m_max,uv_index_max,sunrise,sunset',
    timezone: weatherConfig.timezone,
    forecast_days: '7',
    wind_speed_unit: 'ms',
  });
  return `${weatherEndpoint}?${params.toString()}`;
}

/** 港湾ならではの判断材料（波・うねり・海水温） */
export function marineRequestUrl(): string {
  const params = new URLSearchParams({
    latitude: String(attraction.coordinates.latitude),
    longitude: String(attraction.coordinates.longitude),
    daily: 'wave_height_max,wave_period_max,sea_surface_temperature_max',
    timezone: weatherConfig.timezone,
    forecast_days: '7',
  });
  return `${marineEndpoint}?${params.toString()}`;
}

function readSea(payload: any): SeaData | null {
  const daily = payload?.daily ?? {};
  const waveMax = num(daily.wave_height_max?.[0]);
  const wavePeriod = num(daily.wave_period_max?.[0]);
  const sst = num(daily.sea_surface_temperature_max?.[0]);
  if (waveMax === null && sst === null) return null;
  return { waveMax, wavePeriod, sst };
}

export function toWeatherData(payload: any, marine: any = null): WeatherData {
  const current = payload?.current ?? {};
  const daily = payload?.daily ?? {};
  const hourly = payload?.hourly ?? {};

  const days: WeatherDay[] = (daily.time ?? []).map((date: string, index: number) => ({
    date,
    weekday: WEEKDAYS[new Date(`${date}T00:00:00`).getDay()] ?? '',
    code: Number(daily.weather_code?.[index] ?? 0),
    tmax: Number(daily.temperature_2m_max?.[index] ?? 0),
    tmin: Number(daily.temperature_2m_min?.[index] ?? 0),
    feelsMax: Number(daily.apparent_temperature_max?.[index] ?? daily.temperature_2m_max?.[index] ?? 0),
    precip: Number(daily.precipitation_sum?.[index] ?? 0),
    pop: Number(daily.precipitation_probability_max?.[index] ?? 0),
    precipHours: Number(daily.precipitation_hours?.[index] ?? 0),
    snowfall: Number(daily.snowfall_sum?.[index] ?? 0),
    wind: Number(daily.wind_speed_10m_max?.[index] ?? 0),
    gust: Number(daily.wind_gusts_10m_max?.[index] ?? 0),
    uvMax: Number(daily.uv_index_max?.[index] ?? 0),
    sunrise: String(daily.sunrise?.[index] ?? '').slice(11, 16),
    sunset: String(daily.sunset?.[index] ?? '').slice(11, 16),
  }));

  const hours: WeatherHour[] = (hourly.time ?? []).map((time: string, index: number) => ({
    time: String(time).slice(11, 16),
    date: String(time).slice(0, 10),
    temp: Number(hourly.temperature_2m?.[index] ?? 0),
    pop: Number(hourly.precipitation_probability?.[index] ?? 0),
    code: Number(hourly.weather_code?.[index] ?? 0),
    uv: Number(hourly.uv_index?.[index] ?? 0),
  }));

  return {
    current: {
      temp: Number(current.temperature_2m ?? 0),
      feels: Number(current.apparent_temperature ?? 0),
      humidity: Number(current.relative_humidity_2m ?? 0),
      precip: Number(current.precipitation ?? 0),
      code: Number(current.weather_code ?? 0),
      wind: Number(current.wind_speed_10m ?? 0),
      windDir: Number(current.wind_direction_10m ?? 0),
      gust: Number(current.wind_gusts_10m ?? 0),
      uv: Number(current.uv_index ?? 0),
      visibility: Number(current.visibility ?? Number.NaN),
      time: String(current.time ?? '').replace('T', ' ').slice(0, 16),
    },
    days,
    hours,
    sea: readSea(marine),
    fetchedAt: new Date().toISOString(),
    timezone: payload?.timezone ?? weatherConfig.timezone,
  };
}

/** サーバー処理（ビルド／リクエスト）で天気を取得し、一定時間キャッシュする。 */
export async function getWeather(): Promise<WeatherResult> {
  const ttl = weatherConfig.cacheMinutes * 60 * 1000;
  const now = Date.now();

  if (cache && now - cache.at < ttl) {
    return { data: cache.data, stale: false };
  }

  try {
    const [forecastResponse, marineResponse] = await Promise.all([
      fetch(weatherRequestUrl(), { headers: { accept: 'application/json' } }),
      fetch(marineRequestUrl(), { headers: { accept: 'application/json' } }),
    ]);

    if (!forecastResponse.ok) {
      throw new Error(`weather request failed: ${forecastResponse.status}`);
    }

    const [forecast, marine] = await Promise.all([
      forecastResponse.json(),
      marineResponse.ok ? marineResponse.json() : Promise.resolve(null),
    ]);

    const data = toWeatherData(forecast, marine);

    if (!data.days.length) {
      throw new Error('weather payload has no daily data');
    }

    cache = { at: now, data };
    return { data, stale: false };
  } catch {
    if (cache) {
      return { data: cache.data, stale: true };
    }
    return { data: null, stale: true };
  }
}

function toMinutes(hhmm: string): number {
  const [hour, minute] = hhmm.split(':');
  return Number(hour) * 60 + Number(minute);
}

/** 現在時刻以降の正時を起点に、指定数の時間スロットを取り出す。 */
export function selectHourSlots(data: WeatherData, count: number): WeatherHour[] {
  const today = data.days[0];
  if (!today) return [];
  const nowMinutes = toMinutes(data.current.time.slice(11, 16));
  return data.hours
    .filter((hour) => hour.date === today.date && toMinutes(hour.time) >= nowMinutes - (nowMinutes % 60) && hour.time.endsWith('00'))
    .slice(0, count);
}

export type WeatherIconName = 'sun' | 'cloud-sun' | 'cloud' | 'fog' | 'rain' | 'snow' | 'storm';

export function weatherIcon(code: number): WeatherIconName {
  if (code === 0) return 'sun';
  if (code === 1 || code === 2) return 'cloud-sun';
  if (code === 3) return 'cloud';
  if (code === 45 || code === 48) return 'fog';
  if (code >= 51 && code <= 57) return 'rain';
  if ((code >= 61 && code <= 67) || (code >= 80 && code <= 82)) return 'rain';
  if ((code >= 71 && code <= 77) || code === 85 || code === 86) return 'snow';
  if (code >= 95) return 'storm';
  return 'cloud';
}

export function weatherLabel(code: number): string {
  if (code === 0) return '快晴';
  if (code === 1) return '晴れ';
  if (code === 2) return '晴れ時々くもり';
  if (code === 3) return 'くもり';
  if (code === 45 || code === 48) return '霧';
  if (code === 51 || code === 53 || code === 55) return '霧雨';
  if (code === 56 || code === 57) return '着氷性の霧雨';
  if (code === 61) return '弱い雨';
  if (code === 63) return '雨';
  if (code === 65) return '強い雨';
  if (code === 66 || code === 67) return '着氷性の雨';
  if (code === 71) return '弱い雪';
  if (code === 73) return '雪';
  if (code === 75) return '大雪';
  if (code === 77) return '霧雪';
  if (code === 80) return 'にわか雨';
  if (code === 81) return 'にわか雨（やや強い）';
  if (code === 82) return '激しいにわか雨';
  if (code === 85) return 'にわか雪';
  if (code === 86) return 'にわか雪（強い）';
  if (code === 95) return '雷雨';
  if (code === 96 || code === 99) return '雷雨（ひょう）';
  return 'くもり';
}

export function windDirectionLabel(degrees: number): string {
  const directions = ['北', '北北東', '北東', '東北東', '東', '東南東', '南東', '南南東', '南', '南南西', '南西', '西南西', '西', '西北西', '北西', '北北西'];
  const index = Math.round((((degrees % 360) + 360) % 360) / 22.5) % 16;
  return directions[index];
}

export function formatUpdatedAt(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return '';
  const pad = (value: number) => String(value).padStart(2, '0');
  return `${date.getMonth() + 1}月${date.getDate()}日 ${pad(date.getHours())}:${pad(date.getMinutes())}`;
}
