import { makeAutoObservable, reaction } from "mobx"
import type { RootStore } from "./RootStore"
import { addCity } from "../utils/addCity"

export class HistoryStore {
  cities: string[] = JSON.parse(localStorage.getItem("history") ?? "[]") || [];
  root: RootStore | null = null;

  constructor(root: RootStore) {
    this.root = root;
    makeAutoObservable(this, {}, { autoBind: true });

    reaction(
      () => this.root?.weatherStore.cityName,
      (cityName) => {
        if (!cityName || !this.root) return;

        const next = addCity(this.cities, cityName);
        if (next === this.cities) return;

        this.cities = next;
        localStorage.setItem("history", JSON.stringify(this.cities));
      },
    );
  }
}