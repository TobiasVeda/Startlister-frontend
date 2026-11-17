import {Dispatch, SetStateAction, useEffect, useState} from "react";

// useState wrapper which persist between page navigation by saving state to local storage
export function useLocalStorage<T>(key: string, initialValue?: T): [T, Dispatch<SetStateAction<T>>] {
    const [state, setState] = useState<T>(() => {

        if (typeof window === "undefined") {
            return initialValue;
        }

        try {
            const item = window.localStorage.getItem(key);
            return item ? JSON.parse(item) : initialValue;
        } catch {
            return initialValue;
        }
    });

    useEffect(() => {
        const item = window.localStorage.getItem(key);
        if (item) {
            setState(JSON.parse(item));
        }
    }, []);

    useEffect(() => {
        try {
            window.localStorage.setItem(key, JSON.stringify(state));
        } catch {
            // ignore storage errors
        }
    }, [state])

    return [state, setState];
}