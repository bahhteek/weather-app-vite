import { Dispatch, SetStateAction, useEffect, useState } from "react";

export function useLocalStorage<T>(key:string, initialValue: T): [T, Dispatch<SetStateAction<T>>] {
    const [value, setValue] = useState(() => {
        const saved = localStorage.getItem(key)
        if (saved === null) return initialValue
        return JSON.parse(saved) as T
    })

    useEffect(() => {
        localStorage.setItem(key, JSON.stringify(value))
    }, [key, value])

    return [value, setValue]
}