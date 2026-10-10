export function addCity(cities: string[], cityName: string): string[] {
    const name = cityName.trim();
    if (!name || cities.includes(name)) return cities
    return [...cities, name]
}