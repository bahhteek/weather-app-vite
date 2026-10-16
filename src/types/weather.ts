export interface WeatherData {
  current: {
    weather_code: number;
    temperature_2m: number;
    relative_humidity_2m: number;
    wind_speed_10m: number;
  };
  name: string;
  country: string;
}

export type Theme = "light" | "dark";

export interface WeatherState {
  data: WeatherData | null;
  cityName: string | null;
  loading: boolean;
  error: string;
  controller: AbortController | null;
}

export interface GeoCity {
  latitude: number;
  longitude: number;
  country: string;
  name: string;
}

export type CityLabel = Pick<WeatherData, "name" | "country">

export type WeatherDraft = Partial<WeatherData>

export function labelOf(data: WeatherData): CityLabel {
  return { name: data.name, country: data.country }
}