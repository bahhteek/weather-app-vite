import { useState } from "react"
import { useWeather } from "../hooks/useWeather"
import { useLocalStorage } from "../hooks/useLocalStorage"

const icons = {
  0: '☀️',   // ясно
  1: '🌤️',  // преимущественно ясно
  2: '⛅',
  3: '☁️',
  61: '🌧️', // дождь
  71: '❄️', // снег
}

function Weather() {
    const [query, setQuery] = useLocalStorage('weatherCityName', '')
    const {data, loading, error} = useWeather(query)
    const [inputValue, setInputValue] = useState(query)

    function onInputValueChange(e) {
        setInputValue(e.target.value)
    }

    function onSearchFormSumbit(e) {
        e.preventDefault()

        const cityName = inputValue.trim()

        if (!cityName) return

        setQuery(cityName)
    }

    return <div id="app">
        <form id="search-form" onSubmit={onSearchFormSumbit}>
            <input id="city-input" value={inputValue} onChange={onInputValueChange} placeholder="Введите город" />
            <button type="submit">Найти</button>
        </form>
        <div className="bottom">
        {data && <div id="weather">
            <h2>{icons[data.current.weather_code] ?? '🌡️'} {data.name}, {data.country}</h2>
            <p>Температура: {data.current.temperature_2m}°C</p>
            <p>Влажность: {data.current.relative_humidity_2m}%</p>
            <p>Ветер: {data.current.wind_speed_10m} км/ч</p>
        </div>}
        {error && <p id="error">{error}</p>}
        {loading && <p id="loading">
            <span className="loading-circle"></span>
            <span className="loading-bg"></span>
        </p>}
        </div>
    </div>
}

export default Weather