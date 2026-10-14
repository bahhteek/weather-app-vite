import { makeAutoObservable, reaction, runInAction } from "mobx";
import { WeatherData, WeatherState } from "../types/weather";

const API = import.meta.env.VITE_API_URL ?? "http://localhost:3000"

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
      const response = await fetch(
        `${API}/weather?city=${encodeURIComponent(city)}`,
        { signal },
      );

      const data = await response.json();

      if (signal.aborted) return;

      if (!response.ok) throw new Error(data.error ?? `Ошибка HTTP ${response.status}`);

      runInAction(() => {
        this.data = data;
        this.cityName = data.name;
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