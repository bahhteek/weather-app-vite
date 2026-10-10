import { HistoryStore } from "./HistoryStore"
import { ThemeStore } from "./ThemeStore"
import { WeatherStore } from "./WeatherStore"

export class RootStore {

    themeStore: ThemeStore;
    weatherStore: WeatherStore;
    historyStore: HistoryStore;

    constructor() {
        this.themeStore = new ThemeStore();
        this.weatherStore = new WeatherStore();
        this.historyStore = new HistoryStore(this);
    }
}

export const rootStore = new RootStore();