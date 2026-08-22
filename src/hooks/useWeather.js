import { useEffect, useState } from "react";

async function geoUrl(city, signal) {
    const response = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=ru`, { signal })

    if (!response.ok) throw new Error(`Ошибка HTTP ${response.status}`)

    const data = await response.json()

    if (!data?.results?.length) throw new Error(`Город не найден`)

    return data
}

async function weatherUrl(lat, lon, signal) {
    const response = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code&timezone=auto`, { signal })

    if (!response.ok) throw new Error(`Ошибка HTTP ${response.status}`)

    const data = await response.json()
    
    if (!data) throw new Error(`Нет данных`)
    
    return data
}

export function useWeather(city) {
    const [data, setData] = useState(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    useEffect(() => {
        if (!city) return

        const controller = new AbortController()
        const { signal } = controller

        async function load() {
            setLoading(true)
            setError('')
            setData(null)
            try {

                const geoRes = await geoUrl(city, signal)

                const {latitude, longitude, country, name} = geoRes?.results[0]

                const wRes = await weatherUrl(latitude, longitude, signal)
                
                setData({...wRes, country, name})
            } catch (e) {
                if (e.name === "AbortError") return
                setError(e.message)
            } finally {
                setLoading(false)
            }
        }

        load()

        return () => controller.abort()
    }, [city])
    
    return {data, loading, error}
}