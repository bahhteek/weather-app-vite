import { makeAutoObservable, reaction, runInAction } from "mobx";
import { Forecast, GeoResponse, WeatherData, WeatherState } from "../types/weather";

async function geoUrl(city: string, signal: AbortSignal): Promise<GeoResponse> {
    const response = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=ru`, { signal })

    if (!response.ok) throw new Error(`Ошибка HTTP ${response.status}`)

    const data = await response.json()

    if (!data?.results?.length) throw new Error(`Город не найден`)

    return data as GeoResponse
}

async function weatherUrl(lat: number, lon: number, signal: AbortSignal): Promise<Forecast> {
    const response = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code&timezone=auto`, { signal })

    if (!response.ok) throw new Error(`Ошибка HTTP ${response.status}`)

    const data = await response.json()
    
    if (!data) throw new Error(`Нет данных`)
    
    return data as Forecast
}

export class WeatherStore implements WeatherState {
  data: WeatherData | null = null;
  cityName: string | null = JSON.parse(
    localStorage.getItem("weatherCityName") ?? "null",
  );
  loading: boolean = false;
  error: string = "";
  controller: AbortController | null = null;

  constructor() {
    makeAutoObservable(this, {}, { autoBind: true });

    reaction(
      () => this.cityName,
      (cityName) => {
        localStorage.setItem("weatherCityName", JSON.stringify(cityName));
      },
    );
  }

  async load(city: string) {
    if (!city) return;
    this.controller?.abort();

    const controller = new AbortController();
    this.controller = controller;
    const { signal } = this.controller;

    this.loading = true;
    this.error = "";
    this.data = null;

    try {
      const geoRes = await geoUrl(city, signal);

      const place = geoRes?.results?.[0]

      if (!place) throw new Error(`Город не найден`)

      const { latitude, longitude, country, name } = place;

      const wRes = await weatherUrl(latitude, longitude, signal);

      if (signal.aborted) return;

      runInAction(() => {
        this.data = { ...wRes, country, name };
        this.cityName = name;
        this.loading = false;
      });
    } catch (e) {
      if (!(e instanceof Error)) return;
      if (e.name === "AbortError") return;
      runInAction(() => {
        this.error = e.message;
        this.loading = false;
      });
    }
  }
}