import { makeAutoObservable, reaction } from "mobx"
import { Theme } from "../types/weather"

export class ThemeStore {
  theme: Theme = JSON.parse(localStorage.getItem("theme") ?? "\"light\"")

  constructor() {
    makeAutoObservable(this, {}, { autoBind: true });

    reaction(
      () => this.theme,
      (theme) => {
        localStorage.setItem("theme", JSON.stringify(theme));
      },
    );
  }

  toggleTheme() {
    this.theme = this.theme === "light" ? "dark" : "light";
  }

  get isDark() {
    return this.theme === "dark";
  }
}