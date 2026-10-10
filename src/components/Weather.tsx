import { FormEvent, useEffect, useState } from "react"
import { observer } from "mobx-react-lite"
import { rootStore } from "../stores/RootStore"
import { ChangeEvent } from "react"
import { HistoryList } from "./HistoryList"

const icons: Record<number, string> = {
  0: '☀️',   // ясно
  1: '🌤️',  // преимущественно ясно
  2: '⛅',
  3: '☁️',
  61: '🌧️', // дождь
  71: '❄️', // снег
}

export const Weather = observer(function Weather() {
  const { themeStore, weatherStore, historyStore } = rootStore
  const { data, loading, error, load, cityName } = weatherStore
  const [inputValue, setInputValue] = useState(cityName || "")
  const { theme, toggleTheme } = themeStore

  function onInputValueChange(e: ChangeEvent<HTMLInputElement>) {
    setInputValue(e.target.value)
  }

  async function onSearchFormSumbit(e: FormEvent<HTMLFormElement>): Promise<void> {
    e.preventDefault()
    
    const cityName = inputValue.trim()
    
    if (!cityName) return
    
    await load(cityName)
  }

  useEffect(() => {
    if (cityName) {
      load(cityName)
    }
  }, [])

  return (
    <div id="app" className={theme}>
      <div className="change-theme" onClick={toggleTheme}>
        Change theme to {theme === "light" ? "dark" : "light"}
      </div>
      <form id="search-form" onSubmit={onSearchFormSumbit}>
        <input
          id="city-input"
          value={inputValue}
          onChange={onInputValueChange}
          placeholder="Введите город"
        />
        <button type="submit">Найти</button>
      </form>
      <div className="bottom">
        {data && (
          <div id="weather">
            <h2>
              {icons[data.current.weather_code] ?? "🌡️"} {data.name},{" "}
              {data.country}
            </h2>
            <p>Температура: {data.current.temperature_2m}°C</p>
            <p>Влажность: {data.current.relative_humidity_2m}%</p>
            <p>Ветер: {data.current.wind_speed_10m} км/ч</p>
          </div>
        )}
        {error && <p id="error">{error}</p>}
        {loading && (
          <p id="loading">
            <span className="loading-circle"></span>
            <span className="loading-bg"></span>
          </p>
        )}
        <HistoryList cities={historyStore.cities} />
      </div>
    </div>
  );
});