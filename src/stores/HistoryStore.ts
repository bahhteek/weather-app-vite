import { makeAutoObservable, reaction, runInAction } from "mobx"
import type { RootStore } from "./RootStore"

const API = import.meta.env.VITE_API_URL ?? "http://localhost:3000";

export class HistoryStore {
  cities: string[] = [];
  root: RootStore | null = null;
  token = ""

  constructor(root: RootStore) {
    this.root = root;
    makeAutoObservable(this, {}, { autoBind: true });

    reaction(
      () => this.root?.weatherStore.cityName,
      (cityName) => {
        if (!cityName || !this.root) return;

        this.loadHistory();
      },
    );

    this.loadHistory();
  }

  async login(password: string) {
    if (!password) return;
    const response = await fetch(`${API}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    const data = await response.json()
    if (!response.ok) throw new Error(data.error ?? "Неверный пароль")
    runInAction(() => {
      this.token = data.token;
    })
  }

  async loadHistory() {
    const response = await fetch(`${API}/history`)
    const rows = await response.json()
    runInAction(() => {
      this.cities = rows.map((row: { name: string }) => row.name)
    })
  }

  async removeHistory() {
    const response = await fetch(`${API}/history`, {
      method: "DELETE",
      headers: { Authorization: this.token },
    });
    const data = await response.json()
    if (!response.ok) throw new Error(data.error ?? "Нет допуска")
    runInAction(() => {
      this.cities = data
    })
  }
}